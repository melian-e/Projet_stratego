let historique = (function(){
    function historiqueAjax(traitementReponse) {
        $.ajax({
            type: "GET",
            url: "/Front/Script/affichageHistorique.js",
            success: (reponse) => {
                traitementReponse(reponse);
            },
            error: (err) =>{
                ///////////console.log(err);
                console.log("l'appel ajax n'a pas fonctionné");
            },
        });
    }

    return {
        getHistorique() {
            historiqueAjax((table)=>{
                let location = document.getElementById("historique");

                if(table.length != 0){
                    let tab = document.createElement("table");
        
                    for (let i = 0; i < table.length; i++) {
                        let row = document.createElement("tr");
                        let cell = document.createElement("td");
                        let text;
                        if(table[i].name_winner == undefined){
                            text = document.createTextNode("Le " + table[i].date + " contre " + table[i].name_loser + " pendant " + table[i].play_time + " min, score : " + table[i].score_winner);
                        }
                        else{
                            text = document.createTextNode("Le " + table[i].date + " contre " + table[i].name_winner + " pendant " + table[i].play_time + " min, score : " + table[i].score_loser);
                        }
                        
                        cell.appendChild(text);
                        row.appendChild(cell);
                        tab.appendChild(row);
                    }
                    location.appendChild(tab);
                }
                else location.innerHTML += "Aucune partie de faite";
            });
        }
    }
})();

historique.getHistorique();