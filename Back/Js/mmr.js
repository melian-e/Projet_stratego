let research = require("./research.js");
let bdd = require("../../moduleConnectServer.js");

/**
 * Calcule le gain ou la perte de mmr du'n joueur
 * @param { int } mmrj1 
 * @param { int } mmrj2 
 * @param { int } time 
 * @param { int } nbturn 
 * @param { boolean } winner 
 * @returns { int }
 */
function mmr(mmrj1,mmrj2,time,nbturn,winner){
    time=15-time;
    if(time<-30){
        time = -30;
    }

    nbturn=40-nbturn;
    if(nbturn<-30){
        nbturn = -30;
    }
    if(winner==true){
        let temp= abs( mmrj1 - mmrj2 )+ nbturn + time + 10;
        return (temp<0) ? 10 : (temp>35) ? 35 : temp;
    }
    else{
        let temp= abs( mmrj1 - mmrj2 )+ nbturn + time - 10;
        return (temp>0) ? -10 :(temp<-35) ? -35 : temp;
    }
};

/**
 * Met à jour le mmr des joueurs à la fin de la partie
 * @param { Map } srvSockets  
 * @param { Game } lobby 
 */
function end(srvSockets, lobby){
    let j1 = research.getName(srvSockets, lobby.player1.id);
    let j2 = research.getName(srvSockets, lobby.player2.id);
    
    let mmrj1 = bdd.con.query("SELECT mmr FROM users WHERE username=?",[j1]);
    let mmrj2 = bdd.con.query("SELECT mmr FROM users WHERE username=?",[j2]);

    let winner = lobby.getWinner();
    let time = (Date.now() - lobby.startTime) / 1000;
    let min = Math.floor(Math.floor(Math.floor(time/1000) / 60) % 60);

    let tempj1 = mmr(mmrj1, mmrj2, min, lobby.numStrokes, winner == lobby.player1.id);
    let tempj2 = mmr(mmrj1, mmrj2, min, lobby.numStrokes, winner == lobby.player2.id);


    bdd.con.query("UPDATE users SET mmr=? WHERE username=?",[tempj1+mmrj1,j1]);
    bdd.con.query("UPDATE users SET mmr=? WHERE username=?",[tempj2+mmrj2,j2]);
}

module.exports = {end};