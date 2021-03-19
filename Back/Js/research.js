module.exports = {
    /**
     * Trouver la partie d'un joueur
     * @param { String } playerId
     * @param { Array } allCurrentsGames
     * @return { Game }
     */
     game(playerId, allCurrentsGames){
        let x = 0;

        while(!allCurrentsGames[x].getPlayers().some(elem => elem == playerId)){
            x++;
        }

        return allCurrentsGames[x];
    },

    /**
     * Recherche la room de la partie 
     * @param { Set } rooms 
     * @return { String }
     */
    room(rooms){
        let x = 0;
        let room = 'room';
    
        if(rooms.size != 1){
        while(!rooms.has(room+x)){
            x++;
        }
        }
        return room + x;
    },
    /**
     * Permet de trouver les rooms du joueur souahité
     * @param { Map } srvSockets 
     * @param { String } player 
     * @returns { Set }
     */
    roomById(srvSockets, player){
        
        let room;
        srvSockets.forEach(user =>{
            if(user.handshake.session.id == player) room = user.rooms;
        })
        
        return room;
    },

    /**
     * Trouve le nom du joueur à partir de l'ID de sa session
     * @param { Map } srvSockets 
     * @param { String } playerId 
     * @return { String } 
     */
     getName(srvSockets, playerId){
        if(playerId == undefined) return 'mate';
        
        let name;
        srvSockets.forEach(user => {
            if(user.handshake.session.id == playerId){
                name = user.handshake.session.name;
            }
        });
        return name;
    },
}