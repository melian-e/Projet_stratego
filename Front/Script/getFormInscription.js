let form = document.getElementById('form');
let mdpbutton = document.getElementById('togglePassword');

// Envoi du login via le module de connexion
form.addEventListener('submit', event => {
    let input1 = document.getElementById('username');
    let input2 = document.getElementById('email');
    let input3 = document.getElementById('password');
    event.preventDefault();
    createAccount.sendAccount(input1.value,input2.value,input3.value);
    
});

mdpbutton.addEventListener('click', event=> {
    let mdp = document.getElementById('password');
    mdp.type = (mdp.type == "password") ? "text" : "password";
    mdp.focus();
});

let createAccount = (function(){
    function postAccount(username,mailAdress,password,traitementReponse) {
        $.ajax({
            type: "POST",
            url: "/Front/Script/getFormInscription.js",
            data: {
                user: username,
                mail: mailAdress,
                mdp: password
            },
            success: (reponse) => {
                traitementReponse(reponse);
            },
            error: (err) =>{
                /////////////////console.log(err);
                console.log("l'appel ajax n'a pas fonctionné");
            },
        });
    }
    return {
        sendAccount(username,mailAdress,password) {
            postAccount(username,mailAdress,password,(reponse)=>{
                let divresultatappel = document.getElementById('resultatappel');
                divresultatappel.innerHTML = reponse;
                if(reponse != "Email déjà utilisé !" && reponse != "Pseudo déjà utilisé !"){
                    window.location.href = "/Html/index.html";
                }
            });
        }
    }
})();