socket.emit('preparation');

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
    event.target.style = "2px solid #3A5B2A"
    let data = event.dataTransfer.getData("div");
    let pion = document.getElementById(data);

    let td = document.getElementsByClassName("case");
    let numPiece, numMove;

    for(let i = 0; i < td.length; i++){
        if( td[i] == event.target) numMove = i;
        if( td[i].firstElementChild == pion) numPiece = i;
    }

    socket.emit('click', numPiece, numMove);
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
    /*let pion = document.getElementsByClassName("dot");
    let bomb = document.getElementsByClassName("bomb");
    let flag = document.getElementById("p0");
    for(let i = 0; i < pion.length; i++){
        pion[i].setAttribute("draggable", false);
        pion[i].removeEventListener("dragstart", event => drag(event));
        pion[i].addEventListener("click", event=> test(event));
        for(let j = 0; j < bomb.length; j++) {
           if(bomb[j] == pion[i]){pion[i].setAttribute("onclick", "")}
        }
        if(pion[i] == flag){pion[i].setAttribute("onclick", "")}
    }*/
    randGrid();
    ready();
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

function ready(){
    let td = document.getElementsByClassName("case");
    let table = Array(10);

    for( let i = 0; i < 10; i++){
        table[i] = Array(10);
        
        for( let j = 0; j < 10; j++){
            
            let classList = td[10*i+j].firstElementChild.getAttribute("class").split(' ');
            
            if(classList.some(elem => elem == "p2")){
                table[i][j] = 2;
            }
            else if(classList.some(elem => elem == "bomb")){
                table[i][j] = -1;
            }
            else if(classList.some(elem => elem == "p6")){
                table[i][j] = 6;
            }
            else if(classList.some(elem => elem == "p5")){
                table[i][j] = 5;
            }
            else if(classList.some(elem => elem == "p4")){
                table[i][j] = 4;
            }
            else if(classList.some(elem => elem == "p3")){
                table[i][j] = 3;
            }
            else if(classList.some(elem => elem == "p7")){
                table[i][j] = 7;
            }
            else if(classList.some(elem => elem == "p8")){
                table[i][j] = 8;
            }
            else if(classList.some(elem => elem == "p1")){
                table[i][j] = 1;
            }
            else if(classList.some(elem => elem == "p9")){
                table[i][j] = 9;
            }
            else if(classList.some(elem => elem == "p0")){
                table[i][j] = 0;
            }
            else if(classList.some(elem => elem == "p10")){
                table[i][j] = 10;
            }
            else{
                table[i][j] = 30;
            }
        }
    }
  
    socket.emit('ready', table);
}

socket.on('display', (table, color, turn) => {
    let td = document.getElementsByClassName("case");

    for( let i = 0; i < 10; i++){
        for( let j = 0; j < 10; j++){  

            td[10*i+j].firstElementChild.remove();
            let div = document.createElement("div");
            div.classList.add("dot");
            div.classList.add(table[i][j][1]);
            div.addEventListener("dragstart", event => drag(event));
            div.addEventListener("click", event => test(event));
            div.draggable = false;

            if( table[i][j][1] != color && table[i][j][0] != 22){
                td[i*10+j].addEventListener("drop", event => dropGame(event));
                td[i*10+j].addEventListener("dragenter", event => dragEnter(event));
                td[i*10+j].addEventListener("dragleave", event => dragLeave(event));
                td[i*10+j].addEventListener("dragover", event=> allowDrop(event));
            }

            if(table[i][j][0] == 15){
                div.classList.add("back");
            }
            else if(table[i][j][0] == 2){
                div.classList.add("p2");
            }
            else if(table[i][j][0] = -1){
                div.classList.add("bomb");
            }
            else if(table[i][j][0] = 6){
                div.classList.add("p6");
            }
            else if(table[i][j][0] = 5){
                div.classList.add("p5");
            }
            else if(table[i][j][0] = 4){
                div.classList.add("p4");
            }
            else if(table[i][j][0] = 3){
                div.classList.add("p3");
            }
            else if(table[i][j][0] = 7){
                div.classList.add("p7");
            }
            else if(table[i][j][0] = 8){
                div.classList.add("p8");
            }
            else if(table[i][j] = 1){
                div.classList.add("p1");
            }
            else if(table[i][j][0] = 9){
                div.classList.add("p9");
            }
            else if(table[i][j][0] = 0){
                div.classList.add("p0");
            }
            else if(table[i][j][0] = 10){
                div.classList.add("p10");
            }

            if(table[i][j][0] < 20){
                if(table[i][j][1] == color && turn == true) div.draggable = true;
                td[10*i+j].appendChild(div);
            }
        }
    }
});

socket.on('end', message =>{
    console.log(message);
});

socket.on('preparation', color => preparation(color));

function preparation(color){
    let table = document.createElement("table");
    table.id = 'game-table';

    for(let i = 0; i < 10; i++){
        table.appendChild(createLine((i < 6) ? false : true));
    }

    document.getElementById('game-board').appendChild(table);
    createLake();
    buton();
    stock(color);
}

function createLake(){
    let td = document.getElementsByClassName("case");
    
    for(let x = 4; x<6; x++){
        for(let y = 0; y < 5; y+=4){
            for(let i = y+2; i < y+4; i++){
                let lake1 = td[x*10+i];
                let lake = document.createElement('div');
                
                lake.classList.add('lake');
                lake1.classList.add('lake');

                lake1.appendChild(lake);
            }
        }
    }
}

function createLine(move){
    let line = document.createElement('tr');

    for(let i = 0; i < 10; i++){
        let col = document.createElement('td');

        col.classList.add('case');
        
        if(move == true){
            col.addEventListener("drop", event => drop(event));
            col.addEventListener("dragenter", event => dragEnter(event));
            col.addEventListener("dragleave", event => dragLeave(event));
            col.addEventListener("dragover", event=> allowDrop(event));
        }

        line.appendChild(col);
    }
    return line;
}

function buton(){
    let resetBtn = document.getElementById("reset");
    let randomBtn = document.getElementById("random");
    let startBtn = document.getElementById("start");

    resetBtn.addEventListener("click", () => reset());
    randomBtn.addEventListener("click", () => randGrid());
    startBtn.addEventListener("click", () => start());
}


function stock(color){
    let stock = document.createElement("table");
    stock.id = "pionStock";

    for(let x = 3; x > 0; x--){
        stock.appendChild(createStock(4*x-2,color));
    }

    document.getElementById("pions").appendChild(stock);
    
}

function createStock(i, color){
    let tr = document.createElement("tr");

    for (let x = 0; x < 4; x++){
        let td = document.createElement("td");
        td.classList.add("stock");
        td.id = "s";
        td.id += (i != -1) ? "p"+i : "b";
        let j;
        switch(i){
            case 10: j = 1; break;
            case 8: j = 2; break;
            case 9: j = 1; break;
            case 7: j = 3; break;
            case 6: j = 4; break;
            case 5: j = 4; break;
            case 4: j = 4; break;
            case 3: j = 5; break;
            case 2: j = 8; break;
            case 1: j = 1; break;
            case 0: j = 1; break;
            case -1: j = 6; break;
        }

        for(y = 1; y < j+1; y++){
            let pion = document.createElement("div");
            
            let className = (i != -1) ? "p" +i : "bomb";
            pion.classList.add("dot");
            pion.classList.add(className);
            pion.classList.add(color);

            let name = (i != -1) ? "p"+i : "b";
            name += (j != 1) ? "-"+y : "";
            pion.id = name;
            
            pion.draggable = true;
            pion.addEventListener("dragstart", event => drag(event));
            td.appendChild(pion);
        }
        i--;
        tr.appendChild(td);
    }

    return tr;
}