let form = document.getElementById("form1");
let mdpButton = document.getElementById('togglePassword');

form.addEventListener('submit', event => {
    let piece1 = document.getElementById("piece1");
    let eclaireur1 = document.getElementById("eclaireur1");
    let bomb1 = document.getElementById("bomb1");

    event.preventDefault();
    socket.emit("search-game",piece1.checked,eclaireur1.checked,bomb1.checked);
});

socket.on('game-redirect', () => {
    window.location.href = "game.html";
});
socket.on('wait-redirect', () => {
    window.location.href = "/Html/wait.html";
});

mdpButton.addEventListener('click', event=> {
    let mdp = document.getElementById('password');
    mdp.type = (mdp.type == "password") ? "text" : "password";
    mdp.focus();
});

let getPseudo = (function(){
    let socket = io();
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