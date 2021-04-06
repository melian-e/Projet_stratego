function preparation(color){
    let table = document.createElement("table");
    table.id = 'game-table';

    for(let i = 0; i < 10; i++){
        table.appendChild(createLine((i < 6) ? false : true));
    }

    document.getElementById('game-board').appendChild(table);
    counter(2);
    createLake();
    buton();
    stock(color);
    completDataPion();
}

function createLake(){
    let td = document.getElementsByClassName("case");
    
    for(let x = 4; x<6; x++){
        for(let y = 0; y < 5; y+=4){
            for(let i = y+2; i < y+4; i++){
                let lake = td[x*10+i];

                let lakeNum = (y == 0) ? 1 : 2;
                let caseNum = (x == 4) ? ((i % 2 == 0) ? 1 : 2) : ((i % 2 == 0) ? 3 : 4);
                
                lake.classList.add('lake');
                lake.classList.add("l"+lakeNum+"-"+caseNum);
            }
        }
    }
}

function createLine(move){
    let line = document.createElement('tr');

    for(let i = 0; i < 10; i++){
        let td = document.createElement('td');

        td.classList.add('case');
        
        if(move == true){
            td.addEventListener("drop", drop);
            td.addEventListener("dragenter", dragEnter);
            td.addEventListener("dragleave", dragLeave);
            td.addEventListener("dragover", allowDrop);
        }

        line.appendChild(td);
    }
    return line;
}

function buton(){
    let resetBtn = document.getElementById("reset");
    let randomBtn = document.getElementById("random");
    let startBtn = document.getElementById("start");

    resetBtn.addEventListener("click", reset);
    randomBtn.addEventListener("click", randGrid);
    startBtn.addEventListener("click", start);
}


function stock(color){
    let stock = document.createElement("table");
    stock.id = "pionStock";

    for(let x = 3; x > 0; x--){
        stock.appendChild(createStock(4*x-2,color));
    }

    let quit = document.createElement("button");
    quit.id = "leave";
    quit.innerHTML = "Quitter";
    quit.addEventListener("click", () => {
        window.location.href = "index.html";
    })

    document.getElementById("pions").appendChild(stock);
    document.getElementById("pions").appendChild(quit);

    
}

function createStock(i, color){
    let tr = document.createElement("tr");

    for (let x = 0; x < 4; x++){
        let td = document.createElement("td");
        td.classList.add("stock");
        td.id = "s";
        td.id += (i != -1) ? "p"+i : "b";
        let j = getValue(i);

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
            pion.addEventListener("dragstart", drag);
            td.appendChild(pion);
        }
        i--;
        tr.appendChild(td);
    }

    return tr;
}

function getValue(i){
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
    return j;
}

function completDataPion(){
    let table = document.getElementById("dataPion");
    let tr = table.getElementsByClassName("data");

    for(let x = 0; x < tr.length; x++){
        let td = document.createElement("td");
        let text
        if(x == 0) text = document.createTextNode("Nombre restant");
        else{
            let classes = tr[x].className.split('s');
            text = document.createTextNode(""+getValue((classes.length == 1) ? -1 : Number(classes[1])));
            td.classList.add("quantity");
        }
        td.appendChild(text);
        tr[x].appendChild(td);
    }
}