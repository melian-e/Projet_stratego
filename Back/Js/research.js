module.exports = {
    /**
     * Trouver la partie d'un joueur
     * @param { String } playerId
     * @param { Array } allCurrentsGames
     * @return { Game }
     */
     game(playerId, allCurrentsGames){
        let x = 0;
        
        while(x < allCurrentsGames.length && !allCurrentsGames[x].getPlayers().some(elem => elem == playerId)){
            x++;
        }

        return allCurrentsGames[x];
    },

    /**
     * Trouver la partie associé à une room
     * @param { Room } room 
     * @param { Array } allCurrentsGames 
     * @returns { Number }
     */
    gameByRoom(room, allCurrentsGames){
        let x = 0;

        while(x < allCurrentsGames.length && !room.isPresent(allCurrentsGames[x].player1.id)){
            x++;
        };

        return allCurrentsGames[x];
    },

    /**
     * Permet de trouver la room du joueur
     * @param { String } player  
     * @param { Array } allRooms
     * @returns { Set }
     */
    roomById(player, allRooms){

        let x = 0;

        while(x < allRooms.length && !allRooms[x].people.some(elem => elem == player)){
            x++;
        }
        
        return x;
    },

    /**
     * Trouve le nom du joueur à partir de l'ID de sa session
     * @param { Map } srvSockets 
     * @param { String } playerId 
     * @return { String } 
     */
     getName(srvSockets, playerId){
        if(playerId == undefined) return 'égalité';
        
        let name;
        srvSockets.forEach(user => {
            if(user.handshake.session.id == playerId){
                name = user.handshake.session.userName;
            }
        });
        return name;
    },

    /**
     * Retourner l'id du playeur en fonction de son handshake.session.id
     * @param { Map } srvSockets 
     * @param { String } playerId 
     * @returns { String }
     */
    idOf(srvSockets, playerId){
        let id;

        srvSockets.forEach(user => {
            if(user.handshake.session.id == playerId){
                id = user.id;
            }
        });
        return id;
    }
}