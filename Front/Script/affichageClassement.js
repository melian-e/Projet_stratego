let classement = (function(){
    function classementAjax(traitementReponse) {
        $.ajax({
            type: "GET",
            url: "/Front/Script/affichageClassement.js",
            success: (reponse) => {
                traitementReponse(reponse);
            },
            error: (err) =>{
                console.log("l'appel ajax n'a pas fonctionné");
            },
        });
    }

    return {
        getClassement() {
            classementAjax((table)=>{
                let location = document.getElementById("classement");

                if(table.length != 0){        
                    let tab = document.createElement("table");
                    for (let i = 0; i < table.length; i++) {
                        let row = document.createElement("tr");
                        let cell = document.createElement("td");
                        let text = document.createTextNode((i+1) +" : " + table[i].username + " , score : " + table[i].mmr);
                        
                        cell.appendChild(text);
                        row.appendChild(cell);
                        tab.appendChild(row);
                    }
                    location.appendChild(tab);
                }
                else location.innerHTML += "Aucun classement pour l'instant";
            });
        }
    }
})();

classement.getClassement();