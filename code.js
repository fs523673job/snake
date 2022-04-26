//classes enum
class GameDirection {
  static Left = new GameDirection(0)
  static Right = new GameDirection(1)
  static Up = new GameDirection(2)
  static Down = new GameDirection(3)
  static Undefined = new GameDirection(4)

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

//classes
class SnakeNode {
  #_x
  #_y
  #_size

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
  #_intervalProcess

  constructor() {
    this.#_initialize()
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

  set gameDirection(direction) {
    this.#_direction = direction
  }

  set gameState(state) {
    this.#_gameState = state
  }

  #_activeConsole() {
    console.clear()
    return true
  }

  #_processInput(e) {
    if (e.key == 'ArrowRight') {
      this.gameDirection = GameDirection.Right
    }
    else if (e.key == 'ArrowLeft') {
      this.gameDirection = GameDirection.Left
    }
    else if (e.key == 'ArrowUp') {
      this.gameDirection = GameDirection.Up
    }
    else if (e.key == 'ArrowDown') {
      this.gameDirection = GameDirection.Down
    }
    else {
      if (e.key == 'Enter') {
        document.getElementById("canvas").requestFullscreen()
      }
    }

    if (this.#_activeConsole()) {
      console.log('Input Key: ' + e.key)
    }
  }

  #_update() {
    switch (this.gameDirection) {
      case GameDirection.Left:
        this.#_snakeNode.x -= this.#_snakeNode.size
        break
      case GameDirection.Right:
        this.#_snakeNode.x += this.#_snakeNode.size
        break
      case GameDirection.Up:
        this.#_snakeNode.y -= this.#_snakeNode.size
        break
      case GameDirection.Down:
        this.#_snakeNode.y += this.#_snakeNode.size
        break
    }

    if (this.#_activeConsole()) {
      console.log('x : ' + this.#_snakeNode.x, 'y : ' + this.#_snakeNode.y + '\n' + 'direction : ' + this.#_direction.direction)
    }
  }

  #_render() {
    this.#_contextCanvas.clearRect(0, 0, 800, 600)
    this.#_contextCanvas.fillStyle = "red"
    this.#_contextCanvas.beginPath()
    this.#_contextCanvas.arc(this.#_snakeNode.x, this.#_snakeNode.y, this.#_snakeNode.size, 0, 2 * Math.PI)
    this.#_contextCanvas.fill()
  }

  start() {  //start the game
    this.#_gameState = GameState.Playing
    this.#_gameLoop() //start the game loop
    this.#_intervalProcess = 100
    setInterval(this.#_update.bind(this), this.#_intervalProcess) //update the game
  }

  #_gameLoop() {
    if (this.#_gameState == GameState.Playing) {
      this.#_render() //render the game
      requestAnimationFrame(this.#_gameLoop.bind(this)) //call the game loop
    }
  }

  #_initialize() {
    document.addEventListener('keydown', this.#_processInput.bind(this))
    this.#_contextCanvas = document.getElementById("canvas").getContext("2d")
    this.#_snakeNode = new SnakeNode(5, 5, 5)
    this.gameDirection = GameDirection.Right
    this.gameState = GameState.Start
  }
}

let snakeGame = new SnakeGame()
snakeGame.start()