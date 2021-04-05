let historique = (function(){
    function historiqueAjax(traitementReponse) {
        $.ajax({
            type: "GET",
            url: "/Front/Script/affichageHistorique.js",
            success: (reponse) => {
                traitementReponse(reponse);
            },
            error: (err) =>{
                console.log(err);
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
                        let text = document.createTextNode("Le " + table[i][0] + " contre " + table[i][1] + " pendant " + table[i][2] + " min, score : " + table[i][3]);
                        
                        cell.appendChild(text);
                        row.appendChild(cell);
                        tab.appendChild(row);
                    }
                    location.appendChild(tab);
                }
                else location.innerHTML += "Aucune partie de fait";
            });
        }
    }
})();

historique.getHistorique();