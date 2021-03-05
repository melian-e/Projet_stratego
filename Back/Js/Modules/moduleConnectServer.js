const express = require('express');
const app = express();
const http = require('http').Server(app);
const io=require('socket.io')(http);

app.use(express.static(__dirname + '/project/')); // on start toutes les opérations avec des chemins d'accés à partir de /project/ .

app.get('/', (req,res) =>{
	res.sendFile(__dirname + '/project/front/html/frontpage.html');	// quand on essaie d'accèder au site sans chemin d'accès précis, on est renvoyé sur la frontpage.html 
																	//(peut venir à être changé si on oblige la création de compte)
});

let room = 0;

io.on('connection',(socket) =>{
	console.log(socket);
	io.emit('New challenger approaching');
	
	socket.on('search-game', (revealedRule, scoutRule,bombRule) => {		// Joueurs en recherche
		socket.handshake.wait = true;
		socket.handshake.revealedRule = revealedRule;
		socket.handshake.scoutRule = scoutRule;
		socket.handshake.bombRule = bombRule;
    
    	let table = Array();
    	let srvSockets = io.sockets.sockets;
    
    	console.log("Quelqu'un s'est connecté, il y a maintenant",srvSockets.size,"personnes connectés");

    	srvSockets.forEach(user => {		// Recherche des personnes en recherche d'une partie
      		if(user.handshake.wait == true && socket.handshake.revealedRule == revealedRule 
				&& socket.handshake.scoutRule == scoutRule && socket.handshake.bombRule == bombRule){ 
					table.push(user.id);
			}
    	});

		if(table.length == 2) {				// 2 joueurs veulent jouer
			console.log("Nouvelle partie",);
			
			io.emit('new-game', table,revealedRule,scoutRule,bombRule);		// Ajout de la partie au tableau
			srvSockets.forEach(user => {
			  if(user.id == table[0] || user.id == table[1]) {
				user.handshake.wait = false;
				user.join('room'+room);		// Ajout des joueur à une nouvelle room
			  }
			});
			room++;

			// redirection vers la page de jeu
		}
	});

	socket.on('ready', ()=>{		// Quand le joueur a placé ces pions
		let table; 		// tableau des pions placés
		
		io.to(researchRoom(socket.rooms)).emit('ready', socket.id, table);
	});

	socket.on('disconnect', ()=>{
		io.emit("This place ain't for the weak")//ici rajouter le pseudo du joueur qui s'en va, ainsi seuls les personnes connectés peuvent parler dans un 
												//chat intégrer au site ( a vous de voir si vous voulez faire ça j'ai trouvé ça sympa).
	});
});


http.listen(4200, () => {
  console.log('Serveur lancé sur le port 4200');
});


function researchRoom(rooms){
	let x = 0;
	let room = 'room';
  
	if(rooms.size != 1){
	  while(!rooms.has(room+x)){
		x++;
	  }
	}
	return room + x;
  }