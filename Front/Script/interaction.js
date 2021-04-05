socket.emit('preparation');
let stopwatch;

socket.on('end', (message, score, revealedRule, scoutRule,bombRule) =>{
    let td = document.getElementsByClassName("case");
    
    removeClicks();
    for(let x = 0; x < td.length; x++){
        td[x].style.backgroundColor = "transparent";
        td[x].removeEventListener("click", moveOnClick);
        if(td[x].firstElementChild != undefined){
            td[x].firstElementChild.removeEventListener("dragstart", dragGame);
        }
    }

    document.getElementById("turn").innerHTML = "La partie est finie.";
    clearInterval(stopwatch);

    let mes = document.getElementById("message");
    let result = document.getElementById("result");
    
    mes.innerHTML = message;
    result.innerHTML = (message == "Tu as gagné.") ? "Tu as gagné" : score[0][0];
    result.innerHTML += " " + score[0][1] + " et ";
    result.innerHTML += (message == "Tu as gagné.") ? score[1][0] : "tu as perdu ";
    result.innerHTML += Math.abs(score[1][1]) + ".";
    

    if(message == "Tu as gagné." || message == "Tu as perdu."){
        let button = document.getElementById("rejouer");
        button.innerHTML = "Rejouer !";
        button.addEventListener("click", (revealedRule, scoutRule,bombRule) => {
            socket.emit('search-game', revealedRule,scoutRule,bombRule);
            window.location.href = "wait.html";
        });
    }
    
    $("#endGame").modal('show');
    console.log(message, score);
});

socket.on('preparation', color => preparation(color));
socket.on('display', (table, color, turn) => display(table, color, turn));

socket.on('new-spectator', (grid,time) => {

    let table = document.createElement("table");
    table.id = 'game-table';

    for(let i = 0; i < 10; i++){
        table.appendChild(createLine((i < 6) ? false : true));
    }

    document.getElementById('game-board').appendChild(table);
    createLake();

    time = (+new Date) - time;
    let allPieces = [];

    for(let x = 0; x < 10; x++){
        allPieces = allPieces.concat(grid[x].filter(elem => elem[0] < 16 ));
    }
    
    if(allPieces.length != 80){
        
        let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((time % (1000 * 60)) / 1000);

        counter(2 - (minutes + ((seconds * 0.5)/30)));

        document.getElementById("reset").style.display = "none";
        document.getElementById("random").style.display = "none";
        document.getElementById("start").style.display = "none";
    }
    else{
        document.getElementById("timer").style.display = "none";     

        let pion = document.getElementById("pions");
        let clock = document.createElement("div");
        
        clock.id = "chrono";
        pion.appendChild(clock);

        stopwatch = chrono(time);
        document.getElementById("reset").remove();
        document.getElementById("random").remove();
        document.getElementById("start").remove();
    }

    display(grid, 'none', false);
});

let dragInProgress = false;

socket.on('start', () => {
    let td = document.getElementsByClassName("case");

    for(let i = 0; i < td.length; i++){
        td[i].addEventListener("drop", event =>{
            if(dragInProgress == true){
                dragInProgress = false;
                dropGame(event);
            }
        });
        td[i].addEventListener("dragenter", wrapperEnter);
        td[i].addEventListener("dragleave", wrapperLeave);
        td[i].addEventListener("dragover", wrapperOver);
    }

    document.getElementById("timer").style.display = "none";
    let turn = document.createElement("div");
    let clock = document.createElement("div");
    let pion = document.getElementById("pions");

    turn.id = "turn";
    clock.id = "chrono";

    pion.appendChild(clock);
    pion.appendChild(turn);
    stopwatch = chrono(0);
});

function getCase(pion){
    let positionPion;
    let idPion = pion.id;

    if(idPion.search("p") != -1){
        let pos = idPion.search("p");
        let num = Number(idPion[pos+1]);

        positionPion = (idPion.length == 2 || idPion[pos+2] == '-') ? 10 - num : 0;
    }
    else positionPion = 11;

    return positionPion;
}

function randCase(pion, grid){
    let lin, col, nb;
    do{
        lin = Math.floor(Math.random() * 10);
        col = Math.floor(Math.random() * 4) + 6;
        nb = col * 10 + lin;
    } while(grid[nb].hasChildNodes() == true);
    grid[nb].appendChild(pion);
}

function randGrid(){
    let pion = document.getElementsByClassName("dot");
    let grid = document.getElementsByClassName("case");
    for(let i = 0; i < pion.length; i++){
        if(pion[i].parentNode.parentNode.parentNode != document.getElementById("game-table")){
            pion[i].style.width = "90%";
            pion[i].style.heigth = "100%";
            pion[i].style.position = "relative";
            randCase(pion[i], grid);
        }
    }
}

function resetGameBoard(){
    let grid = document.getElementsByClassName("case");
    for(let i = 0; i < grid.length; i++){
        grid[i].style.backgroundColor = "transparent";
    }
}