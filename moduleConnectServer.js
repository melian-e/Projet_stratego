const express = require('express');
const app = express();
const http = require('http').Server(app);
const io=require('socket.io')(http);
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

/*app.get('/Front/html/display.html', (req, res) => {
	res.sendFile(__dirname + '/Front/html/display.html');
});*/

let room = 0;
let allCurrentsGames = Array();
let allRooms =Array();

io.on('connection',(socket) =>{

	socket.on('current-games', () => {
		let srvSockets = io.sockets.sockets;
		let table = functions.currentGames(srvSockets, allCurrentsGames);
		io.to(socket.id).emit('current-games', table);
	});
	
	socket.on('new-spectator', numGame =>{
		let srvSockets = io.sockets.sockets;
		let room = research.roomById(srvSockets, allCurrentsGames[numGame].player1, allRooms);
		//socket.join(research.room(rooms));

		allRooms[room].join(socket.handshake.session.id);

		io.to(socket.id).emit('display', allCurrentsGames[numGame].convertGrid('spectator'));

	});
	
	socket.on('search-game', (revealedRule,scoutRule,bombRule) => {		// Joueurs en recherche
		
		let table = functions.waiting(io.sockets.sockets,socket,revealedRule,scoutRule,bombRule);
		
		if(table.length == 2 && table[0] != table[1]) {				// 2 joueurs veulent jouer
			let srvSockets = io.sockets.sockets;
			functions.newGame(table,srvSockets,allCurrentsGames,allRooms,revealedRule, scoutRule,bombRule);			

			//io.to(research.room(socket.rooms)).emit('game-redirect');
			let x = research.roomById(srvSockets, socket.handshake.session.id, allRooms);
			allRooms[x].simpleEvent(srvSockets, 'game-redirect');

			
			//console.log(socket.id, research.idOf(srvSockets,table[0]), research.idOf(srvSockets,table[1]));
			io.to(research.idOf(srvSockets,table[0])).emit('preparation', 'blue');// A modifier en passant par redirection
			io.to(research.idOf(srvSockets,table[1])).emit('preparation', 'red');
			//io.to(socket.id).emit('preparation', 'blue');
			
			room++;
		}
	});

	socket.on('preparation', () => {
		//console.log(socket.rooms);
		let lobby = research.game(socket.handshake.session.id, allCurrentsGames);
		io.to(socket.id).emit('preparation', (lobby.player1 == socket.handshake.session.id) ? 'blue' : 'red');
	});

	socket.on('ready', table =>{		// Quand le joueur a placé ces pions		
		let srvSockets = io.sockets.sockets;
		let lobby = research.game(socket.handshake.session.id,allCurrentsGames);    
		functions.ready(table, socket.handshake.session.id, lobby);
		let ready = Array();
		if(lobby.getBox(0,0).getOccupy() == 1){
			ready.push(lobby.player1);
		}
		if(lobby.getBox(9,9).getOccupy() == 1){
			ready.push(lobby.player2);
		}
		
		if(ready.length == 2){
			lobby.startTime = Date.now(); // remise à zéro du compteur
			/*displayed(lobby, socket.rooms);
			io.to(research.room(socket.rooms)).emit('start');*/
			let x = research.roomById(srvSockets, socket.handshake.session.id, allRooms);
			allRooms[x].display(srvSockets, lobby);
			allRooms[x].simpleEvent(srvSockets, 'start');
		}
		else{
			io.to(research.idOf(srvSockets,ready[0])).emit('display', lobby.convertGrid(ready[0]));
		}
	});

	socket.on('click', (numPiece, numMove) => {
		let lobby = research.game(socket.handshake.session.id, allCurrentsGames);
		if(socket.handshake.session.id == lobby.player1){
			numPiece = 99 - numPiece;
			numMove = 99 - numMove;
		}
		let xPiece = Math.floor(numPiece / 10);
		let yPiece = numPiece % 10;
		let xMove = Math.floor(numMove / 10);
		let yMove = numMove % 10;

		move.eventMove(lobby, lobby.getBox(xPiece, yPiece), xMove, yMove);
		//displayed(lobby, socket.rooms);
		let x = research.roomById(io.sockets.sockets, socket.handshake.session.id, allRooms);
		allRooms[x].display(io.sockets.sockets, lobby);

		if(lobby.isFinished()){
			allRooms[x].end(io.sockets.sockets, lobby);
			
			/*let winner = lobby.getWinner();
			let loser = (winner == lobby.player1) ? lobby.player2 : lobby.player1;
			let rooms = research.room(socket.rooms);
			if(winner != undefined){
				io.to(winner).emit('end', 'Tu as gagné.');
				io.to(loser).emit('end', 'Tu as perdu.');
				io.to(rooms).emit('end', research.getName(winner) + ' as gagné.');	// Si la partie est terminé
			}
			else{
				io.to(rooms).emit('end', research.getName(winner));
			}*/

			functions.suppress(lobby,allCurrentsGames,io.sockets.sockets, rooms);
		}
	});

	socket.on('disconnect', ()=>{
		io.emit("This place ain't for the weak")//ici rajouter le pseudo du joueur qui s'en va, ainsi seuls les personnes connectés peuvent parler dans un 
												//chat intégrer au site ( a vous de voir si vous voulez faire ça j'ai trouvé ça sympa).
	});
});

/*function displayed(lobby, rooms){
	io.to(research.room(rooms)).emit('display', lobby.convertGrid('spectator'));
	io.to(lobby.player1).emit('display', lobby.convertGrid(lobby.player1));
	io.to(lobby.player2).emit('display', lobby.convertGrid(lobby.player2));
}*/

function emitRoom(player, eventName, arg){
	io.to(player).emit(eventName, arg);
}

http.listen(4200, () => {
  console.log('Serveur lancé sur le port 4200');
});