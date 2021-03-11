function allowDrop(ev) {
    ev.preventDefault();
}

function dragEnter(ev){
    if(ev.target == "[object HTMLTableCellElement]" && ev.target.firstChild == null){
        ev.target.style.border = "solid red";
    }
}

function dragLeave(ev){
    if(ev.target == "[object HTMLTableCellElement]"){
        ev.target.style.border = "2px solid black";
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
    ev.target.style = "2px solid black;"
    let data = ev.dataTransfer.getData("div");
    let pion = document.getElementById(data);
    alert(ev.target.parentElement.id)
    if(ev.target == "[object HTMLTableCellElement]" && ev.target.firstChild == null){
        ev.target.appendChild(pion);
        pion.style.border = "none";
        pion.style.width = "90%";
        pion.style.heigth = "100%";
        pion.style.position = "relative";
    }
    if(ev.target == document.getElementById("pionStock") || ev.target.parentElement.id == document.getElementById("pionStock").id){
        alert(document.getElementById("pionStock"))
        let pionStock = document.getElementsByClassName("stock");
        pionStock[getCase(pion)].appendChild(pion);   
        pion.style.width = "55px";
        pion.style.heigth = "55px";
        pion.style.position = "absolute";   
    }
    
}

function reset(){
    let pion = document.getElementsByClassName("dot");
    let pionStock = document.getElementsByClassName("stock")
    for(let i = 0; i < pion.length; i++){
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
        if(pion[i].parentElement.parentElement.id != "game-board"){
            pion[i].style.width = "90%";
            pion[i].style.heigth = "100%";
            pion[i].style.position = "relative";
            randCase(pion[i], grid);
        }
    }
}
function test(ev){
    let grid = document.getElementsByClassName("case");
    let i = 0;
    while(grid[i] != ev.target.parentElement){
        i += 1;
    }
    if(i-10>0 && grid[i-10].firstChild == null){
        grid[i-10].style.border = "solid red";
    }
    if(i+10<99 && grid[i+10].firstChild == null){
        grid[i+10].style.border = "solid red";
    }
    if(i%10!=0 && grid[i-1].firstChild == null){
        grid[i-1].style.border = "solid red";
    }
    if((i+1)%10!=0 && grid[i+1].firstChild == null){
        grid[i+1].style.border = "solid red";
    }
}
function start(){
    document.getElementById("chrono").setAttribute("display", "none");
    //document.getElementById("chrono").remove();
    document.getElementById("reset").remove();
    document.getElementById("random").remove();
    document.getElementById("start").remove();
    let pion = document.getElementsByClassName("dot");
    //let bomb = document.getElementsByClassName("bomb");
    for(let i = 0; i < pion.length; i++){
        console.log(pion[i]);
        pion[i].setAttribute("draggable", false);
        pion[i].setAttribute("ondragstart","");
        pion[i].setAttribute("onclick", "test(event)");
        /*if(bomb.indexOf(pion[i]) == -1){
            );
        }*/
       
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