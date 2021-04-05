let mdp = document.getElementById('password');
let mdpButton = document.getElementById('togglePassword');
let boutonCon = document.getElementById('boutonCon');
let divPseudo = document.getElementById('divPseudo');
let tableBody = document.getElementById("tableGame");
let socket = io();

mdpButton.addEventListener('click', event=> {
    mdp.type = (mdp.type == "password") ? "text" : "password";
    mdp.focus();
});

let setPartie = (function(){
    socket.emit('current-games');

    socket.on('current-games', table =>{
        /////////////////table = [["alexis","Axel", "2:03"],["IéIé", "Flora", "12:02"]]; // ligne de test

        let location = document.getElementById("games");

        if(table.length != 0){
            let tab = document.createElement("table");

            for (let i = 0; i < table.length; i++) {
                let row = document.createElement("tr");
                let cell = document.createElement("td");
                let text = document.createTextNode(table[i][0] + " et " + table[i][1] + " jouent depuis " + table[i][2] + "min");

                cell.classList.add("game");
                cell.addEventListener("click", selectGame);
                cell.appendChild(text);
                row.appendChild(cell);
                tab.appendChild(row);
            }
            location.appendChild(tab);
        }
        else location.innerHTML = "Aucune partie en cours.";
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

let selectGame = (function(event){
    let td = document.getElementsByClassName("game");
    let i = 0;

    while(td[i] != event.currentTarget){
        i++;
    }

    socket.emit("new-spectator", i);
});

getPseudo();
setPartie();