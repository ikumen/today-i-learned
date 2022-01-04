function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const PLAYER_X_ID = 'X';
const PLAYER_O_ID = 'O';

class Player {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

class HumanPlayer extends Player {
  constructor(id, name) {
    super(id, name);
  }
}

class ComputerPlayer extends Player {
  constructor(id, name) {
    super(id, name);
  }
  doMove() { throw 'Not implemented'; }
}

class SimpleComputerPlayer extends ComputerPlayer {
  constructor(id, name) {
    super(id, name);
  }
  /**
   * Make a move with the current state
   * @param {GameState} state current game state
   * @returns newly generated GameState
   */
  doMove(state) {
    const moves = state.getAvailableMoves();
    return state.move(moves[getRandomInt(moves.length)]);
  }
}

class HardComputerPlayer extends ComputerPlayer {
  constructor(id, name) {
    super(id, name);
  }

  /**
   * 
   * @param {GameState} state 
   * @returns 
   */
  doMove(state) {
    console.log('inside computer doMove')
    if (state.movesLeft >= 7) {
      for (const i of [4, 0, 2, 6, 8]) {
        if (state.isAvailable(i)) {
          return state.move(i);
        }
      }
    }

    const moves = state.getAvailableMoves();
    let maxVal = Number.NEGATIVE_INFINITY;
    let maximalMove;
    for (const move of moves) {
      const val = this.minimax(state.move(move), false, 5);
      if (val > maxVal) {
        maxVal = val;
        maximalMove = move;
      }
    }
    return state.move(maximalMove);
  }

  /**
   *    
   * @param {GameState} state 
   * @param {boolean} maximizing 
   */
  minimax(state, maximizing, depth) {
    const isWon = state.isWon();
    if (isWon || state.movesLeft === 0 || depth <= 0) {
      return state.evaluate(maximizing);
    }

    const moves = state.getAvailableMoves();
    let minimaxVal = maximizing ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
    if (maximizing) {
      for (const move of moves) {
        const val = this.minimax(state.move(move), !maximizing, depth-1);
        minimaxVal = Math.max(minimaxVal, val);
      }
    } else {
      for (const move of moves) {
        const val = this.minimax(state.move(move), !maximizing, depth-1);
        minimaxVal = Math.min(minimaxVal, val);
      }
    }
    return minimaxVal;
  }
}


class TTTGame {
  /**
   * @param {array} players 
   */
  constructor(players) {
    if (players.length !== 2)
      throw 'Two players are required to play!';
    for (const player of players) {
      if (!(player instanceof Player) || (player.id !== PLAYER_X_ID && player.id !== PLAYER_O_ID))
        throw 'Player must be instance of Player with X or O as id';
    }
    this.players = players;
    this.history = [];
    this.stateListeners = [];
    this.state = GameState.create(...this.players);
  }

  newGame() {
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
    if ((!this.state.isWon() && this.state.movesLeft > 0) && this.state.player instanceof ComputerPlayer) {
      const newState = this.state.player.doMove(this.state);
      if (newState !== undefined) {
        this.updateState(newState);
      }
    }
  }

  /**
   * Handle a cell that was clicked.
   * @param {number} i id of clicked cell
   */
  onCellClicked = (i) => {
    if (this.state.player instanceof HumanPlayer) {
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

class GameState {
  static UNPLAYED_POS = ' ';
  static WINSETS = [[0,1,2], [3,4,5], [6,7,8], [0,4,8], [6,4,2], [0,3,6],[1,4,7],[2,5,8]];

  static create(player, otherPlayer) {
    return new GameState(new Array(9).fill(GameState.UNPLAYED_POS), player, otherPlayer);
  }

  /**
   * 
   * @param {array} positions 
   * @param {Player} player 
   * @param {Player} otherPlayer 
   */
  constructor(positions, player, otherPlayer, i) {
    this.positions = positions;
    this.player = player;
    this.otherPlayer = otherPlayer;
    this.i = i;
    this.movesLeft = this.getAvailableMoves().length;
  }

  isAvailable(i) {
    return this.positions[i] === GameState.UNPLAYED_POS;
  }

  isWon() {
    for (const s of GameState.WINSETS) {
      if (GameState.UNPLAYED_POS !== this.positions[s[0]]
            && this.positions[s[0]] === this.positions[1]
            && this.positions[s[0]] === this.positions[2])
        return true;
    }
    return false;
  }

  getAvailableMoves() {
    const moves = [];
    for (let i=0; i < this.positions.length; i++) {
      if (this.positions[i] === GameState.UNPLAYED_POS)
        moves.push(i);
    }
    return moves;
  }

  evaluate(maximizing) {
    const won = this.isWon();
    if (won && maximizing) {
      // this move would have been maximizing, but winning move was previous
      return -1; 
    } else if (won) {
      return 1;
    }
    return 0;
  }

  move(i) {
    const positions = Array.from(this.positions);
    positions[i] = this.player.id;
    return new GameState(
        positions, 
        this.otherPlayer, 
        this.player,
      );
  }
}


/**
 * Represents a board in the user interface context, responsible for drawing
 * grid, cells and listening for cell clicks, does not manage game state.
 */
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

let board, game;
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

  game = new TTTGame([
      //new SimpleComputerPlayer(PLAYER_O_ID, 'Simple Computer')
      new HardComputerPlayer(PLAYER_X_ID, 'Hard Computer'),
      new HumanPlayer(PLAYER_O_ID, 'Human')
    ]);
  game.registerStateListener(board.onNewCellStates);
  board.registerCellListener(game.onCellClicked);

  const menuDiv = createDiv();
  menuDiv.parent(mainDiv);
  menuDiv.class('ml2 mt1 w-30')
  const newGameBtn = createButton('new game')
  newGameBtn.parent(menuDiv);
  newGameBtn.mousePressed(() => {
    console.log('New game')
    game.newGame();
    board.drawGrid();
  });

  const label = createDiv();
  label.parent(menuDiv);

  game.registerStateListener((state, history) => {
    let prevMove = '';
    if (history.length > 0) {
      const prevState = history[history.length-1];
      if (prevState.isWon()) {
        label.html(`<div>${prevState.player.name} player ${prevState.player.id} wins!!!!!</div>`);
        return;
      }
      prevMove = `<div>${prevState.player.name} player ${prevState.player.id} =></div>`
    } else {
      prevMove = 'Starting new game!'
    }
    label.html(`
      <div>${prevMove}</div>
      <div>${state.player.name} player ${state.player.id}'s turn</div>
    `);
  });
  
  game.start();
}

function mousePressed() {
  board.onMousePressed(mouseX, mouseY);
}

function draw() {
  game.run();
}


// class GameState {
//   static UNPLAYED_POS = ' ';

//   static create(player, otherPlayer) {
//     return new GameState(new Array(9).fill(GameState.UNPLAYED_POS), player, otherPlayer);
//   }

//   constructor(positions, player, otherPlayer) {
//     this.positions = positions;
//     this.player = player;
//     this.otherPlayer = otherPlayer;
//     this.movesLeft = this.getAvailableMoves().length;
//   }

//   isWonState(a, b, c) {
//     return GameState.UNPLAYED_POS !== this.positions[a]
//       && this.positions[a] === this.positions[b]
//       && this.positions[a] === this.positions[c];
//   }

//   isWon() {
//     return this.isWonState(0, 1, 2) || this.isWonState(3, 4, 5) || this.isWonState(6, 7, 8)
//       || this.isWonState(0, 4, 8) || this.isWonState(6, 4, 2) || this.isWonState(0, 3, 6)
//       || this.isWonState(1, 4, 7) || this.isWonState(2, 5, 8);
//   }

//   getAvailableMoves() {
//     const moves = [];
//     for (let i=0; i < this.positions.length; i++) {
//       if (this.positions[i] === GameState.UNPLAYED_POS)
//         moves.push(i);
//     }
//     return moves;
//   }

//   move(pos) {
//     const positions = Array.from(this.positions);
//     positions[pos] = this.player.id;
//     return new GameState(
//         positions,
//         this.otherPlayer,
//         this.player
//       );
//   }
// }

// /**
//  * 
//  * @param {GameState} state 
//  */
// function miniMax(state, maximizing, player, depth) {
//   const won = state.isWon();
//   if (won || state.movesLeft === 0 || depth <= 0) {
//     if (won && state.player !== player) {
//       console.log('won other', JSON.stringify(state))
//       //return 1 + (depth >= 0 ? depth : 0);
//       return 1;
//     } else if (won) {
//       console.log('won player', JSON.stringify( state))
//       //return -1 - (depth >= 0 ? depth : 0);
//       return -1;
//     } else {
//       return 0;
//     }
//   }

//   const moves = state.getAvailableMoves();
//   let minmax = maximizing ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
//   if (maximizing) {
//     for (const move of moves) {
//       const val = miniMax(state.move(move), !maximizing, player, depth-1);
//       minmax = Math.max(minmax, val);
//     }
//   } else {
//     for (const move of moves) {
//       const val = miniMax(state.move(move), !maximizing, player, depth-1);
//       minmax = Math.min(minmax, val);
//     }
//   }
//   return minmax;
// }


// /**
//  * 
//  * @param {GameState} state 
//  */
// function play(state, player, depth) {
//   // x turn
//   if (state.movesLeft >= 7) {
//     for (const i of [4, 0, 2, 6, 8]) {
//       if (state.positions[i] === GameState.UNPLAYED_POS) {
//         state = state.move(i);
//         break;
//       }
//     }
//   }

//   // o turn
//   if (state.movesLeft >= 7) {
//     for (const i of [6, 8]) {
//       if (state.positions[i] === GameState.UNPLAYED_POS) {
//         state = state.move(i);
//         break;
//       }
//     }
//   }

//   // x turn
//   if (state.movesLeft >= 7) {
//     for (const i of [4, 0, 2, 6, 8]) {
//       if (state.positions[i] === GameState.UNPLAYED_POS) {
//         state = state.move(i);
//         break;
//       }
//     }
//   }

//   // 0 turn
//   let minVal = Number.POSITIVE_INFINITY;
//   let minMove;
//   for (const i of state.getAvailableMoves()) {
//     const val = miniMax(state, true, player, depth);
//     if (minVal > val) {
//       console.log('minimizing val', val);
//       minVal = val;
//       minMove = i;
//     }
//   }
//   state = state.move(minMove);

//   // x turn
//   let maxVal = Number.NEGATIVE_INFINITY;
//   let maxMove;
//   for (const i of state.getAvailableMoves()) {
//     const val = miniMax(state, false, player, depth);
//     if (maxVal < val) {
//       console.log('maximizing val', val);
//       maxVal = val;
//       maxMove = i;
//     }
//   }
//   state = state.move(maxMove);

//   // o turn
//   minVal = Number.POSITIVE_INFINITY;
//   for (const i of state.getAvailableMoves()) {
//     const val = miniMax(state, true, player, depth);
//     if (minVal > val) {
//       console.log('minimizing val', val);
//       minVal = val;
//       minMove = i;
//     }
//   }
//   state = state.move(minMove);
  
//   // x turn
//   maxVal = Number.NEGATIVE_INFINITY;
//   for (const i of state.getAvailableMoves()) {
//     const val = miniMax(state, false, player, depth);
//     if (maxVal < val) {
//       console.log('maximizing val', val);
//       maxVal = val;
//       maxMove = i;
//     }
//   }
//   state = state.move(maxMove);
//   console.log(JSON.stringify(state));
// }

// const player = {id: 'X'};
// const otherPlayer = {id: 'O'};
// const state = GameState.create(player, otherPlayer);

// play(state, player, 20);