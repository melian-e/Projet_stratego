function allowDrop(ev) {
    ev.preventDefault();
}

function dragEnter(ev){
    if(ev.target.nodeName == "TD" && ev.target.className != "case lake" ){
        //ev.target.style.border = "solid #B76554";
        ev.target.style.backgroundColor = "#598d40";
    }
    if(ev.target.nodeName == "DIV" && ev.target.parentNode.parentNode.parentNode.parentNode.id == "game-table"){
        //ev.target.parentNode.style.border = "solid #B76554";
        ev.target.parentNode.style.backgroundColor = "#598d40";
    }
}

function dragLeave(ev){
    if(ev.target.nodeName == "TD"){
        //ev.target.style.border = "2px solid #3A5B2A";
        ev.target.style.backgroundColor = "transparent";
    }
    if(ev.target.nodeName == "DIV" && ev.target.parentNode.parentNode.parentNode.id == "game-table"){
        //ev.target.parentNode.style.border = "2px solid #3A5B2A";
        ev.target.parentNode.style.backgroundColor = "transparent";
    }
}

function drag(ev) {
    ev.dataTransfer.setData("div", ev.target.id); 
}

function dragGame(event) {
    dragInProgress = true;
    let td = document.getElementsByClassName("case");
    let numData;

    for(let i = 0; i < td.length; i++){
        if( td[i].firstElementChild == event.currentTarget) numData = i;
    }

    event.dataTransfer.setData("numPiece", numData); 
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
    ///////////event.target.style = "2px solid #3A5B2A";
    event.target.style.backgroundColor = "transparent";

    let numPiece = event.dataTransfer.getData("numPiece");
    let td = document.getElementsByClassName("case");
    let numMove;

    for(let i = 0; i < td.length; i++){
        if( td[i] == event.currentTarget) numMove = i;
    }

    socket.emit('click', numPiece, numMove);
}