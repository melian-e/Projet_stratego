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