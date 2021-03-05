const { Socket } = require("dgram");

let allCurrentsParts = Array();

function researchParts(playerName){
    let x = 0;

    while(!allCurrentsParts[x].getPlayers().some(elem => elem == playerName)){
        x++;
    }

    return allCurrentsParts[x];
}


socket.on('new-game', (table,revealedRule, scoutRule,bombRule) => {
    allCurrentsParts.push(new Game(table[0], table[1], revealedRule, scoutRule,bombRule));
});

socket.on('ready', (playerName, table) => {
    let part = researchParts(playerName);

    part.superpose(table);
});