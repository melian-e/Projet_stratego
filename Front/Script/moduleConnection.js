let mdp = document.getElementById('password');
let mdpbutton = document.getElementById('togglePassword');
let jouerbutton = document.getElementById('jouer');

mdpbutton.addEventListener('click', event=> {
    mdp.type = (mdp.type == "password") ? "text" : "password";
    mdp.focus();
});

jouerbutton.addEventListener('click', event => {
    window.location.href = "/Html/wait.html";
});

let getPseudo = (function(){
    let pseudo = socket.emit('user-name');
    return{
        pseudo,
    }
});