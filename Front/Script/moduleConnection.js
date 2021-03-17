let mdp = document.getElementById('password1');
let mdpbutton = document.getElementById('togglePassword');

mdpbutton.addEventListener('click', event=> {
    mdp.type = (mdp.type == "password") ? "text" : "password";
    mdp.focus();
});