class TTTGame {
  constructor() {
    this.turn = 0; // X-even, O-odd
    this.cells = this.newCells();
  }

  takeTurn() {

  }

  newCells() {
    return [0,0,0, 0,0,0, 0,0,0];
  }
}

class GameState {
  EMPTY = -1;
  constructor(cells, player) {
    this.cells = cells;
    this.player = player;
  }

  /**
   * Return true if in winning state.
   * 012 345 678 048 642 036 147 258
   */
  isWon() {
    return this.isWonState(0, 1, 2) || this.isWonState(3, 4, 5) || this.isWonState(6, 7, 8)
      || this.isWonState(0, 4, 8) || this.isWonState(6, 4, 2) || this.isWonState(0, 3, 6)
      || this.isWonState(1, 4, 7) || this.isWonState(2, 5, 8);
  }

  isWonState(i, j, k) {
    return this.EMPTY != this.cells[i] 
      && this.cells[i] == this.cells[j] 
      && this.cells[i] == this.cells[k];
  }

  isTie() {

  }

  isGameOver() {

  }
}

/**
 * Represents a board in the user interface context, does not handle 
 * any game state. Handles drawing, updating and responding to user 
 * clicks on any of the board's cells.
 */
class Board {
  constructor(size, x, y, onCellClick) {
    this.size = size;
    this.x = x;
    this.y = y;
    this.cellSize = Math.floor(size / 3); 
    this.fntSize = this.cellSize * .9;
    this.cellYOffset = this.fntSize * .9;
    this.cellXOffset = this.fntSize * .2;
    this.cellCoords = new Array(9);
    for (let i=0; i < this.cellCoords.length; i++) {
      this.cellCoords[i] = {
        x: x + (this.cellSize * (i % 3)),
        y: y + (this.cellSize * Math.floor(i / 3))
      }
    }
    this.onCellClick = onCellClick;
  }

  display() {
    this.cellCoords.forEach(({x, y}) => rect(x, y, this.cellSize));
    return this;
  }

  markCell(s, i) {
    fill(0)
    const tmp = textSize();
    textSize(this.fntSize);
    text(s, this.cellCoords[i].x + this.cellXOffset, 
      this.cellCoords[i].y + this.cellYOffset);
    // reset fill and textsize
    fill(255); 
    textSize(tmp);
    return this;
  }

  onPressed(mx, my) {
    for (let i=0; i < this.cellCoords.length; i++) {
      const {x, y} = this.cellCoords[i];
      if (mx >= x && mx <= (x + this.cellSize) &&
            my >= y && my <= (y + this.cellSize)) {
        this.onCellClick(i);
        return i;      
      }
    }
  }
}


let board, div;
function setup() {
  const sketch = sketchHelper('sketch');
  const ht = Math.max(340, sketch.height - 100);
  const wd = Math.max(300, sketch.width - 300);
  
  const game = new TTTGame();
  const boardSize = ht - 20;
  const boardX = (wd - boardSize) / 2;
  const boardY = 10;
  div = createDiv().parent(sketch.get());
  createCanvas(wd, ht).parent(div);  
  frameRate(10);
  fill(0)
  stroke(0)
  background("gray");

  fill(255);
  board = new Board(boardSize, boardX, boardY, (i) => console.log(`cell ${i} clicked yup`))
    .display()
    .markCell('A', 0)
    .markCell('B', 1)
    .markCell('C', 2)
    .markCell('D', 3)
    .markCell('E', 4);

}

function mousePressed() {
  board.onPressed(mouseX, mouseY)
}

function draw() {

}