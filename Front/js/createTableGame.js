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