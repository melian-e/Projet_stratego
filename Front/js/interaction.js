socket.emit('preparation');

socket.on('end', message =>{
    console.log(message);
});

socket.on('preparation', color => preparation(color));
socket.on('display', (table, rest) => display(table, rest));

socket.on('new-spectator', grid => {
    let table = document.createElement("table");
    table.id = 'game-table';

    for(let i = 0; i < 10; i++){
        table.appendChild(createLine((i < 6) ? false : true));
    }

    document.getElementById('game-board').appendChild(table);
    createLake();

    document.getElementById("reset").remove();
    document.getElementById("random").remove();
    document.getElementById("start").remove();
    document.getElementById("chrono").style.display = "none";
    
    display(grid, ['none', false]);
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
        td[i].addEventListener("dragenter", event => {
            if(dragInProgress == true) dragEnter(event);
        });
        td[i].addEventListener("dragleave", event => {
            if(dragInProgress == true) dragLeave(event);
        });
        td[i].addEventListener("dragover", event=> {
            if(dragInProgress == true) allowDrop(event);
        });
    }
    document.getElementById("chrono").setAttribute("display", "none");
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