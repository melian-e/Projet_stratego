let piece1 = document.getElementById("piece1");
let eclaireur1 = document.getElementById("eclaireur1");
let bomb1 = document.getElementById("bomb1");

form.addEventListener('submit', event => {
    event.preventDefault();
    console.log(piece1,eclaireur1,bomb1);
    socket.emit("search-game",(piece1 ? true : false),(piece1 ? true : false),(piece1 ? true : false));
    
});



