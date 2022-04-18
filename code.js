//context canvas 
let ctx = document.getElementById("canvas").getContext("2d")

//const area
const velocity = 30
const size = 5
var x = y = 0

//classes 
class Direction {
  static Left = new Direction(0)
  static Right = new Direction(1)
  static Up = new Direction(2)
  static Down = new Direction(3)

  constructor(direction) {
    this.direction = direction
  }
}

class SnakeDraw {
  static draw(x, y, color, size, context) {
    context.clearRect(0, 0, 800, 600)
    context.fillStyle = color
    context.beginPath()
    context.arc(x, y, size, 0, 2 * Math.PI)
    context.fill()
  }
}

class Snake {
  constructor(x, y, size, direction, context) {
    this.x = x
    this.y = y
    this.size = size
    this.direction = direction
    this.context = context
  }

  move() {
    switch (this.direction) {
      case Direction.Left:
        this.x--
        break
      case Direction.Right:
        this.x++
        break
      case Direction.Up:
        this.y--
        break
      case Direction.Down:
        this.y++
        break
    }
    SnakeDraw.draw(this.x, this.y, "red", this.size, this.context)
  }
}

class MainGame {
  constructor() {
    this.snake = new Snake(x, y, size, Direction.Right, ctx)
  }

  start() {
    setInterval(this.mainLoop.bind(this), velocity)
  }

  mainLoop() {
    this.snake.move()
    requestAnimationFrame(MainGame.mainLoop)
  }

  keyListener(e) {
    if (e.key == 39) {
      rightPressed = true;
    }
    else if (e.key == 37) {
      leftPressed = true;
    }
    else if (e.keyCode == 38) {
      upPressed = true;
    }
    else if (e.keyCode == 40) {
      downPressed = true;
    }
    else if (e.keyCode == 32) {
      spacePressed = true;
    }

    console.log(e.key)
  }
}

let mainGame = new MainGame();
document.addEventListener("keydown", mainGame.keyListener, false)
mainGame.start()

/*
function draw() {
  ctx.fillStyle = "red"
  ctx.beginPath()
  ctx.clearRect(0, 0, 800, 600)
  ctx.arc(x, y, size, 0, 2 * Math.PI)
  ctx.fill();
  requestAnimationFrame(draw)
  //console.log('draw')
}

function mainLoop() {
  //draw(Math.random() * window.innerWidth, Math.random() * window.innerHeight, Math.random() * 100)
  //draw(x1++, y1++, size);
  incVar()
}

function incVar() {
  x++
  y++
}

draw()
setInterval(mainLoop, 30)
*/
