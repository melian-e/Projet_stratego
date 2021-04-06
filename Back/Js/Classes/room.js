const research = require("../research.js");
const mmr = require("../mmr.js");
const emit = require('../../../moduleConnectServer.js');

class Room {
    constructor(pers){
        this.people = pers;
    }
    join(playerId){
        this.people.push(playerId);
    }
    leave(socket){
        socket.handshake.session.inGame = false;
        this.people.splice(this.people.indexOf(socket.handshake.session.id), 1);
    }
    isPresent(playerId){
        return this.people.some(user => user == playerId);
    }
    display(srvSockets, lobby){
        let playerId, grid, color, turn;
        srvSockets.forEach(user => {
            playerId = user.handshake.session.id;
            if(this.people.some(elem => playerId == elem)){
                grid = lobby.convertGrid((lobby.getPlayers().some(elem => playerId == elem)) ? playerId : 'spectator');
                color = (playerId == lobby.player1.id) ? lobby.player1.color : (playerId == lobby.player2.id) ? lobby.player2.color : 'none'
                turn = (playerId == lobby.getCurrentPlayerName().id) ? true : false;
                
                emit.io.to(user.id).emit('display', grid, color, turn);
            }
        });
    }
    end(srvSockets, lobby){
        mmr.end(srvSockets, lobby);
        
        let winner = lobby.getWinner();
        let loser = (winner == lobby.player1.id) ? lobby.player2.id : lobby.player1.id;
        let winnerName = research.getName(srvSockets, winner);
        let loserName = research.getName(srvSockets, loser);
        
        srvSockets.forEach(user => {
            let playerId = user.handshake.session.id;
            if(this.people.some(elem => playerId == elem)){
                user.handshake.session.inGame = false;
                
                if(winner != undefined){
                    let message = (playerId == winner) ? 'Tu as gagné.' : (playerId == loser) ? 'Tu as perdu.':
                    winnerName + ' a gagné.';

                    emit.con.query("SELECT mmr FROM users WHERE username=?",[winnerName], (err, result) => {
                        if (err) throw err;
                        let winnerMmr = result[0].mmr;
                    
                        emit.con.query("SELECT mmr FROM users WHERE username=?",[loserName], (err, result) => {
                            if (err) throw err;
                            
                            let loserMmr = result[0].mmr;
                            let time = (Date.now() - lobby.startTime) / 1000;
                            let min = Math.floor(Math.floor(Math.floor(time) / 60) % 60);
                            let gain = mmr.mmr(winnerMmr, loserMmr, min, lobby.numStrokes, true);
                            let perte = mmr.mmr(winnerMmr, loserMmr, min, lobby.numStrokes, false);
                            
                            emit.io.to(user.id).emit('end', message, [[winnerName, gain],[loserName, perte]], lobby.revealedRule, lobby.scoutRule, lobby.bombRule, );
                        });
                    });
                }
                else{

                    emit.io.to(user.id).emit('end', research.getName(io.sockets.sockets, winner), [], null, null, null);
                }
            }
        });
    }
    simpleEvent(srvSockets, eventName, arg){
        srvSockets.forEach(user => {
            if(this.people.some(elem => user.handshake.session.id == elem)){
                if(eventName == 'game-redirect'){
                    user.handshake.session.redirect = true;
                }

                emit.io.to(user.id).emit(eventName, arg);
            }
        });
    }
}

module.exports = Room;