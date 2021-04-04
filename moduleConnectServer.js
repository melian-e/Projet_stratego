const express = require('express');
const { callbackify } = require('util');
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



//const sharedsession = require("express-socket.io-session");
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

//module.exports = {emitRoom};
//const move = require('./Back/Js/Modules/move.js');
//const functions = require('./Back/Js/mainGame');
//const research = require('./Back/js/research.js');




app.use(express.static(__dirname + '/')); // on start toutes les opérations avec des chemins d'accés à partir de /project/ .
app.use(urlencodedParser);
app.use(session)

app.get('/', (req, res) => {
	console.log(req.session);
	if (req.session.inGame == false || req.session.inGame == undefined) {
		res.sendFile(__dirname + '/Front/Html/index.html');
	}
	else {
		res.sendFile(__dirname + '/Front/Html/game.html');
	}
});

io.on('connection', (socket) => {
	console.log(socket);
	io.emit('New challenger approaching');

	socket.on('disconnect', () => {
		io.emit("This place ain't for the weak");//ici rajouter le pseudo du joueur qui s'en va, ainsi seuls les personnes connectés peuvent parler dans un 
		//chat intégrer au site ( a vous de voir si vous voulez faire ça j'ai trouvé ça sympa).
	});

	socket.on('inscription', () => {
		io.emit("tentative d'inscription");
	});

});


con.connect(function(err) {
	app.post('/Front/Script/getFormInscription.js',(req, res) => {
		const user = req.body.user;
		const mailAdress = req.body.mail;
		const mdp = req.body.mdp;

		sqls1 = "SELECT * FROM users WHERE username='"+user+"'";
		sqls2 = "SELECT * FROM users WHERE email='"+mailAdress+"'";
		sqli = "INSERT INTO users (username, email, password, mmr) VALUES ('" + user + "','" + mailAdress + "','" + mdp + "','200')";

		con.query(sqls1, function(err, result){
			if (err) throw err;
			if (result && result.length){
				console.log(result);
				console.log("pseudo déjà utilisé");
				res.end('Pseudo déjà utilisé !');
			}
			else {
				con.query(sqls2, function(err, result) {
					if (err) throw err;
					if (result && result.length){
						console.log(result);
						console.log("email déjà utilisé");
						res.end('Email déjà utilisé !');
					}
					else {
						con.query(sqli);
						res.end('Nouveau compte bien créé !');
					}
				});
			}
		});
	});

	app.post('/Front/Script/getFormConnection.js', (req, res) => {
		user = req.body.user;
		mdp = req.body.mdp;
		sqls1 = "SELECT * FROM users WHERE username='"+user+"' AND password='"+mdp+"'";
		con.query(sqls1, function(err, result){
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

});

http.listen(4200, () => {
	console.log('Serveur lancé sur le port 4200');
});