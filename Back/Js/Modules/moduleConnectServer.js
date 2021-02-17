const express = require('express');
const app = express();
const http = require('http').Server(app);
const io=require('socket.io')(http);

app.use(express.static(_dirname + '/project/')); // on start toutes les opérations avec des chemins d'accés à partir de /project/ .

app.get('/', (req,res) =>{
	res.sendFile(_dirname + '/project/front/html/frontpage.html');	// quand on essaie d'accèder au site sans chemin d'accès précis, on est renvoyé sur la frontpage.html 
																	//(peut venir à être changé si on oblige la création de compte)
});

io.on('connection',(socket) =>{
	console.log(socket);
	io.emit('New challenger approaching');
	
	socket.on('disconnect', ()=>{
		io.emit("This place ain't for the weak")//ici rajouter le pseudo du joueur qui s'en va, ainsi seuls les personnes connectés peuvent parler dans un 
												//chat intégrer au site ( a vous de voir si vous voulez faire ça j'ai trouvé ça sympa).
	});
});

