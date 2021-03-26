const research = require("../research.js");
const emit = require('../../../moduleConnectServer.js');

class Room {
    constructor(pers){
        this.people = pers;
    }
    join(playerId){
        this.people.push(playerId);
    }
    leave(playerId){
        this.people.splice(this.people.indexOf(playerId), 1);
    }
    isPresent(playerId){
        return this.people.some(user => user == playerId);
    }
    display(srvSockets, lobby){
        let playerId;
        let grid;
        srvSockets.forEach(user => {
            playerId = user.handshake.session.id;
            if(this.people.some(elem => playerId == elem)){
                grid = lobby.convertGrid((lobby.getPlayers().some(elem => playerId == elem)) ? playerId : 'spectator');
                emit.emitRoom(user.id, 'display', grid);
            }
        });
    }
    end(srvSockets, lobby){
        let winner = lobby.getWinner();
        let loser = (winner == lobby.player1.id) ? lobby.player2.id : lobby.player1.id;
        
        srvSockets.forEach(user => {
            let playerId = user.handshake.session.id;
            if(this.people.some(elem => playerId == elem)){
                if(winner != undefined){
                    let message = (playerId == winner) ? 'Tu as gagné.' : (playerId == loser) ? 'Tu as perdu.':
                    research.getName(io.sockets.sockets, winner) + ' as gagné.';
                    emit.emitRoom(user.id, 'end', message);
                }
                else{
                    emit.emitRoom(user.id, 'end', research.getName(io.sockets.sockets, winner));
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
                emit.emitRoom(user.id, eventName, arg);
            }
        });
    }
}

module.exports = Room;