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
    socket.on('current-games',(table)=>{
        for (let i = 0; i < table.length; i++) {
            let row = document.createElement("tr");

            for (let j = 0; j < 3; j++) {
                let cell = document.createElement("td");
                let cellText = document.createTextNode("cell in row "+i+", column "+j);        
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            tableBody.appendChild(row);
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
setPartie();