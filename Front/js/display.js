socket.emit('preparation');


socket.on('preparation', color => {
    console.log(color);
    document.getElementById("color").innerHTML = color;
});
