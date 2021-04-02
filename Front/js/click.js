function moveOnClick(ev){
    let grid = document.getElementsByClassName("case");
    let i = 0;

    while(grid[i] != ev.target.parentNode){
        i += 1;
    }

    for(let x = 10; x > 0; x-=9){
        for(let y = -1; y < 2; y+=2){
            if((i+x*y)>-1 && (i+x*y) < 100 && canMove(i, i+x*y)){
                grid[i+x*y].style.border = "solid red";
                grid[i+x*y].addEventListener('click', ()  =>{
                    resetGameBoard();
                    socket.emit('click', i, i+x*y);
                });
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