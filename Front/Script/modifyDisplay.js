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

function start(){
    document.getElementById("reset").remove();
    document.getElementById("random").remove();
    document.getElementById("start").remove();

    let td = document.getElementsByClassName('case');
    for(let i = 99; i > 59; i--){
        td[i].removeEventListener('drop', drop);
        td[i].removeEventListener('dragstart', drag);
        td[i].removeEventListener("dragenter", dragEnter);
        td[i].removeEventListener("dragleave", dragLeave);
        td[i].removeEventListener("dragover", allowDrop);
    }

    let info = document.createElement("div");
    let turn = document.createElement("p");
    let pion = document.getElementById("pions");

    info.id = "info";
    turn.id = "turn";

    info.appendChild(turn);
    pion.appendChild(info);

    randGrid();
    ready();
}

function ready(){
    let td = document.getElementsByClassName("case");
    let table = Array(10);

    for( let i = 0; i < 10; i++){
        table[i] = Array(10);
        
        for( let j = 0; j < 10; j++){

            let classVal = (td[10*i+j].firstElementChild == null)? "" : td[10*i+j].firstElementChild.className;//getAttribute("class").split(' ');

            if(classVal == "" || classVal == "lake"){
                table[i][j] = 30;
                
            }
            else if(classVal.search("bomb") != -1){
                table[i][j] = -1;
            }
            else{
                let pos = classVal.search("p");
                let num = Number(classVal[pos+1]);

                table[i][j] = (num != 1) ? num : (classVal[pos+2] != '0') ? 1 : 10;
            }
        }
    }
    socket.emit('ready', table);
}

function display(table, color, turn){
    if(color != "none") {
        updateData(table, color);
        document.getElementById("turn").innerHTML = (turn == true) ? "A vous de jouer." : "En attente de votre adversaire."
    }
    removeClicks();
    let td = document.getElementsByClassName("case");

    for( let i = 0; i < 10; i++){
        for( let j = 0; j < 10; j++){  

            if(td[10*i+j].firstElementChild != null) td[10*i+j].firstElementChild.remove();
            td[10*i+j].removeEventListener("click", moveOnClick);

            let div = document.createElement("div");
            div.classList.add("dot");
            div.classList.add(table[i][j][1]);
            div.draggable = false;     

            div.addEventListener("dragenter", wrapperEnter);
            div.addEventListener("dragleave", wrapperLeave);      

            if(table[i][j][0] == 15){
                div.classList.add("back");
            }
            else if(table[i][j][0] == -1){
                div.classList.add("bomb");
                div.id = "sb";
            }
            else if(table[i][j][0] == 0){
                div.classList.add("p0");
                div.id = "sp0";
            }
            else if(table[i][j][0] < 11){
                div.classList.add("p"+table[i][j][0]);
                div.id = "sp"+table[i][j][0];

                if(table[i][j][1] == color && turn == true){
                    div.draggable = true;
                    td[10*i+j].addEventListener("click", moveOnClick);
                    div.addEventListener("dragstart", dragGame);
                }
            }

            if(table[i][j][0] < 20){
                div.style.border = "none";
                div.style.width = "90%";
                div.style.heigth = "100%";
                div.style.position = "relative";

                td[10*i+j].appendChild(div);
            }
        }
    }
}

function counter(time){
    let end = time * 60000 + (+new Date);
    let x = setInterval(function() {
        let distance = end - (+new Date);
        
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
        if(seconds < 10){
            document.getElementById("timer").innerHTML = minutes + ":0" + seconds;
        }
        else{
            document.getElementById("timer").innerHTML = minutes + ":" + seconds;
        }
    
    if(document.getElementById("timer").getAttribute("display") == "none" || distance < 1){
        clearInterval(x);
        document.getElementById("timer").innerHTML = "";
        document.getElementById("timer").style.border = "none";
    }

    if (distance < 1 && document.getElementById("timer").style.display != "none") {
        start();
      }
    }, 1000);
}

function chrono(time){
    let start = (+new Date) - time;
    let x = setInterval(function() {        
        let distance = (+new Date) - start;

        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
        if(seconds < 10){
            document.getElementById("chrono").innerHTML = minutes + ":0" + seconds;
        }
        else{
            document.getElementById("chrono").innerHTML = minutes + ":" + seconds;
        }
    }, 1000);
}

function updateData(grid, color){
    let quantity = Array();
    let allPieces = [];
    let cell = document.getElementsByClassName("quantity");

    for(let x = 0; x < 12; x++){
        quantity[x] = 0;
    }
    for(let x = 0; x < 10; x++){
        allPieces = allPieces.concat(grid[x].filter(elem => elem[1] == color));
    }  
    allPieces.forEach(elem => {
        quantity[elem[0] + 1]++;
    });
    for(let x = 0; x < cell.length; x++){
        cell[x].innerHTML = ""+quantity[x];
    }
}