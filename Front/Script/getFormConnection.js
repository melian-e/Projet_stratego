let form = document.getElementById('FormInscription');
let input1 = document.getElementById('username');
let input2 = document.getElementById('password');

// Envoi du login via le module de connexion
form.addEventListener('submit', event => {
    event.preventDefault();
    connect.connectAccount(input1.value,input2.value);
});


let createAccount = (function(){

    function connection(username,password) {
        $.ajax({
            type: "POST",
            url: "/connect.html",
            data: {
                user: username,
                mdp: password
            },
            success: () => {
                window.location.href = "/index.html";
            },
        });
    }

    return {
        connectAccount(username,password) {
            connection(username,password);
        }
    }
})();