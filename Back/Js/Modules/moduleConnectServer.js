const express = require('express');
const { callbackify } = require('util');
const app = express();
const http = require('http').Server(app);
const io=require('socket.io')(http);

app.use(express.static(_dirname + '/')); // on start toutes les opérations avec des chemins d'accés à partir de /project/ .

app.get('/', (req,res) =>{
	if(req.session.inGame==false){
		res.sendFile(_dirname + '/index.html');	 
	}
	else{
		res.sendFile(_dirname+'/front/game.html');
	}			
});

io.on('connection',(socket) =>{
	console.log(socket);
	io.emit('New challenger approaching');
	
	socket.on('disconnect', ()=>{
		io.emit("This place ain't for the weak");//ici rajouter le pseudo du joueur qui s'en va, ainsi seuls les personnes connectés peuvent parler dans un 
												//chat intégrer au site ( a vous de voir si vous voulez faire ça j'ai trouvé ça sympa).
	});
});


http.listen(4200, () => {
  console.log('Serveur lancé sur le port 4200');
});

const con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "projet_stratego"
});

app.post('/createAccount.html',(req,res)=>{
	user=req[user];
	mailAdress=req[mailAdress];
	mdp=req[mdp];
	sqls1="SELECT * FROM users WHERE username=?";
	sqls2="SELECT * FROM users WHERE email=?";
	sqli="INSERT INTO users VALUES ? ? ?";
	callback = function(err,result){
		if(err) throw err;
		console.log(result);
	};

	if(((con.query(sql1,user,callback(err,result))==NULL))&&(con.query(sql2,mailAdress)==NULL)){
		con.query(sqli,[user,mailAdress,mdp,200]);
	}

});

app.post('/index.html',(req,res)=>{
	user=req[user];
	mdp=req[mdp];
	sqls1="SELECT username,password FROM users WHERE username=? AND password=?";
	if(con.query(sqls1,[user,mdp])!=null){
		req.session.setItem("userName",user);
		res.sendFile(_dirname + '/index.html');	
	}
	else{
		res.sendFile(__dirname + '/index.html');
	}

});