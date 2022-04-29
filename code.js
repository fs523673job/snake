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
  #_direction
  #_pDirection

  constructor(x, y, direction, size) {
    this.#_x = x
    this.#_y = y
    this.#_pX = this.#_x
    this.#_pY = this.#_y
    this.#_size = size
    this.#_nextNode = null
    this.#_priorNode = null
    this.#_direction = direction
    this.#_pDirection = direction
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

  get direction() {
    return this.#_direction
  }

  get pDirection() {
    return this.#_pDirection
  }

  set direction(direction) {
    this.#_pDirection = this.#_direction
    this.#_direction = direction
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

  get snakeDirection() {
    return this.#_snakeHeadNode.direction
  }

  set snakeDirection(direction) {
    this.#_snakeHeadNode.direction = direction
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
      this.snakeDirection = GameDirection.Right
    }
    else if (e.key == 'ArrowLeft') {
      this.snakeDirection = GameDirection.Left
    }
    else if (e.key == 'ArrowUp') {
      this.snakeDirection = GameDirection.Up
    }
    else if (e.key == 'ArrowDown') {
      this.snakeDirection = GameDirection.Down
    }
    else {
      if (e.key == 'Enter') {
        this.#_canvas.requestFullscreen()
      }
      else if (e.key == ' ') {
        this.#_addSnakeNode()
        return
      }
    }

    if (this.#_activeConsole()) {
      console.log('Input Key: ' + e.key)
    }

    this.#_render()
    this.#_processAll()
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
    let localX = this.#_snakeNode.pX
    let localY = this.#_snakeNode.pY
    switch (this.#_snakeNode.direction) {
      case GameDirection.Up:
      case GameDirection.Down:
        localX = this.#_snakeNode.x
        break
      case GameDirection.Left:
      case GameDirection.Right:
        localY = this.#_snakeNode.y
        break
    }
    let newNode = new SnakeNode(localX, localY, this.#_snakeNode.direction, this.#_snakeNode.size)
    newNode.nextNode = this.#_snakeNode
    this.#_snakeNode.priorNode = newNode
  }

  #_updateDirection(snake) {
    switch (snake.direction) {
      case GameDirection.Left:
        snake.x -= (snake.size * 2)
        break
      case GameDirection.Right:
        snake.x += (snake.size * 2)
        break
      case GameDirection.Up:
        snake.y -= (snake.size * 2)
        break
      case GameDirection.Down:
        snake.y += (snake.size * 2)
        break
    }

    if (this.#_activeConsole()) {
      console.log('Snake x : ' + snake.x, ' y : ' + snake.y + ' direction : ' + snake.direction.direction)
      console.log('Snake pX : ' + snake.pX, ' pY : ' + snake.pY + ' pDirection : ' + snake.pDirection.direction)
    }

    this.#_updateDirectionBody()
  }

  #_updateDirectionBody() {
    this.#_snakeNode = this.#_snakeHeadNode.priorNode
    while (this.#_snakeNode != null) {
      if (this.#_snakeNode.nextNode.pDirection != this.#_snakeNode.nextNode.direction) {
        switch (this.#_snakeNode.nextNode.direction) {
          case GameDirection.Left:
          case GameDirection.Right:
            this.#_snakeNode.x = this.#_snakeNode.nextNode.pX
            this.#_snakeNode.y = this.#_snakeNode.nextNode.y
            break
          case GameDirection.Up:
          case GameDirection.Down:
            this.#_snakeNode.x = this.#_snakeNode.nextNode.x
            this.#_snakeNode.y = this.#_snakeNode.nextNode.pY
            break
        }
      }
      else {
        switch (this.#_snakeNode.nextNode.direction) {
          case GameDirection.Left:
          case GameDirection.Right:
            this.#_snakeNode.x = this.#_snakeNode.nextNode.pX
            break
          case GameDirection.Up:
          case GameDirection.Down:
            this.#_snakeNode.y = this.#_snakeNode.nextNode.pY
            break
        }
      }
      this.#_snakeNode.direction = this.#_snakeNode.nextNode.pDirection
      console.log('Snake x : ' + this.#_snakeNode.x, 'y : ' + this.#_snakeNode.y + ' direction : ' + this.#_snakeNode.direction.direction)
      console.log('Snake pX : ' + this.#_snakeNode.pX, 'pY : ' + this.#_snakeNode.pY + ' pDirection : ' + this.#_snakeNode.pDirection.direction)
      this.#_snakeNode = this.#_snakeNode.priorNode
    }
  }

  #_processAll() {
    this.#_updateDirection(this.#_snakeHeadNode)
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
    //setInterval(this.#_processAll.bind(this), this.#_intervalProcess) //start the process loop
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
    this.#_snakeHeadNode = new SnakeNode(5, 5, GameDirection.Right, this.#_snakeSize)
    this.gameDirection = GameDirection.Right
    this.gameState = GameState.Start
  }
}

let snakeGame = new SnakeGame()
snakeGame.start()