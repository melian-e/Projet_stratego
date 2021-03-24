function allowDrop(ev) {
    ev.preventDefault();
}

function dragEnter(ev){
    if(ev.target.nodeName == "TD"){
        ev.target.style.border = "solid #B76554";
    }
    if(ev.target.nodeName == "DIV" && ev.target.parentNode.parentNode.parentNode.parentNode.id == "game-table"){
        ev.target.parentNode.style.border = "solid #B76554";
    }
}

function dragLeave(ev){
    if(ev.target.nodeName == "TD"){
        ev.target.style.border = "2px solid #3A5B2A";
    }
    if(ev.target.nodeName == "DIV" && ev.target.parentNode.parentNode.parentNode.parentNode.id == "game-table"){
        ev.target.parentNode.style.border = "2px solid #3A5B2A";
    }
}

function drag(ev) {
    ev.dataTransfer.setData("div", ev.target.id); 
}

function getCase(pion){
    let positionPion;
    let idPion = pion.id;
    if(idPion.search("p10") != -1){positionPion = 0;}
    else if(idPion.search("p9") != -1){positionPion = 1;}
    else if(idPion.search("p8") != -1){positionPion = 2;}
    else if(idPion.search("p7") != -1){positionPion = 3;}
    else if(idPion.search("p6") != -1){positionPion = 4;}
    else if(idPion.search("p5") != -1){positionPion = 5;}
    else if(idPion.search("p4") != -1){positionPion = 6;}
    else if(idPion.search("p3") != -1){positionPion = 7;}
    else if(idPion.search("p2") != -1){positionPion = 8;}
    else if(idPion.search("p1") != -1){positionPion = 9;}
    else if(idPion.search("p0") != -1){positionPion = 10;}
    else {positionPion = 11;}
    return positionPion;
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
    if(ev.target.nodeName == "DIV" && ev.target.parentNode.parentNode.parentNode.parentNode.id == "game-table"){ 
        let cases = ev.target.parentNode;
        if(pion.parentNode.parentNode.parentNode.parentNode.id == "game-table"){
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
    if(ev.target == document.getElementById("pionStock") || ev.target.parentNode.parentNode.parentNode.parentNode == document.getElementById("pionStock") || ev.target.parentNode.parentNode == document.getElementById("pionStock") || ev.target.parentNode.parentNode.parentNode == document.getElementById("pionStock")){
        pionStock[getCase(pion)].appendChild(pion);   
        pion.style.width = "55px";
        pion.style.heigth = "55px";
        pion.style.position = "absolute";   
    }
    
}

function reset(){
    let pion = document.getElementsByClassName("dot");
    let pionStock = document.getElementsByClassName("stock");
    for(let i = pion.length-1; i > -1 ; i--){
        pion[i].style.width = "55px";
        pion[i].style.heigth = "55px";
        pion[i].style.position = "absolute";
        pionStock[getCase(pion[i])].appendChild(pion[i]);      
    }
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
        if(pion[i].parentNode.parentNode.parentNode.parentNode != document.getElementById("game-table")){
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
        if(i != 42 && i != 43 && i != 46 && i != 47 && i != 52 && i != 53 && i != 56 && i != 57){
            grid[i].style.border = "2px solid #3A5B2A";
        }
        else{
            grid[i].style.border = "none";
        }
    }
}

function test(ev){
    let grid = document.getElementsByClassName("case");
    let i = 0;
    while(grid[i] != ev.target.parentNode){
        i += 1;
    }
    /*document.addEventListener('click',event=>{
        resetGameBoard();
    });*/

    if(i-10>0 && grid[i-10].firstChild == null){
        grid[i-10].style.border = "solid red";
        grid[i-10].addEventListener('click', event=>{
            grid[i-10].appendChild(grid[i].childNodes[0]);
            resetGameBoard();
        });
    }
    if(i+10<99 && grid[i+10].firstChild == null){
        grid[i+10].style.border = "solid red";
        grid[i+10].addEventListener('click', event=>{
            grid[i+10].appendChild(grid[i].childNodes[0]);
            resetGameBoard();
        });
    }
    if(i%10!=0 && grid[i-1].firstChild == null){
        grid[i-1].style.border = "solid red";
        grid[i-1].addEventListener('click', event=>{
            grid[i-1].appendChild(grid[i].childNodes[0]);
            resetGameBoard();
        });
    }
    if((i+1)%10!=0 && grid[i+1].firstChild == null){
        grid[i+1].style.border = "solid red";
        grid[i+1].addEventListener('click', event=>{
            grid[i+1].appendChild(grid[i].childNodes[0]);
            resetGameBoard();
        });
    }
}

function start(){
    document.getElementById("chrono").setAttribute("display", "none");
    //document.getElementById("chrono").remove();
    document.getElementById("reset").remove();
    document.getElementById("random").remove();
    document.getElementById("start").remove();
    let pion = document.getElementsByClassName("dot");
    let bomb = document.getElementsByClassName("bomb");
    let flag = document.getElementById("p0");
    for(let i = 0; i < pion.length; i++){
        pion[i].setAttribute("draggable", false);
        pion[i].setAttribute("ondragstart","");
        pion[i].setAttribute("onclick", "test(event)");
        pion[i].addEventListener("click", event=>{
            test(event);
        });
        for(let j = 0; j < bomb.length; j++) {
           if(bomb[j] == pion[i]){pion[i].setAttribute("onclick", "")}
        }
        if(pion[i] == flag){pion[i].setAttribute("onclick", "")}
    }
    randGrid();
}

function counter(time){
    let end = time * 60000 + (+new Date);
    let x = setInterval(function() {
        let distance = end - (+new Date);
        
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
        if(seconds < 10){
            document.getElementById("chrono").innerHTML = minutes + ":0" + seconds;
        }
        else{
            document.getElementById("chrono").innerHTML = minutes + ":" + seconds;
        }
    
    if(document.getElementById("chrono").getAttribute("display") == "none" || distance < 1){
        clearInterval(x);
        document.getElementById("chrono").innerHTML = "";
        document.getElementById("chrono").style.border = "none";
    }

    if (distance < 1) {
        start();
      }
    }, 1000);
}

counter(2)