const express = require('express');
const app = express();
const http = require('http').Server(app);
const io=require('socket.io')(http);

const Coordinates = require('./Back/Js/Classes/coordinates.js');
const Entity = require('./Back/Js/Classes/entity.js');
const Piece = require('./Back/Js/Classes/piece.js');
const GameGrid = require('./Back/Js/Classes/gamegrid.js');
const Game = require('./Back/Js/Classes/game.js');
const attack = require('./Back/Js/Modules/attack.js');
const move = require('./Back/Js/Modules/move.js');
const functions = require('./Back/Js/mainGame');

app.use("/", express.static(__dirname + '/Front/')); // on start toutes les opérations avec des chemins d'accés à lobbyir de /project/ .

app.get('/', (req,res) =>{
	res.sendFile(__dirname + '/Front/html/test.html');	// quand on essaie d'accèder au site sans chemin d'accès précis, on est renvoyé sur la frontpage.html 
																	//(peut venir à être changé si on oblige la création de compte)

});

app.get('/Front/html/display.html', (req, res) => {
	res.sendFile(__dirname + '/Front/html/display.html');
});

let room = 0;
let allCurrentsGames = Array();

io.on('connection',(socket) =>{
	//console.log(socket);
	io.emit('New challenger approaching');

	socket.on('current-games', () => {
		let srvSockets = io.sockets.sockets;
		return functions.currentGames(srvSockets, allCurrentsGames);
	});
	
	socket.on('new-secpator', numGame =>{
		let srvSockets = io.sockets.sockets;
		let rooms = researchRoomById(srvSockets, allCurrentsGames[numGame].player1);
		socket.join(functions.researchRoom(rooms));

		io.to(socket.handshake.id).emit('display', allCurrentsGames[numGame].convertGrid('sepectator'));

	});
	
	socket.on('search-game', (revealedRule, scoutRule,bombRule) => {		// Joueurs en recherche
		let table = functions.waiting(io.sockets.sockets,socket,revealedRule,scoutRule,bombRule);

		if(table.length == 2) {				// 2 joueurs veulent jouer
			functions.newGame(table,io.sockets.sockets,allCurrentsGames,'room'+room,revealedRule, scoutRule,bombRule);
			
			io.to(table[0]).emit('preparation', 'blue');		// A modifier en passant par redirection
			io.to(table[1]).emit('preparation', 'red');
			
			room++;

			// redirection vers la page de jeu
			app.get('/Front/html/display.html' );


		}
	});

	socket.on('ready', table =>{		// Quand le joueur a placé ces pions
		let lobby = researchGame(playerId,allCurrentsGames);    
		functions.ready(table, socket.handshake.id, lobby);
		let ready = Array();
		if(lobby.getBox(0,0).getOccupy() == 1){
			io.to(lobby.player1).emit('display', lobby.convertGrid(lobby.player1));
			ready.push(lobby.player1);
		}
		if(lobby.getBox(9,9).getOccupy() == 1){
			io.to(lobby.player2).emit('display', lobby.convertGrid(lobby.player2));
			ready.push(lobby.player2);
		}
		if(ready.length == 2){
			lobby.startTime = Date.now(); // remise à zéro du compteur
			displayed(lobby);
			io.to(functions.researchRoom(socket.handshake.rooms)).emit('start');
		}
		else{
			io.to(ready[0]).emit('display', lobby.convertGrid(ready[0]));
		}
	});

	socket.on('click', (numPiece, numMove) => {
		let lobby = functions.researchGame(socket.handshake.id, allCurrentsGames);
		if(socket.handshake.id == lobby.player1){
			numPiece = 99 - numPiece;
			numMove = 99 - numMove;
		}
		let xPiece = Math.floor(numPiece / 10);
		let yPiece = numPiece % 10;
		let xMove = Math.floor(numMove / 10);
		let yMove = numMove % 10;

		move.eventMove(lobby, lobby.getBox(xPiece, yPiece), xMove, yMove);
		displayed(lobby);

		if(lobby.isFinished()){
			io.to(functions.researchRoom(socket.handshake.rooms)).emit('end', functions.getName(lobby.getWinner()));	// Si la partie est terminé
			functions.suppress(lobby,allCurrentsGames,io.sockets.sockets);
		}
	});

	socket.on('disconnect', ()=>{
		io.emit("This place ain't for the weak")//ici rajouter le pseudo du joueur qui s'en va, ainsi seuls les personnes connectés peuvent parler dans un 
												//chat intégrer au site ( a vous de voir si vous voulez faire ça j'ai trouvé ça sympa).
	});
});

function displayed(lobby){
	io.to(lobby.player1).emit('display', lobby.convertGrid(lobby.player1));
	io.to(lobby.player2).emit('display', lobby.convertGrid(lobby.player2));
	io.to(functions.researchRoom(socket.handshake.rooms)).emit('display', lobby.convertGrid('sepectator'));
}


http.listen(4200, () => {
  console.log('Serveur lancé sur le port 4200');
});