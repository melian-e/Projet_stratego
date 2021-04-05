let mdp = document.getElementById('password');
let mdpbutton = document.getElementById('togglePassword');
let jouerbutton = document.getElementById('jouer');
let regarderbutton = document.getElementById('regarder');
let boutonCon = document.getElementById('boutonCon');
let divPseudo = document.getElementById('divPseudo');
let socket = io();

mdpbutton.addEventListener('click', event=> {
    mdp.type = (mdp.type == "password") ? "text" : "password";
    mdp.focus();
});

jouerbutton.addEventListener('click', event => {
    socket.emit('user-name');
    socket.on('user-name',(username)=>{
        if(username != undefined) {
            window.location.href = "/Html/wait.html";
        }
        else {
            alert("Vous devez vous connecter pour pouvoir jouer !");
        }
    });
});

let getPseudo = (function(){
    socket.emit('user-name');
    socket.on('user-name',(username)=>{
        if(username != undefined){
            boutonCon.style.display = "none";
            divPseudo.style.display = "block";
            divPseudo.innerHTML = "Bienvenue " + username + " !";
        }
    });
});

getPseudo();