let ctx = document.getElementById("canvas").getContext("2d")
const size = 5

function draw(x, y, size) {
  ctx.fillStyle = "red"
  ctx.arc(x, y, size, 0, 2 * Math.PI)
  ctx.fill();
}


function mainLoop() {
  //draw(Math.random() * window.innerWidth, Math.random() * window.innerHeight, Math.random() * 100)
  draw(5, 5, size);
  requestAnimationFrame(mainLoop)
}

mainLoop()
