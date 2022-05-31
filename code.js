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
  #_name
  #_color

  constructor(x, y, direction, size, name) {
    this.#_x = x
    this.#_y = y
    this.#_pX = this.#_x
    this.#_pY = this.#_y
    this.#_size = size
    this.#_nextNode = null
    this.#_priorNode = null
    this.#_direction = direction
    this.#_pDirection = direction
    this.#_name = name
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

  get name() {
    return this.#_name
  }

  get color() {
    return this.#_color
  }

  set color(color) {
    this.#_color = color
  }

  set name(name) {
    this.#_name = name
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
  #_foodNode
  #_intervalProcess = 170
  #_canvas
  #_snakeSize = 10
  #_score = 0
  #_idInterval
  #_domScore

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
    return true
  }

  #_programmerMode() {
    return true
  }

  #_consoleLog(methName, message) {
    if (this.#_activeConsole()) {
      console.log(methName + ' ' + message)
    }
  }

  #_processInput(e) {
    if (e.key == 'ArrowRight') {
      if (this.snakeDirection != GameDirection.Left) {
        this.snakeDirection = GameDirection.Right
      }
    }
    else if (e.key == 'ArrowLeft') {
      if (this.snakeDirection != GameDirection.Right) {
        this.snakeDirection = GameDirection.Left
      }
    }
    else if (e.key == 'ArrowUp') {
      if (this.snakeDirection != GameDirection.Down) {
        this.snakeDirection = GameDirection.Up
      }
    }
    else if (e.key == 'ArrowDown') {
      if (this.snakeDirection != GameDirection.Up) {
        this.snakeDirection = GameDirection.Down
      }
    }
    else {
      if (e.key == 'Enter') {
        this.#_canvas.requestFullscreen()
      }
      else if (e.key == ' ') {
        if (this.#_gameState == GameState.Pause) {
          this.#_resumeGame()
        }
        else if (this.#_gameState == GameState.Playing) {
          this.#_pauseGame()
        }

        return
      }
    }

    this.#_consoleLog('#_processInput', `Input Key: ${e.key}`)
  }

  #_drawMatrix() {
    this.#_contextCanvas.lineWidth = 1.1
    this.#_contextCanvas.strokeStyle = "#232332"
    this.#_contextCanvas.shadowBlur = 0
    this.#_contextCanvas.beginPath()

    for (var i = 0; i < this.#_canvas.width; i += (this.#_snakeSize * 2)) {
      this.#_contextCanvas.moveTo(i + (this.#_snakeSize * 2), 0)
      this.#_contextCanvas.lineTo(i + (this.#_snakeSize * 2), this.#_canvas.height)
    }

    for (var i = 0; i < this.#_canvas.height; i += (this.#_snakeSize * 2)) {
      this.#_contextCanvas.moveTo(0, i + (this.#_snakeSize * 2))
      this.#_contextCanvas.lineTo(this.#_canvas.width, i + (this.#_snakeSize * 2))
    }

    this.#_contextCanvas.stroke()
    this.#_contextCanvas.closePath()
  }

  #_drawSnake() {
    let nodesDraw = 1
    

    // draw snake head
    this.#_contextCanvas.fillStyle = this.#_snakeHeadNode.color
    this.#_contextCanvas.globalCompositeOperation = 'lighter'
    this.#_contextCanvas.shadowBlur = 20
    this.#_contextCanvas.shadowColor = this.#_snakeHeadNode.color
    this.#_contextCanvas.beginPath()
    this.#_contextCanvas.arc(this.#_snakeHeadNode.x, this.#_snakeHeadNode.y, this.#_snakeHeadNode.size, 0, 2 * Math.PI)
    this.#_contextCanvas.fill()
    this.#_contextCanvas.globalCompositeOperation = 'source-over'
    this.#_contextCanvas.shadowBlur = 0

    this.#_snakeNode = this.#_snakeHeadNode.priorNode

    while (this.#_snakeNode != null) {
      let hslSaturationFinder = /\d{1,}%\)/gm //Find hsl pattern
      this.#_contextCanvas.fillStyle = this.#_snakeNode.color
      this.#_contextCanvas.globalCompositeOperation = 'lighter'
      this.#_contextCanvas.shadowBlur = 20
      this.#_contextCanvas.shadowColor = this.#_snakeNode.color
      this.#_contextCanvas.beginPath()
      this.#_contextCanvas.arc(this.#_snakeNode.x, this.#_snakeNode.y, this.#_snakeNode.size, 0, 2 * Math.PI)
      this.#_contextCanvas.fill()
      this.#_contextCanvas.globalCompositeOperation = 'source-over'
      this.#_contextCanvas.shadowBlur = 0

      let fSaturation = hslSaturationFinder.exec(this.#_snakeNode.color)
      if (fSaturation && fSaturation.length > 0) {
        let nColor = Number.parseInt(fSaturation[0].replace(/\D/g, ''))
        if (nColor < 100){
          nColor += 1
          this.#_snakeNode.color = this.#_snakeNode.color.replace(fSaturation[0], nColor+'%)')
        }
      }

      this.#_snakeNode = this.#_snakeNode.priorNode

      nodesDraw++
    }
    this.#_contextCanvas.fill()
    this.#_consoleLog('#_drawSnake', `Nodes Draw: ${nodesDraw}`)
  }

  #_drawFoodNode() {
    if (this.#_foodNode) {
      this.#_contextCanvas.fillStyle = this.#_foodNode.color
      this.#_contextCanvas.globalCompositeOperation = 'lighter'
      this.#_contextCanvas.shadowBlur = 20
      this.#_contextCanvas.shadowColor = this.#_foodNode.color
      this.#_contextCanvas.beginPath()
      this.#_contextCanvas.arc(this.#_foodNode.x, this.#_foodNode.y, this.#_foodNode.size, 0, 2 * Math.PI)
      this.#_contextCanvas.fill()
      this.#_contextCanvas.globalCompositeOperation = 'source-over'
      this.#_contextCanvas.shadowBlur = 0
    }
  }

  #_addSnakeNode() {
    let indexNode = 0
    if (this.#_snakeHeadNode.priorNode == null) {
      this.#_snakeNode = this.#_snakeHeadNode
    }
    else {
      this.#_snakeNode = this.#_snakeHeadNode.priorNode
      indexNode++
      while (this.#_snakeNode != null) {
        if (this.#_snakeNode.priorNode == null) {
          break
        }
        indexNode++
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
    let newNode = new SnakeNode(localX, localY, this.#_snakeNode.direction, this.#_snakeNode.size, `body_${indexNode}`)
    newNode.color = 'hsl(0, 100%, 100%)'
    newNode.nextNode = this.#_snakeNode
    this.#_snakeNode.priorNode = newNode
    this.#_snakeHeadNode.priorNode.color = this.#_snakeHeadNode.color
    this.#_snakeHeadNode.color = this.#_foodNode.color
  }

  #_addFood() {
    let x = (Math.floor(Math.random() * (this.#_canvas.width / (this.#_snakeSize * 2))) * (this.#_snakeSize * 2)) + this.#_snakeSize
    let y = (Math.floor(Math.random() * (this.#_canvas.height / (this.#_snakeSize * 2))) * (this.#_snakeSize * 2)) + this.#_snakeSize
    let colorRandom = `hsl(${~~(Math.random() * 360)},100%,50%)`

    this.#_foodNode = new SnakeNode(x, y, GameDirection.None, this.#_snakeSize)
    this.#_foodNode.color = colorRandom

    this.#_consoleLog('#_addFood', `Food [x:${x},y:${y}]`)
  }

  #_collisionFood() {
    if (this.#_snakeHeadNode.x == this.#_foodNode.x && this.#_snakeHeadNode.y == this.#_foodNode.y) {
      this.#_addSnakeNode()
      this.#_addFood()
      this.#_updateScore()
      this.#_consoleLog('#_collisionFood', `Score: ${this.#_score}`)
    }
  }

  #_collisionWall() {
    if (this.#_snakeHeadNode.x < this.#_snakeSize || this.#_snakeHeadNode.x > (this.#_canvas.width - this.#_snakeSize) || this.#_snakeHeadNode.y < this.#_snakeSize || this.#_snakeHeadNode.y > (this.#_canvas.height - this.#_snakeSize)) {
      this.#_consoleLog('#_collisionWall', `Game Over`)
      this.#_gameOver()
    }
  }

  #_collisionSnake() {
    let snakeNode = this.#_snakeHeadNode.priorNode
    while (snakeNode != null) {
      if (this.#_snakeHeadNode.x == snakeNode.x && this.#_snakeHeadNode.y == snakeNode.y) {
        this.#_consoleLog('#_collisionSnake', `Game Over`)
        this.#_gameOver()
      }
      snakeNode = snakeNode.priorNode
    }
  }

  #_updateScore() {
    this.#_score++
    this.#_stopIntervalProcess()
    this.#_intervalProcess = this.#_intervalProcess - (this.#_intervalProcess * 0.01)
    this.#_startIntervalProcess()
    this.#_domScore.innerText = `Score: ${String(this.#_score).padStart(2, '0')} - Speed: ${this.#_intervalProcess.toFixed(2)}`
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

    this.#_consoleLog('#_updateDirection', `Snake (${snake.name}): [x:${snake.x},y:${snake.y}] - [pX:${snake.pX},pY:${snake.pY}] - [Direction:${snake.direction.direction}] - [pDirection:${snake.pDirection.direction}]`)
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
      this.#_consoleLog('#_updateDirectionBody', `Snake (${this.#_snakeNode.name}): [x:${this.#_snakeNode.x},y:${this.#_snakeNode.y}] - [pX:${this.#_snakeNode.pX},pY:${this.#_snakeNode.pY}] - [Direction:${this.#_snakeNode.direction.direction}] - [pDirection:${this.#_snakeNode.pDirection.direction}]`)
      this.#_snakeNode = this.#_snakeNode.priorNode
    }
  }

  #_startGame() {
    this.#_gameState = GameState.Start
    this.#_consoleLog('#_startGame', `Start Game`)
    this.#_addSnakeNode()
    this.#_addFood()
    this.#_startIntervalProcess()
    this.#_gameState = GameState.Playing
  }

  #_pauseGame() {
    this.#_gameState = GameState.Pause
    this.#_consoleLog('#_pauseGame', `Pause`)
    this.#_stopIntervalProcess()

    this.#_contextCanvas.fillStyle = '#FF0000'
    this.#_contextCanvas.font = 'bold 30px sans-serif'
    this.#_contextCanvas.fillText('Pause Game', this.#_canvas.width / 2 - 50, this.#_canvas.height / 2)
  }

  #_stopGame() {
    this.#_gameState = GameState.Stop
    this.#_consoleLog('#_stopGame', `Stop`)
    this.#_stopIntervalProcess()
    this.#_snakeNode = null
    this.#_foodNode = null
    this.#_score = 0
  }

  #_resumeGame() {
    this.#_gameState = GameState.Playing
    this.#_consoleLog('#_resumeGame', `Resume`)
    this.#_gameLoop()
    this.#_startIntervalProcess()
  }

  #_processAll() {
    this.#_updateDirection(this.#_snakeHeadNode)
    this.#_collisionFood()
    this.#_collisionWall()
    this.#_collisionSnake()
    this.snakeDirection = this.#_snakeHeadNode.direction
  }

  #_render() {
    //this.#_contextCanvas.clearRect(0, 0, this.#_canvas.width, this.#_canvas.height)
    this.#_contextCanvas.fillStyle = 'rgb(18, 18, 25)'
    this.#_contextCanvas.fillRect(0, 0, this.#_canvas.width, this.#_canvas.height)
    this.#_contextCanvas.beginPath()
    this.#_contextCanvas.strokeStyle = 'white'
    this.#_contextCanvas.rect(0, 0, this.#_canvas.width, this.#_canvas.height)
    this.#_contextCanvas.stroke()
    this.#_drawMatrix()
    this.#_drawFoodNode()
    this.#_drawSnake()
  }

  #_startIntervalProcess() {
    this.#_idInterval = setInterval(this.#_processAll.bind(this), this.#_intervalProcess) //start the process loop
  }

  #_stopIntervalProcess() {
    clearInterval(this.#_idInterval)
  }

  start() {  //start the game
    this.#_gameState = GameState.Playing
    this.#_gameLoop() //start the game loop
    this.#_addFood()
    this.#_startIntervalProcess()
  }

  #_gameOver() {
    this.#_gameState = GameState.GameOver
    this.#_stopIntervalProcess()
    this.#_contextCanvas.clearRect(0, 0, this.#_canvas.width, this.#_canvas.height)
    this.#_drawMatrix()
    this.#_drawFoodNode()
    this.#_drawSnake()
    this.#_contextCanvas.fillStyle = '#FF0000'
    this.#_contextCanvas.font = 'bold 30px sans-serif'
    let textWidth = this.#_contextCanvas.measureText('Game Over').width
    this.#_contextCanvas.fillText('Game Over', this.#_canvas.width / 2 - (textWidth/2), this.#_canvas.height / 2)
  }

  #_gameLoop() {
    if (this.#_gameState == GameState.Playing) {
      this.#_render() //render the game
      requestAnimationFrame(this.#_gameLoop.bind(this)) //call the game loop
    }
  }

  #_initialize() {
    document.addEventListener('keydown', this.#_processInput.bind(this))
    this.#_domScore = document.getElementById('score')
    this.#_canvas = document.getElementById("canvas")
    this.#_contextCanvas = this.#_canvas.getContext("2d")

    let x = (Math.floor(Math.random() * (this.#_canvas.width / (this.#_snakeSize * 2))) * (this.#_snakeSize * 2)) + this.#_snakeSize
    let y = (Math.floor(Math.random() * (this.#_canvas.height / (this.#_snakeSize * 2))) * (this.#_snakeSize * 2)) + this.#_snakeSize

    this.#_snakeHeadNode = new SnakeNode(x, y, GameDirection.Right, this.#_snakeSize, 'head')
    this.#_snakeHeadNode.color = 'white'
    this.gameDirection = GameDirection.Right
    this.gameState = GameState.Start
  }
}

let snakeGame = new SnakeGame()
snakeGame.start()