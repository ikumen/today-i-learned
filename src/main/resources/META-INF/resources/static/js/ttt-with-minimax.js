/* A position that is not played yet */
const UNPLAYED_POS = ' ';

/* All sets that for a row, col or diagonal of positions */
const WIN_SETS = [
  [0,1,2], [3,4,5], [6,7,8], 
  [0,4,8], [6,4,2], [0,3,6],
  [1,4,7], [2,5,8]
];

/* The max depth to allow minimax alogrithm to run */
const MM_MAX_SEARCH_DEPTH = Number.POSITIVE_INFINITY;

/**
 * Return a number between 0 and max (exclusive).
 * @param {number} max upper bound of random number
 * @returns number between 0 and max (exclusive)
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

/**
 * Immutable class representing the game's current for any given turn.
 */
 class GameState {
   /**
    * @param {array} positions array representing possible moves in the game
    * @param {Player} player the player that generated this state (e.g, from a move)
    * @param {Player} opponent the other player in the game
    */
  constructor(positions, player, opponent, i) {
    this.positions = positions;
    this.player = player;
    this.opponent = opponent;
    this.movesLeft = this.getAvailableMoves().length;
    this.last = i;
  }

  static create(player, opponent) {
    return new GameState(new Array(9).fill(UNPLAYED_POS), player, opponent);
  }

  /**
   * @returns true if game is won
   */
  isWon() {
    for (const ws of WIN_SETS) {
      if (UNPLAYED_POS !== this.positions[ws[0]] 
          && this.positions[ws[0]] === this.positions[ws[1]]
          && this.positions[ws[0]] === this.positions[ws[2]]) {
        return true;
      }
    }
    return false;
  }

  isGameOver() {
    return this.movesLeft === 0 || this.isWon();
  }

  /**
   * Return true if this position is unplayed.
   * @param {number} i id of position
   */
  isAvailable(i) {
    return this.positions[i] === UNPLAYED_POS;
  }

  /**
   * @returns Array of unplayed position indexes (0-th based)
   */
  getAvailableMoves() {
    return this.positions
      .map((p, i) => p === UNPLAYED_POS ? i : -1)
      .filter(e => e !== -1);
  }

  /**
   * Make the move for the current player to given position. Note, assumes
   * moves are legal, caller is responsible for check moves are possible.
   * @param {number} i position to move to
   * @returns GameState representing the move that was just made.
   */
  move(i) {
    if (this.isGameOver())
      throw 'No moves available!';

    const positions = Array.from(this.positions);
    positions[i] = this.player.id;
    return new GameState(
        positions,
        this.opponent,
        this.player,
        i
      );
  }
}

/**
 * Abstract class representing a player in the game.
 */
class Player {
  /**
   * @param {string} id identifier for this player
   * @param {string} name description for this player
   */
  constructor(id, name) {
    if (this.constructor === Player)
      throw 'Instantiation error, Player is an abstract class';
    this.id = id;
    this.name = name;
  }
}

/**
 * Delegates move to user input, handled by the upstream context.
 */
class HumanPlayer extends Player {}

/**
 * Computer player with simple AI that randomly selects a free position.
 */
class AIPlayer extends Player {
  /**
   * Make a move for to a random position.
   * @param {GameState} state 
   */
  doMove(state) {
    const moves = state.getAvailableMoves();
    return state.move(moves[getRandomInt(moves.length)]);
  }
}

class HardAIPlayer extends AIPlayer {
  /**
   * 
   * @param {GameState} state 
   */
  doMove(state) {
    if (state.movesLeft === state.positions.length) {
      return state.move(4);
    }

    const moves = state.getAvailableMoves();
    let maxVal = Number.NEGATIVE_INFINITY;
    let maxMove;
    for (const move of moves) {
      const val = this.minimax(state.move(move), false, 1);
      if (maxVal < val) {
        maxVal = val;
        maxMove = move;
      }
    }
    return state.move(maxMove);
  }

  /**
   * 
   * @param {GameState} state current state of game
   * @param {boolean} maximizing indicating if we should maximize or minimize
   * @param {number} depth how far ahead have we played, if set, we can use 
   *    to limit the minimax algorithm.
   */
  minimax(state, maximizing, depth) {
    const isWon = state.isWon();
    if (isWon || state.movesLeft === 0 || depth > MM_MAX_SEARCH_DEPTH) {
      // previous move was the winning move and by the opponent so we should minimize this path
      if (isWon && maximizing) return -1 / depth;
      // otherwise previous move was winning and by us, so we should maximize this path
      else if (isWon) return 1 / depth;
      return 0;
    }

    const moves = state.getAvailableMoves();
    let minMaxVal = maximizing ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
    if (maximizing) {
      for (const move of moves) {
        const val = this.minimax(state.move(move), false, depth+1);
        minMaxVal = Math.max(minMaxVal, val);
      }
    } else {
      for (const move of moves) {
        const val = this.minimax(state.move(move), true, depth+1);
        minMaxVal = Math.min(minMaxVal, val);
      }
    }
    return minMaxVal;
  }
}

class TTTGame {
  constructor(players) {
    this.assertValidPlayers(players);
    this.players = players;
    this.history = [];
    this.stateListeners = [];
    this.state = GameState.create(...this.players);
  }

  assertValidPlayers(players) {
    if (players.length !== 2)
      throw new Error('Two players are required to play');
    for (const player of players) {
      if (!(player instanceof Player))
        throw new Error(`players must be of type Player, but is "${(typeof player)}" instead.`);
    }
    return true;
  }

  newGame(players) {
    if (players && this.assertValidPlayers(players)) {
      this.players = players;
    }
    this.history = [];
    this.state = GameState.create(...this.players);
    this.updateState();
  }

  registerStateListener(listener) {
    this.stateListeners.push(listener);
  }

  start() {
    this.updateState();
    this.run();
  }

  run() {
    if (!this.state.isGameOver() && this.state.player instanceof AIPlayer) {
      const newState = this.state.player.doMove(this.state);
      if (newState !== undefined) {
        this.updateState(newState);
      }
    }
  }

  move = (i) => {
    if (!this.state.isGameOver() && this.state.player instanceof HumanPlayer) {
      const newState = this.state.move(i);
      if (newState !== undefined) {
        this.updateState(newState);
      }
    }
  }

  updateState(newState) {
    if (newState !== undefined) {
      this.history.push(this.state);
      this.state = newState;
    }
    for (const listener of this.stateListeners) {
      listener(this.state, this.history);
    }
  }
}

class Board {
  /**
   * @param {number} size dimension of board (e.g, 1 side)
   * @param {numer} x left most position of board
   * @param {number} y top most position of board
   */
   constructor(size, x, y) {
    this.size = size;
    this.x = x;
    this.y = y;
    this.cellListeners = [];

    this.cellSize = Math.floor(size / 3);
    this.fontSize = this.cellSize * .9;
    this.fontYOffset = this.fontSize * .9;
    this.fontXOffset = this.fontSize * .2;
    this.cellCoords = new Array(9);
    for (let i=0; i < this.cellCoords.length; i++) {
      this.cellCoords[i] = {
        x: x + (this.cellSize * (i % 3)),
        y: y + (this.cellSize * Math.floor(i / 3))
      };
    }
  }

  drawGrid() {
    fill(255);
    for (let i=0; i < this.cellCoords.length; i++) {
      const {x, y} = this.cellCoords[i];
      rect(x, y, this.cellSize);
    }
  }

  /**
   * Draw cell states.
   * @param {array} cells to draw
   */
  drawCells(cells) {
    fill(0);
    textSize(this.fontSize);
    for (let i=0; i < this.cellCoords.length; i++) {
      const {x, y} = this.cellCoords[i];
      text(cells[i], x + this.fontXOffset, y + this.fontYOffset);
    }
  }

  onNewCellStates = ({positions}) => {
    this.drawCells(positions);
  }

  /**
   * Add a cell listener
   * @param {function} listener to call on a cell click event, will be
   *    given this board and id of cell clicked.
   */
  registerCellListener(listener) {
    this.cellListeners.push(listener);
  }

  /**
   * Process mouse pressed events, if mouse pressed within this board, detect
   * the cell and notify any cell listeners of cell that was clicked. Cell
   * listeners are called cell id and this board.
   * 
   * @param {number} mX mouse x
   * @param {number} mY mouse y
   */
  onMousePressed(mX, mY) {
    for (let i=0; i < this.cellCoords.length; i++) {
      const {x, y} = this.cellCoords[i];
      if ((mX >= x && mX <= (x + this.cellSize)) &&
          (mY >= y && mY <= (y + this.cellSize))) {
        //console.log(`Mouse pressed at: ${mX}, ${mY}, cell: ${i}`);
        for (const listener of this.cellListeners)
          listener(i, this);
        break;    
      }
    }
  }  
}

/////// Canvas setup, user interface
let board, game, player1, player2;

function setup() {
  const sketch = sketchHelper('sketch');
  const size = Math.max(180, Math.min(300, sketch.width));
  
  const boardSize = size - 5;
  const boardX = (size - boardSize) / 2;
  const boardY = 3;
  mainDiv = createDiv().parent(sketch.get());
  mainDiv.class('flex flex-wrap justify-center');
  createCanvas(size, boardSize + 5).parent(mainDiv);  
  frameRate(10);
  stroke(0)
  background(100);

  board = new Board(boardSize, boardX, boardY);
  board.drawGrid();

  const aiEasyPlayer = new AIPlayer('X', 'Easy AI')
  const aiHardPlayer = new HardAIPlayer('X', 'Hard AI');
  const human1Player = new HumanPlayer('X', 'Human 1')
  const human2Player = new HumanPlayer('O', 'Human 2');

  game = new TTTGame([aiHardPlayer, human2Player]);
  game.registerStateListener(board.onNewCellStates);
  board.registerCellListener(game.move);

  const menuDiv = createDiv();
  menuDiv.parent(mainDiv);
  menuDiv.class('ml2 mt1 w-30')

  const selectGame = createSelect();
  selectGame.parent(menuDiv);
  selectGame.option(`${aiHardPlayer.name} vs. ${human1Player.name}`, 'ahvh1');
  selectGame.option(`${aiEasyPlayer.name} vs. ${human1Player.name}`, 'aevh1');
  selectGame.option(`${human1Player.name} vs. ${human2Player.name}`, 'h1vh2');
  selectGame.selected('ahvh1');

  const newGameBtn = createButton('New game')
  newGameBtn.class('mt2')
  newGameBtn.parent(menuDiv);
  newGameBtn.mousePressed(() => {
    switch (selectGame.value()) {
      case 'ahvh1':
        game.newGame([aiHardPlayer, human2Player]);
        break;
      case 'aevh1':
        game.newGame([aiEasyPlayer, human2Player]);
        break;
      default:
        game.newGame([human1Player, human2Player]);
        break;
    }
    board.drawGrid();
  });

  const statusLabel = createDiv();
  statusLabel.class("mt3 fw6");
  statusLabel.html('Status')
  statusLabel.parent(menuDiv);

  const status = createDiv();
  status.parent(menuDiv);

  game.registerStateListener((state, history) => {
    const prev = history.length > 0 ? history[history.length-1] : {}
    if (state.isGameOver()) {
      const prev = history[history.length-1];
      if (state.isWon()) status.html(`<div>${prev.player.id} wins!!!!</div>`);
      else status.html(`<div>It's a tie!</di>`);
    } else {
      status.html(`<div>Waiting for player ${state.player.id}...</div>`);
    }
  });
  
  game.start();
}

function mousePressed() {
  board.onMousePressed(mouseX, mouseY);
}

function draw() {
  game.run();
}
