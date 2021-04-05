let mdpButton = document.getElementById('togglePassword');
let jouerButton = document.getElementById('jouer');
let regarderButton = document.getElementById('regarder');
let socket = io();

mdpButton.addEventListener('click', event=> {
    let mdp = document.getElementById('password');
    mdp.type = (mdp.type == "password") ? "text" : "password";
    mdp.focus();
});

jouerButton.addEventListener('click', event => {
    socket.emit('user-name');
    socket.on('user-name', sername => {
        if(username != undefined) {
            window.location.href = "/Html/choice.html";
        }
        else {
            alert("Vous devez vous connecter pour pouvoir jouer !");
        }
    });
});

regarderButton.addEventListener('click', event => {
    window.location.href = "/Html/spectate.html";
})

let getPseudo = (function(){
    let boutonCon = document.getElementById('boutonCon');
    let divPseudo = document.getElementById('divPseudo');
    socket.emit('user-name');
    socket.on('user-name', username => {
        if(username != undefined){
            boutonCon.style.display = "none";
            divPseudo.style.display = "block";
            divPseudo.innerHTML = "Bienvenue " + username + " !";
        }
    });
});

getPseudo();