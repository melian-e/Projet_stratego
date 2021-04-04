let allClicks = [];

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
    move(event, "click");
}

function move(event, name){
    let grid = document.getElementsByClassName("case");
    let i = 0;

    while( grid[i] != event.target && grid[i] != event.target.parentNode){
        i += 1;
    }

    resetGameBoard();

    socket.emit("cases", i, name);
}


socket.on("cases", (cases, event) => {
    let grid = document.getElementsByClassName("case");
    
    allClicks = cases;
    allClicks.forEach( tab => {
        grid[tab[1]].style.backgroundColor = "#598d40";
        if(event == "click") grid[tab[1]].addEventListener('click', send);
    });
});