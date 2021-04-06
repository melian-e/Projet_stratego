const research = require("./research.js");
const bdd = require("../../moduleConnectServer.js");


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
        let temp= Math.abs( mmrj1 - mmrj2 )+ nbturn + time + 10;
        return (temp<0) ? 10 : (temp>35) ? 35 : temp;
    }
    else{
        let temp= Math.abs( mmrj1 - mmrj2 )+ nbturn + time - 10;
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
    
    bdd.con.query("SELECT mmr FROM users WHERE username=?",[j1], (err, result) => {
        if (err) throw err;

        let mmrj1 = result[0].mmr;
        
        bdd.con.query("SELECT mmr FROM users WHERE username=?",[j2], (err, result) => {
            if (err) throw err;

            let mmrj2 = result[0].mmr;
            let winner = lobby.getWinner();
            let time = (Date.now() - lobby.startTime) / 1000;
            let min = Math.floor(Math.floor(Math.floor(time) / 60) % 60);
            let tempj1 = mmr(mmrj1, mmrj2, min, lobby.numStrokes, winner == lobby.player1.id);
            let tempj2 = mmr(mmrj1, mmrj2, min, lobby.numStrokes, winner == lobby.player2.id);
        
            bdd.con.query("SELECT id FROM users WHERE username=?",[(winner == lobby.player1.id) ? j1 : j2], (err, result) => {
                if (err) throw err;
                let idWinner = result[0].id;

                bdd.con.query("SELECT id FROM users WHERE username=?",[(winner == lobby.player1.id) ? j2 : j1], (err, result) => {
                    if (err) throw err;
                    let idLoser = result[0].id;
                    let score_winner = (winner == lobby.player1.id) ? tempj1 : tempj2;
                    let score_loser = (winner == lobby.player1.id) ? tempj2 : tempj1;

                    let sec = Math.floor((time) % 60);
                    let hours = Math.floor( Math.floor(time) / 3600);
                    
                    let playTime = "";
                    if(hours > 0)  playTime += hours + ":";
                    playTime += min + ":" + (sec > 9)? sec : "0"+sec;
                
                    bdd.con.query("UPDATE users SET mmr=? WHERE username=?",[tempj1+mmrj1,j1], (err, result) =>{
                        if (err) throw err;
                        
                        bdd.con.query("UPDATE users SET mmr=? WHERE username=?",[tempj2+mmrj2,j2], (err, result) => {
                            if (err) throw err;
                            let date = new Date(lobby.startTime).toLocaleString().split('/');
                            let year = date[2].split(' ')[0];
                            let month = date[1];
                            let today = date[0];
                            let nameWinner = (winner == lobby.player1.id) ? j1 : j2;
                            let nameLoser = (winner == lobby.player1.id) ? j2 : j1;

                            sql = "INSERT INTO `games` (`id_winner`, `id_loser`, `score_winner`, `score_loser`, `date`, `play_time`,`name_winner`, `name_loser`) VALUES (?,?,?,?,?,?,?,?)";
                            let component = [idWinner, idLoser, score_winner, score_loser,year+"-"+month+"-"+today , playTime, nameWinner, nameLoser];

                            bdd.con.query(sql, component, (err, result) =>{
                                if (err) throw err;
                                
                                console.log("Une partie viens de se terminer, elle a bien été ajouté à la bdd.");
                            });
                        });
                    }); 
                });
            });
        });
    });
}

module.exports = {end, mmr};