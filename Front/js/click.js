let allClicks = [];
let scoutRule;

function scoutMove(p,x,y,j,element){
    let td = document.getElementsByClassName("case");
    let move = true;
    let color = (element.className.search("red") == -1) ? "blue" : "red";
    if(td[j].firstElementChild != undefined){
        let tragetColor = (td[j].firstElementChild.className.search("red") == -1 ) ? "blue" : "red";
        if(scoutRule == true){
            if(color == tragetColor) move = false;
        }
        else {
            if(p != 1 || color == tragetColor) move = false;
        }
    }

    if(td[j+x*(-y)].firstElementChild != undefined && td[j+x*(-y)].firstElementChild != element) move = false;

    let num1 = j+"";
    let num2 = (j+(-y))+"";
    return (move && (x != 1 || num1[0] == num2[0])) ? true : false;
}


function canMove(i, x){
    let grid = document.getElementsByClassName("case");
    let red = 0, blue = 0, lake, border = false;

    if((i % 10 == 0 && i - x == 1) ||((x % 10 == 0 && x - i == 1))){
        border = true;
    }
    if(grid[x].firstChild != null){
        (grid[x].firstElementChild.className.search("red") == -1) ? blue++ : red++;
        (grid[i].firstElementChild.className.search("red") == -1) ? blue++ : red++;
    }
    else{
        lake = grid[x].className.search("lake");
    }

    return (!border && (grid[x].firstChild == null && lake == -1)|| (blue == red && blue != 0 && red != 0)) ? true : false;
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


function moveOnClick(event){
    removeClicks();
    move(event);
    
    let grid = document.getElementsByClassName("case");

    allClicks.forEach(tab => {
        grid[tab[1]].addEventListener('click', send);
    })
}




function move(event){
    let grid = document.getElementsByClassName("case");
    let i = 0;

    while( grid[i] != event.target && grid[i] != event.target.parentNode){
        i += 1;
    }

    resetGameBoard();

    for(let x = 10; x > 0; x-=9){
        for(let y = -1; y < 2; y+=2){
            if( event.target.id != "sp2") {
                if((i+x*y)>-1 && (i+x*y) < 100 && canMove(i, i+x*y)){
                    allClicks.push([i, i+x*y]);
                    grid[i+x*y].style.backgroundColor = "#598d40";
                }
            }
            else{
                let p = 1;
                while((i+x*y*p)>-1 && (i+x*y*p) < 100 && grid[i+x*y*p].className != "case lake" && scoutMove(p,x,y, i+x*y*p, event.target)){
                    allClicks.push([i, i+x*y*p]);
                    grid[i+x*y*p].style.backgroundColor = "#598d40";
                    p++;
                }
            }
        }
    }
}