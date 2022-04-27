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
  #_pX
  #_pY
  #_size
  #_nextNode
  #_priorNode

  constructor(x, y, size) {
    this.#_x = x
    this.#_y = y
    this.#_pX = 0
    this.#_pY = 0
    this.#_size = size
    this.#_nextNode = null
    this.#_priorNode = null
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

  get nextNode() {
    return this.#_nextNode
  }

  get priorNode() {
    return this.#_priorNode
  }

  get pX() {
    return this.#_pX
  }

  get pY() {
    return this.#_pY
  }

  set nextNode(node) {
    this.#_nextNode = node
  }

  set priorNode(node) {
    this.#_priorNode = node
  }

  set x(x) {
    this.#_pX = this.#_x
    this.#_x = x
  }

  set y(y) {
    this.#_pY = this.#_y
    this.#_y = y
  }
}

class SnakeGame {
  #_gameState
  #_contextCanvas
  #_direction
  #_snakeHeadNode
  #_snakeNode
  #_intervalProcess
  #_canvas
  #_snakeSize = 5

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
    //console.clear()
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
        this.#_canvas.requestFullscreen()
      }
      else if (e.key == ' ') {
        this.#_addSnakeNode()
      }
    }

    if (this.#_activeConsole()) {
      console.log('Input Key: ' + e.key)
    }
  }

  #_drawMatrix() {
    this.#_contextCanvas.fillStyle = "black"
    this.#_contextCanvas.beginPath()

    for (var i = 0; i < this.#_canvas.width; i += (this.#_snakeSize * 2)) {
      this.#_contextCanvas.moveTo(i + (this.#_snakeSize * 2), 0)
      this.#_contextCanvas.lineTo(i + (this.#_snakeSize * 2), this.#_canvas.height)
    }

    for (var i = 0; i < this.#_canvas.height; i += (this.#_snakeSize * 2)) {
      this.#_contextCanvas.moveTo(0, i + (this.#_snakeSize * 2))
      this.#_contextCanvas.lineTo(this.#_canvas.width, i + (this.#_snakeSize * 2))
    }

    this.#_contextCanvas.strokeStyle = '#ffffff'
    this.#_contextCanvas.stroke()
  }

  #_drawSnake() {
    this.#_contextCanvas.fillStyle = "red"
    this.#_contextCanvas.beginPath()
    this.#_contextCanvas.arc(this.#_snakeHeadNode.x, this.#_snakeHeadNode.y, this.#_snakeHeadNode.size, 0, 2 * Math.PI)
    this.#_snakeNode = this.#_snakeHeadNode.priorNode
    while (this.#_snakeNode != null) {
      this.#_contextCanvas.arc(this.#_snakeNode.x, this.#_snakeNode.y, this.#_snakeNode.size, 0, 2 * Math.PI)
      this.#_snakeNode = this.#_snakeNode.priorNode
      break
    }
    this.#_contextCanvas.fill()
  }

  #_addSnakeNode() {
    if (this.#_snakeHeadNode.priorNode == null) {
      this.#_snakeNode = this.#_snakeHeadNode
    }
    else {
      this.#_snakeNode = this.#_snakeHeadNode.priorNode
      while (this.#_snakeNode != null) {
        if (this.#_snakeNode.priorNode == null) {
          break
        }
        this.#_snakeNode = this.#_snakeNode.priorNode
      }
    }
    let newNode = new SnakeNode(this.#_snakeNode.pX, this.#_snakeNode.pY, this.#_snakeNode.size)
    newNode.nextNode = this.#_snakeNode
    this.#_snakeNode.priorNode = newNode
  }

  #_updateDirection() {
    switch (this.gameDirection) {
      case GameDirection.Left:
        this.#_snakeHeadNode.x -= (this.#_snakeHeadNode.size * 2)
        break
      case GameDirection.Right:
        this.#_snakeHeadNode.x += (this.#_snakeHeadNode.size * 2)
        break
      case GameDirection.Up:
        this.#_snakeHeadNode.y -= (this.#_snakeHeadNode.size * 2)
        break
      case GameDirection.Down:
        this.#_snakeHeadNode.y += (this.#_snakeHeadNode.size * 2)
        break
    }

    if (this.#_activeConsole()) {
      console.log('x : ' + this.#_snakeHeadNode.x, 'y : ' + this.#_snakeHeadNode.y + '\n' + 'direction : ' + this.#_direction.direction)
    }

    this.#_updateDirectionBody()
  }

  #_updateDirectionBody() {
    this.#_snakeNode = this.#_snakeHeadNode.priorNode
    while (this.#_snakeNode != null) {
      this.#_snakeNode.x = this.#_snakeNode.nextNode.pX
      this.#_snakeNode.y = this.#_snakeNode.nextNode.pY
      this.#_snakeNode = this.#_snakeNode.priorNode
    }
  }

  #_processAll() {
    this.#_updateDirection()
  }

  #_render() {
    this.#_contextCanvas.clearRect(0, 0, 800, 600)
    this.#_drawSnake()
    this.#_drawMatrix()
  }

  start() {  //start the game
    this.#_gameState = GameState.Playing
    this.#_gameLoop() //start the game loop
    this.#_intervalProcess = 1000
    setInterval(this.#_processAll.bind(this), this.#_intervalProcess) //start the process loop
  }

  #_gameLoop() {
    if (this.#_gameState == GameState.Playing) {
      this.#_render() //render the game
      requestAnimationFrame(this.#_gameLoop.bind(this)) //call the game loop
    }
  }

  #_initialize() {
    document.addEventListener('keydown', this.#_processInput.bind(this))
    this.#_canvas = document.getElementById("canvas")
    this.#_contextCanvas = this.#_canvas.getContext("2d")
    this.#_snakeHeadNode = new SnakeNode(5, 5, this.#_snakeSize)
    this.gameDirection = GameDirection.Right
    this.gameState = GameState.Start
  }
}

let snakeGame = new SnakeGame()
snakeGame.start()