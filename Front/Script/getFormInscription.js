let form = document.getElementById('FormInscription');
let input1 = document.getElementById('username');
let input2 = document.getElementById('mailAdress');
let input3 = document.getElementById('password');

// Envoi du login via le module de connexion
form.addEventListener('submit', event => {
    event.preventDefault();
    createAccount.sendAccount(input1.value,input2.value,input3.value);
});


let createAccount = (function(){

    function postAccount(username,mailAdress,password) {
        $.ajax({
            type: "POST",
            url: "/createAccount.html",
            data: {
                user: username,
                mail: mailAdress,
                mdp: password
            },
            success: () => {
                window.location.href = "/index.html";//mettre la page pour start les parties.
            },
        });
    }

    return {
        sendAccount(username,mailAdress,password) {
            postAccount(username,mailAdress,password);
        }
    }
})();