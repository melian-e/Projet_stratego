let allClicks = [];
function moveOnClick(ev){
    let grid = document.getElementsByClassName("case");
    let i = 0;

    while(grid[i] != ev.target.parentNode){
        i += 1;
    }

    removeClicks();
    for (let j = 0; j < grid.length; j++){
        grid[j].style.backgroundColor ="transparent";
    }

    for(let x = 10; x > 0; x-=9){
        for(let y = -1; y < 2; y+=2){
            if((i+x*y)>-1 && (i+x*y) < 100 && canMove(i, i+x*y)){
                allClicks.push([i, i+x*y]);
                grid[i+x*y].style.backgroundColor = "#598d40";
                grid[i+x*y].addEventListener('click', send);
            }
        }
    }
}

function canMove(i, x){
    let grid = document.getElementsByClassName("case");
    let red = 0, blue = 0, lake;

    if(grid[x].firstChild != null){
        (grid[x].firstElementChild.className.search("red") == -1) ? blue++ : red++;
        (grid[i].firstElementChild.className.search("red") == -1) ? blue++ : red++;
    }
    else{
        lake = grid[x].className.search("lake");
    }

    return ((grid[x].firstChild == null && lake == -1)|| (blue == red && blue != 0 && red != 0)) ? true : false;
}

function send(event){
    let td = document.getElementsByClassName("case");
    let i = 0, x = 0;
    while(td[i] != event.currentTarget){
        i++;
    }

    while(allClicks[x][1] != i){
        x++;
    }
    let tab = allClicks[x];
    resetGameBoard();
    removeClicks();
    socket.emit('click', tab[0], tab[1]);
}

function removeClicks(){
    let td = document.getElementsByClassName("case");
    allClicks.forEach(tab => {
        td[tab[1]].removeEventListener('click', send);
    });
    allClicks = [];
}