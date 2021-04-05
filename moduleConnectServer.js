const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mysql = require("mysql");

const session = require("express-session")({
	secret: "a15a7a8df5a9a9d0d1851fa03ce4ebf0f67f140bdee167310b206887d85ec783",
	resave: true,
	saveUninitialized: true,
	cookie: {
		maxAge: 2 * 60 * 60 * 1000,
		secure: false
	}
});

const con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "projet_stratego"
});



const sharedsession = require("express-socket.io-session");
const bodyParser = require('body-parser');

module.exports = {io, con};
const move = require('./Back/Js/Modules/move.js');
const functions = require('./Back/Js/mainGame');
const research = require('./Back/js/research.js');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(urlencodedParser);
app.use(session);
io.use(sharedsession(session, {
	// Session automatiquement sauvegardée en cas de modification
	autoSave: true
  }));

app.use(express.static(__dirname + '/Front/')); // on start toutes les opérations avec des chemins d'accés à partir de /project/ .

app.get('/', (req, res) => {
	console.log(req.session);
	if (req.session.inGame == false || req.session.inGame == undefined) {
		res.sendFile(__dirname + '/Front/Html/index.html');
	}
	else {
		res.sendFile(__dirname + '/Front/Html/game.html');
	}
});

let allCurrentsGames = Array();
let allRooms = Array();

io.on('connection',(socket) =>{

	// Pour conaitre le nom de l'utilisateur
	socket.on('user-name', () => {
		io.to(socket.id).emit('user-name', socket.handshake.session.userName);
	});

	// Pour connaitre toutes les parties en cours sous forme de tableau [[player1,player2,temps],[player1,player2,temps]]
	socket.on('current-games', () => {
		let srvSockets = io.sockets.sockets;
		let table = functions.currentGames(srvSockets, allCurrentsGames);
		io.to(socket.id).emit('current-games', table);
	});
	
	// Pour ajouter un spectateur à une partie
	socket.on('new-spectator', numGame =>{
		let room = research.roomById(allCurrentsGames[numGame].player1.id, allRooms);

		allRooms[room].join(socket.handshake.session.id);
		socket.handshake.session.redirect = true;

		io.to(socket.id).emit('game-redirect');		
	});
	
	// Lorsque on ets en attente d'adversaire
	socket.on('search-game', (revealedRule,scoutRule,bombRule) => {		// Joueurs en recherche

		let srvSockets = io.sockets.sockets;
		let table = functions.waiting(srvSockets,socket,revealedRule,scoutRule,bombRule);
		

		if(table.length == 2 && table[0] != table[1]) {				// 2 joueurs veulent jouer
			
			functions.newGame(table,allCurrentsGames,allRooms,revealedRule, scoutRule,bombRule);

			let x = research.roomById(socket.handshake.session.id, allRooms);

			allRooms[x].simpleEvent(srvSockets, 'game-redirect');
		}
	});

	// Pour connaitre sa couleur avant de placer les pions
	socket.on('preparation', () => {
		socket.handshake.session.wait = false;
		socket.handshake.session.inGame = true;

		let x = research.roomById(socket.handshake.session.id, allRooms);
		let lobby = research.gameByRoom(allRooms[x], allCurrentsGames);

		(lobby.getPlayers().some(player => player == socket.handshake.session.id)) ? 
		io.to(socket.id).emit('preparation', (lobby.player1.id == socket.handshake.session.id) ? lobby.player1.color : lobby.player2.color) : 
		io.to(socket.id).emit('new-spectator', lobby.convertGrid('spectator'), lobby.startTime);
	});

	// Quand le joueur a placé ces pions		
	socket.on('ready', table =>{		
		let srvSockets = io.sockets.sockets;
		let lobby = research.game(socket.handshake.session.id,allCurrentsGames);
		let ready = Array();

		functions.ready(table, socket.handshake.session.id, lobby);

		let pieces = lobby.allPiecesOnGrid();

		if(pieces.filter(elem => elem.getOwner() == lobby.player1.id).length != 0){
			ready.push(lobby.player1.id);
		}
		if(pieces.filter(elem => elem.getOwner() == lobby.player2.id).length != 0){
			ready.push(lobby.player2.id);
		}
		
		if(ready.length == 2){
			lobby.startTime = Date.now(); // remise à zéro du timer
			let x = research.roomById(socket.handshake.session.id, allRooms);
			allRooms[x].display(srvSockets, lobby);
			allRooms[x].simpleEvent(srvSockets, 'start');
		}
		else{
			io.to(research.idOf(srvSockets,ready[0])).emit('display', lobby.convertGrid(ready[0]), 'none', false);
		}
	});

	socket.on("cases", (numCase, event) => {
		let lobby = research.game(socket.handshake.session.id, allCurrentsGames);
		if(socket.handshake.session.id == lobby.player1.id) numCase = 99 - numCase;
		io.to(socket.id).emit("cases", functions.getCases(lobby, numCase), event);
	})

	// Lors d'un mouvement
	socket.on('click', (numPiece, numMove) => {
		let lobby = research.game(socket.handshake.session.id, allCurrentsGames);
		if(socket.handshake.session.id == lobby.player1.id){
			numPiece = 99 - numPiece;
			numMove = 99 - numMove;
		}
		let xPiece = Math.floor(numPiece / 10);
		let yPiece = numPiece % 10;
		let xMove = Math.floor(numMove / 10);
		let yMove = numMove % 10;

		move.eventMove(lobby, lobby.getBox(xPiece, yPiece), xMove, yMove);

		let x = research.roomById(socket.handshake.session.id, allRooms);

		allRooms[x].display(io.sockets.sockets, lobby);

		if(lobby.isFinished()){
			allRooms[x].end(io.sockets.sockets, lobby);
			socket.handshake.session.inGame = false;
		}
	});

	// Quand on veut partir de la partie
	socket.on('quit', () => {
		functions.quit(allCurrentsGames, allRooms, socket);

	});
	// Quand on quitte la page
	socket.on('disconnect', ()=>{
		(socket.handshake.session.redirect == true) ? socket.handshake.session.redirect = false :
		functions.quit(allCurrentsGames, allRooms, socket);
	});
});

con.connect(function(err) {
	app.post('/Front/Script/getFormInscription.js',(req, res) => {
		const user = req.body.user;
		const mailAdress = req.body.mail;
		const mdp = req.body.mdp;

		sqls1 = "SELECT * FROM users WHERE username=?";
		sqls2 = "SELECT * FROM users WHERE email=?";
		sqli = "INSERT INTO users (username, email, password, mmr) VALUES (?,?,?,'200')";

		con.query(sqls1,[user+""] ,(err, result) => {
			if (err) throw err;
			if (result && result.length){
				console.log(result);
				console.log("pseudo déjà utilisé");
				res.end('Pseudo déjà utilisé !');
			}
			else {
				con.query(sqls2,[mailAdress+""], (err, result) => {
					if (err) throw err;
					if (result && result.length){
						console.log(result);
						console.log("email déjà utilisé");
						res.end('Email déjà utilisé !');
					}
					else {
						con.query(sqli, [user+"", mailAdress+"", mdp+""], (err, result) =>{
							if (err) throw err;
						});
						res.end('Nouveau compte bien créé !');
					}
				});
			}
		});
	});

	app.post('/Front/Script/getFormConnection.js', (req, res) => {
		user = req.body.user;
		mdp = req.body.mdp;
		sqls1 = "SELECT * FROM users WHERE username=? AND password=?";
		con.query(sqls1, [user+"",mdp+""] ,(err, result) => {
			if (err) throw err;
			if (result && result.length){
				req.session.userName = user;
				console.log(result);
				console.log("Vous êtes bien connecté !");
				res.end('Vous êtes bien connecté !');
			}
			else{
				console.log("Pseudo ou mot de passe incorrecte !");
				res.end('Pseudo ou mot de passe incorrecte !');
			}
		});
	});

	app.get('/Front/Script/affichageHistorique.js', (req, res) => {
		user = req.session.userName;
		sqls1 = "SELECT id FROM users WHERE username=?"
		sqls21 = "SELECT date,name_loser,play_time,score_winner FROM games WHERE id_winner=? ORDER BY id_game DESC LIMIT 5";
		sqls22 = "SELECT date,name_winner,play_time,score_loser FROM games WHERE id_loser=? ORDER BY id_game DESC LIMIT 5";
		
		con.query(sqls1, [user+""] ,(err, result) => {
			if (err) throw err;
			if (result && result.length){
				let idUser = result[0].id;
				console.log(idUser);
				con.query(sqls21, [idUser+""],(err, result) => {
					if (err) throw err;
					if (result && result.length){
						console.log(result);
						res.send(result);
					}
					else{
						con.query(sqls22, [idUser+""],(err, result) => {
							if (err) throw err;
							if (result && result.length){
								console.log(result);
								res.send(result);
							}
							else{
								console.log("Pas de partie joué");
								res.end();
							}
						});
					}
				});
			}
			else{
				console.log("Utilisateur non connecté");
				res.end();
			}
		});
	});

	app.get('/Front/Script/affichageClassement.js', (req, res) => {
		sqls1 = "SELECT username,mmr FROM users ORDER BY mmr DESC LIMIT 10"
		
		con.query(sqls1, (err, result) => {
			if (err) throw err;
			if (result && result.length){
				console.log(result);
				res.send(result);
				res.end();
			}
			else{
				console.log("Pas de parties");
				res.end();
			}
		});
	});	

	app.get('/Front/Script/affichageProfile.js', (req, res) => {
		user = req.session.userName;
		sqls1 = "SELECT username,mmr FROM users ORDER BY mmr DESC"

		
		con.query(sqls1, (err, result) => {
			if (err) throw err;
			if (result && result.length && user != undefined){
				let i = 0;
				while(result[i].username != user){
					i++
				}
				let table = [];
				table[0] = i + 1;
				table[1] = result[i].mmr;
				res.send(table);
				res.end();
			}
			else{
				console.log("Pas d'utilisateur connecté");
				res.end();
			}
		});
	});	
});

http.listen(4200, () => {
	console.log('Serveur lancé sur le port 4200');
});