let bouton = document.getElementById("click");
bouton.addEventListener('click', () => {
    socket.emit('search-game', true, true, true);
})

socket.on('preparation', color => {
    //document.body.innerHTML = color;
})

