const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const session = require("express-session")({
	secret: "a15a7a8df5a9a9d0d1851fa03ce4ebf0f67f140bdee167310b206887d85ec783",
	resave: true,
	saveUninitialized: true,
	cookie: {
	  maxAge: 2 * 60 * 60 * 1000,
	  secure: false
	}
});
const sharedsession = require("express-socket.io-session");
const bodyParser = require('body-parser');

module.exports = {emitRoom};
const move = require('./Back/Js/Modules/move.js');
const functions = require('./Back/Js/mainGame');
const research = require('./Back/js/research.js');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use("/", express.static(__dirname + '/Front/')); // on start toutes les opérations avec des chemins d'accés à lobbyir de /project/ .


app.use(urlencodedParser);
app.use(session);

// Configure socket io with session middleware
io.use(sharedsession(session, {
  // Session automatiquement sauvegardée en cas de modification
  autoSave: true
}));


app.get('/', (req,res) =>{
	res.sendFile(__dirname + '/Front/html/test.html');	// quand on essaie d'accèder au site sans chemin d'accès précis, on est renvoyé sur la frontpage.html 
																	//(peut venir à être changé si on oblige la création de compte)

});

/*app.get('/test', (req, res) => {
	res.sendFile(__dirname + '/Front/html/display.html');
});*/

let allCurrentsGames = Array();
let allRooms = Array();

io.on('connection',(socket) =>{

	socket.on('current-games', () => {
		let srvSockets = io.sockets.sockets;
		let table = functions.currentGames(srvSockets, allCurrentsGames);
		io.to(socket.id).emit('current-games', table);
	});
	
	socket.on('new-spectator', numGame =>{
		let srvSockets = io.sockets.sockets;

		let room = research.roomById(allCurrentsGames[numGame].player1.id, allRooms);

		allRooms[room].join(socket.handshake.session.id);
		io.to(socket.id).emit('game-redirect');
	});
	
	socket.on('search-game', (revealedRule,scoutRule,bombRule) => {		// Joueurs en recherche

		let srvSockets = io.sockets.sockets;

		let table = functions.waiting(srvSockets,socket,revealedRule,scoutRule,bombRule);
		
		if(table.length == 2 && table[0] != table[1]) {				// 2 joueurs veulent jouer
			
			functions.newGame(table,allCurrentsGames,allRooms,revealedRule, scoutRule,bombRule);

			let x = research.roomById(socket.handshake.session.id, allRooms);

			allRooms[x].simpleEvent(srvSockets, 'game-redirect');
		}
	});

	socket.on('preparation', () => {
		socket.handshake.session.wait = false;

		let x = research.roomById(socket.handshake.session.id, allRooms);
		let lobby = research.gameByRoom(allRooms[x], allCurrentsGames);

		(lobby.getPlayers().some(player => player == socket.handshake.session.id)) ? 
		io.to(socket.id).emit('preparation', (lobby.player1.id == socket.handshake.session.id) ? lobby.player1.color : lobby.player2.color) : 
		io.to(socket.id).emit('display', lobby.convertGrid('spectator'));
	});

	socket.on('ready', table =>{		// Quand le joueur a placé ces pions		
		let srvSockets = io.sockets.sockets;
		let lobby = research.game(socket.handshake.session.id,allCurrentsGames);
		let ready = Array();

		functions.ready(table, socket.handshake.session.id, lobby);

		if(lobby.getBox(0,0).getOccupy() == 1){
			ready.push(lobby.player1.id);
		}
		if(lobby.getBox(9,9).getOccupy() == 1){
			ready.push(lobby.player2.id);
		}
		
		if(ready.length == 2){
			lobby.startTime = Date.now(); // remise à zéro du compteur
			let x = research.roomById(socket.handshake.session.id, allRooms);
			allRooms[x].display(srvSockets, lobby);
			allRooms[x].simpleEvent(srvSockets, 'start');
		}
		else{
			io.to(research.idOf(srvSockets,ready[0])).emit('display', lobby.convertGrid(ready[0]));
		}
	});

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
			functions.suppress(lobby,allCurrentsGames, allRooms);
		}
	});

	socket.on('quit', () => {
		let x = research.roomById(socket.handshake.session.id, allRooms);
		let lobby = research.gameByRoom(allRooms[x], allCurrentsGames);

		(lobby.getPlayers().some(player => player == socket.handshake.session.id)) ? 
		functions.suppress(lobby, allCurrentsGames, allRooms) : 
		allRooms[x].leave(socket.handshake.session.id);
	});

	socket.on('disconnect', ()=>{
		io.emit("This place ain't for the weak")//ici rajouter le pseudo du joueur qui s'en va, ainsi seuls les personnes connectés peuvent parler dans un 
												//chat intégrer au site ( a vous de voir si vous voulez faire ça j'ai trouvé ça sympa).
	});
});

function emitRoom(player, eventName, arg){
	io.to(player).emit(eventName, arg);
}

http.listen(4200, () => {
  console.log('Serveur lancé sur le port 4200');
});