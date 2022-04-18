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
  static Undefined = new Direction(4)

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
  constructor(x, y, size, context) {
    this.x = x
    this.y = y
    this.size = size
    this.context = context
  }

  move(direction) {
    switch (direction) {
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
    this.direction = Direction.Right
    this.snake = new Snake(x, y, size, ctx)
  }

  get velocity() {
    return velocity
  }

  start() {
    setInterval(this.mainLoop.bind(this), velocity)
  }

  mainLoop() {
    if (this !== undefined && this.snake !== undefined) {
      this.snake.move(this.direction)
      requestAnimationFrame(this.mainLoop)
    }
    else {
      console.log("snake is undefined")
    }
  }

  keyListener(e) {
    if (e.key == 'ArrowRight') {
      this.direction = Direction.Right
    }
    else if (e.key == 'ArrowLeft') {
      this.direction = Direction.Left
    }
    else if (e.key == 'ArrowUp') {
      this.direction = Direction.Up
    }
    else if (e.key == 'ArrowDown') {
      this.direction = Direction.Down
    }
    else {
      this.direction = Direction.Undefined
    }

    console.log(e.key)
  }
}

let mainGame = new MainGame();
document.addEventListener("keydown", mainGame.keyListener.bind(mainGame), false)
mainGame.start()
