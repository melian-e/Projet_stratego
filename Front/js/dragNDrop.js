function wrapperEnter(event){
    if(dragInProgress == true) dragEnter(event);
}

function wrapperLeave(event){
    if(dragInProgress == true) dragLeave(event);
}

function wrapperOver(event){
    if(dragInProgress == true) allowDrop(event);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function dragEnter(ev){
    console.log(dragInProgress);
    if(ev.target.nodeName == "TD" && ev.target.className != "case lake" ){
        ev.target.style.backgroundColor = "#65b142";
    }
    if(ev.target.nodeName == "DIV" && ev.target.parentNode.parentNode.parentNode.id == "game-table"){
        ev.target.parentNode.style.backgroundColor = "#65b142";
    }
}

function dragLeave(ev){
    let td = document.getElementsByClassName("case");
    let x = 0;

    while(td[x] != ev.currentTarget && td[x] != ev.currentTarget.parentNode){
        x++
    }

    allClicks.forEach(tab => x == tab[1])

    let inside = (allClicks.some(tab => x == tab[1])) ? true : false

    if(ev.target.nodeName == "TD"){
        ev.target.style.backgroundColor = (inside)? "#598d40" :"transparent";
    }
    if(ev.target.nodeName == "DIV" && ev.target.parentNode.parentNode.parentNode.id == "game-table"){
        ev.target.parentNode.style.backgroundColor = (inside)? "#598d40" :"transparent";
    }
}

function drag(ev) {
    ev.dataTransfer.setData("div", ev.target.id); 
}

function dragGame(event) {
    dragInProgress = true;
    let td = document.getElementsByClassName("case");
    let i = 0;

    while(td[i].firstElementChild != event.currentTarget){
        i++;
    }

    move(event);

    event.dataTransfer.setData("numPiece", i); 
}


function drop(ev) {
    ev.preventDefault();
    ev.target.style = "2px solid #3A5B2A"
    let data = ev.dataTransfer.getData("div");
    let pion = document.getElementById(data);
    let pionStock = document.getElementsByClassName("stock");

    //////////////////////////////////////////pion mis dans une case du jeu
    if(ev.target.nodeName == "TD" && ev.target.firstChild == null){ 
        ev.target.appendChild(pion);
        pion.style.border = "none";
        pion.style.width = "90%";
        pion.style.heigth = "100%";
        pion.style.position = "relative";
    }
    ///////////////////////////////////////////échange entre 2 pions
    if(ev.target.nodeName == "DIV" && ev.target.parentNode.parentNode.parentNode.id == "game-table"){ /// parentNode (-1)
        let cases = ev.target.parentNode;
        if(pion.parentNode.parentNode.parentNode.id == "game-table"){
            pion.parentNode.appendChild(ev.target);
            ev.target.style.border = "none";
            ev.target.style.width = "90%";
            ev.target.style.heigth = "100%";
            ev.target.style.position = "relative";
        }
        else{
            pionStock[getCase(ev.target)].appendChild(ev.target); 
            ev.target.style.width = "55px";
            ev.target.style.heigth = "55px";
            ev.target.style.position = "absolute";  
        }
        cases.appendChild(pion); 
        pion.style.border = "none";
        pion.style.width = "90%";
        pion.style.heigth = "100%";
        pion.style.position = "relative";
    }
    /////////////////////////////////////////////pion mis dans le stock de pièces
    /*if(ev.target == document.getElementById("pionStock") || ev.target.parentNode.parentNode.parentNode.parentNode == document.getElementById("pionStock") || ev.target.parentNode.parentNode == document.getElementById("pionStock") || ev.target.parentNode.parentNode.parentNode == document.getElementById("pionStock")){
        pionStock[getCase(pion)].appendChild(pion);   
        pion.style.width = "55px";
        pion.style.heigth = "55px";
        pion.style.position = "absolute";   
    }*/
}

function dropGame(event){  
    event.preventDefault();
    resetGameBoard();
    allClicks = [];

    let numPiece = event.dataTransfer.getData("numPiece");
    let td = document.getElementsByClassName("case");
    let numMove;

    for(let i = 0; i < td.length; i++){
        if( td[i] == event.currentTarget) numMove = i;
    }
    if(numMove != numPiece){
        socket.emit('click', numPiece, numMove);
    }
}