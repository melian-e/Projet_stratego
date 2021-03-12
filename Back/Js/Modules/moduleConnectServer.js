const express = require('express');
const { readSync } = require('node:fs');
const app = express();
const http = require('http').Server(app);
const io=require('socket.io')(http);
const functions = require('../mainGame.js');


app.use(express.static(__dirname + '/project/')); // on start toutes les opérations avec des chemins d'accés à Lobbyir de /project/ .

app.get('/', (req,res) =>{
	res.sendFile(__dirname + '/project/front/html/frontpage.html');	// quand on essaie d'accèder au site sans chemin d'accès précis, on est renvoyé sur la frontpage.html 
																	//(peut venir à être changé si on oblige la création de compte)
});

let room = 0;
let allCurrentsGames = Array();

io.on('connection',(socket) =>{
	//console.log(socket);
	io.emit('New challenger approaching');
	
	socket.on('search-game', (revealedRule, scoutRule,bombRule) => {		// Joueurs en recherche
		let table = functions.waiting(io.sockets.sockets,socket,revealedRule,scoutRule,bombRule);

		if(table.length == 2) {				// 2 joueurs veulent jouer
			functions.newGame(io.sockets.sockets,allCurrentsGames,'room'+room,socket);
			room++;

			// redirection vers la page de jeu
		}
	});

	socket.on('ready', table =>{		// Quand le joueur a placé ces pions
		functions.ready(table, socket.handshake.id, allCurrentsGames);
	});

	socket.on('click', (numPiece, numMove) => {
		let Lobby = functions.researchGame(socket.handshake.id, allCurrentsGames);
		if(socket.id == Lobby.player1){
			numPiece = 99 - numPiece;
			numMove = 99 - numMove;
		}
		let xPiece = Math.floor(numPiece / 10);
		let yPiece = numPiece % 10;
		let xMove = Math.floor(numMove / 10);
		let yMove = numMove % 10;

		move.eventMove(Lobby, Lobby.getBox(xPiece, yPiece), xMove, yMove);
		//io.to(functions.researchRoom(socket.handshake.rooms)).emit('move', Lobby.grid);	// Modifier pour avoir une table lisible du front
		io.to(Lobby.player1).emit('move', Lobby.convertGrid(Lobby.player1));
		io.to(Lobby.player2).emit('move', Lobby.convertGrid(Lobby.player2));
		io.to(functions.researchRoom(socket.handshake.rooms)).emit('move', Lobby.convertGrid('sepectator'));

		if(Lobby.isFinished()){
			io.to(functions.researchRoom(socket.handshake.rooms)).emit('end', functions.getName(Lobby.getWinner()));	// Si la partie est terminé
			functions.suppress(Lobby,allCurrentsGames,io.sockets.sockets);
		}
	});

	socket.on('disconnect', ()=>{
		io.emit("This place ain't for the weak")//ici rajouter le pseudo du joueur qui s'en va, ainsi seuls les personnes connectés peuvent parler dans un 
												//chat intégrer au site ( a vous de voir si vous voulez faire ça j'ai trouvé ça sympa).
	});
});


http.listen(4200, () => {
  console.log('Serveur lancé sur le port 4200');
});