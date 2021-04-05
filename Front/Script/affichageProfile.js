let profile = (function(){
    function profileAjax(traitementReponse) {
        $.ajax({
            type: "GET",
            url: "/Front/Script/affichageProfile.js",
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
        getProfile() {
            profileAjax((table)=>{
                let location = document.getElementById("profile");
                if(table.length != 0){
                    location.innerHTML += "Vous êtes n°" + table[0] + ", avec un score de " + table[1];
                }
                else location.innerHTML += "Vous n'êtes pas connecté !";
            });
        }
    }
})();

profile.getProfile();