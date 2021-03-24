let createLine = function(){

    let line = document.createElement('tr');

    for(let i = 0; i < 10; i++){
        let col = document.createElement('td');
        col.style.width = '70px';
        col.style.height = '70px';
        col.style.border = '2px black solid';
        col.addEventListener('click', (event) => {

            let i=0;
            let td = document.getElementsByTagName('td');

            while(td[i] != event.currentTarget && i != td.length){
                i++;
            }
            
            socket.emit('click', 98, i);
        });
        line.appendChild(col);
    }
    return line;
}

function createTab(){
    let table = document.createElement("table");
    for(let i = 0; i < 10; i++){
        table.appendChild(createLine());
    }

    document.getElementById('div').appendChild(table);
    table.style.border = '2px black solid'; 
    table.style.borderCollapse = 'collapse';
}

let MaJ = function(table){
    let td = document.getElementsByTagName('td');

    for (let i = 0; i < 10; i++){
        for (let j = 0; j < 10; j++){
            td[i*10+j].innerHTML =  table[i][j];
        }
    }
}

let wait = document.getElementById("wait");
let currentGame = document.getElementById("current-game");
let spectator = document.getElementById("spectator");
let ready = document.getElementById("ready");
let quit = document.getElementById("quit");

if(wait != undefined){
    wait.addEventListener('click', () => {
        socket.emit('search-game', true, true, true);
    });
}

currentGame.addEventListener('click', () => {
    socket.emit('current-games');
});

spectator.addEventListener('click', () => {
    socket.emit('new-spectator', 0);    
});

ready.addEventListener('click', () => {
    let table = Array(10);
    let td = document.getElementsByTagName('td');
    if(td[0].style.backgroundColor != 'white'){
        for(let i = 0; i < 10; i++){
            table[i] = Array(10);
            for(let j = 0; j < 10; j++){
                table[i][j] = (td[10*i+j].innerHTML == '') ? 30 : 3;//(td[10*i+j].innerHTML.split(',')[0] == 30) ? 30 : 3;
            }
        }

        table[9][9] = 0;
        table[9][8] = 8;

    
    socket.emit('ready', table);
    }
});

quit.addEventListener('click', () => {
    socket.emit('quit');
})

socket.on('game-redirect', () => {
    console.log('redirect');
    window.location.href = "/html/display.html";

    /*$.ajax({
        type: "POST",
        url: "/test/",
        success: () => {
          window.location.href = "/html/display.html";
        },
    });*/
    

});

socket.on('current-games', (table) => {
    console.log(table);
});

socket.on('display', (game) => {
    console.log(game);
    MaJ(game);
});

socket.on('end', (message) => {
    console.log(message);
});

socket.on('start', () => {
    console.log('Début de la partie');
});

socket.on('preparation', (color) => {
    console.log('preparation');
    let td = document.getElementsByTagName('td');
    let i = 0;

    while (i < td.length){
        td[i].style.backgroundColor =  color;
        i++;
    }
});