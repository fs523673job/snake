//context canvas 
let ctx = document.getElementById("canvas").getContext("2d")

//const area
const velocity = 30
const size = 5
var x = y = 0

//classes 
class GameDirection {
  static Left = new Direction(0)
  static Right = new Direction(1)
  static Up = new Direction(2)
  static Down = new Direction(3)
  static Undefined = new Direction(4)

  constructor(direction) {
    this.direction = direction
  }
}

class GameState {
  static Start = new GameState(0)
  static Playing = new GameState(1)
  static GameOver = new GameState(2)
  static Win = new GameState(3)
  static Pause = new GameState(4)

  constructor(state) {
    this.state = state
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

class SnakeNode {
  constructor(x, y, size) {
    this.#_x = x
    this.#_y = y
    this.#_size = size
  }

  get x() {
    return this.#_x
  }

  get y() {
    return this.#_y
  }

  get size() {
    return this.#_size
  }

  set x(x) {
    this.#_x = x
  }

  set y(y) {
    this.#_y = y
  }
}

class SnakeGame {
  #_gameState
  #_contextCanvas
  #_direction
  #_snakeNode

  constructor() {
    this.#initialize()
  }

  // getters and setters
  get frameRate() {
    return 1000 / 60
  }

  get gameState() {
    return this.#_gameState
  }

  get gameDirection() {
    return this.#_direction
  }

  get activeConsole() {
    return true
  }

  set gameDirection(direction) {
    this.#_direction = direction
  }

  set gameState(state) {
    this.#_gameState = state
  }

  #processInput(e) {
    if (e.key == 'ArrowRight') {
      this.gameDirection(GameDirection.Right)
    }
    else if (e.key == 'ArrowLeft') {
      this.gameDirection(GameDirection.Left)
    }
    else if (e.key == 'ArrowUp') {
      this.gameDirection(GameDirection.Up)
    }
    else if (e.key == 'ArrowDown') {
      this.gameDirection(GameDirection.Down)
    }
    else {
      this.gameDirection(GameDirection.Undefined)
    }

    if (activeConsole()) {
      console.log(e.key)
    }
  }

  update() {
    switch (this.gameDirection) {
      case GameDirection.Left:
        this.#_snakeNode.x--
        break
      case GameDirection.Right:
        this.#_snakeNode.x++
        break
      case GameDirection.Up:
        this.#_snakeNode.y = this.#_snakeNode.y - this.#_snakeNode.size
        break
      case GameDirection.Down:
        this.#_snakeNode.y = this.#_snakeNode.y + this.#_snakeNode.size
        break
    }

    if (activeConsole()) {
      console.log(this.#_snakeNode.x, this.#_snakeNode.y)
    }

  }

  render() {
    this.#_contextCanvas.clearRect(0, 0, 800, 600)

  }

  #initialize() {
    document.addEventListener('keydown', this.#processInput.bind(this))
    this.#contextCanvas = document.getElementById("canvas").getContext("2d")
    this.#_snakeNode = new SnakeNode(5, 5, 5)
    this.gameDirection = GameDirection.Right
    this.gameState = GameState.Start
  }
}

let mainGame = new MainGame();
document.addEventListener("keydown", mainGame.keyListener.bind(mainGame), false)
mainGame.start()
