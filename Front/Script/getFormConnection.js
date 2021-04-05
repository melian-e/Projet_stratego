let form = document.getElementById('form');
let input1 = document.getElementById('username');
let input2 = document.getElementById('password');
let divresultatappel = document.getElementById('resultatappel');

// Envoi du login via le module de connexion
form.addEventListener('submit', event => {
    event.preventDefault();
    connectAccount.testAccount(input1.value,input2.value);
    
});


let connectAccount = (function(){

    function connection(username,password,traitementReponse) {
        $.ajax({
            type: "POST",
            url: "/Front/Script/getFormConnection.js",
            data: {
                user: username,
                mdp: password
            },
            success: (reponse) => {
                traitementReponse(reponse);
                window.location.href = "/Html/index.html";
            },
            error: (err) =>{
                console.log(err);
                console.log("l'appel ajax n'a pas fonctionné");
            },
        });
    }

    return {
        testAccount(username,password) {
            connection(username,password,(reponse)=>{
                divresultatappel.innerHTML = reponse;
                console.log(reponse);
            });
        }
    }
})();