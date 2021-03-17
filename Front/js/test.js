let bouton = document.getElementById("click");
bouton.addEventListener('click', () => {
    socket.emit('search-game', true, true, true);
})


socket.on('game-redirect', () => {
    window.location.href = "/html/display.html";
}); 

socket.on('preparation', color => {
    document.getElementById("color").innerHTML = color;
});

