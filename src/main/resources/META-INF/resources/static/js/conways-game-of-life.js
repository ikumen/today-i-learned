/* Returns the neighbors for the given cell */
function getNeighbors(row, col, cells) {
  const n = row > 0 ? row - 1 : cells.length - 1;
  const s = row == cells.length -1 ? 0 : row + 1;
  const e = col == cells[0].length - 1 ? 0 : col + 1;
  const w = col > 0 ? col - 1 : cells[0].length - 1;
  return [
    [n, w], [n, col], [n, e], [row, e], 
    [s, e], [s, col], [s, w], [row, w]
  ];
}

/* Returns number of live neighbors for the given cell */
function getLiveNeighbors(row, col, cells) {
  return getNeighbors(row, col, cells)
    .reduce((live, [r, c]) => cells[r][c] ? live + 1 : live, 0);
}

/* Returns a matrix of empty cells for a generation */
function createMatrix(rows, cols, val=false) {
  return new Array(rows).fill(false)
    .map(() => new Array(cols).fill(false));
}

/**
 * Given a generation, draw it on the canvas.
 */
function drawGeneration({cells, population, year}) {
  const rows = cells.length;
  const cols = cells[0].length;
  
  for (let r=0; r < rows; r++) {
    for (let c=0; c < cols; c++) {
      if (cells[r][c])
        square(c * 10, r * 10, 10);
    }
  }
    
  line(0, (rows * 10) + 1, cols * 10, (rows * 10) + 3); 
  text('Generation: ' + year, 0, (rows * 10) + 22);
  text('Population: ' + population, 0, (rows * 10) + 42);
  
}

/**
 * Simple class to hold game state, specifically a "generation"
 * and helper method to evolve from one generation to next.
 */
class GameOfLife {

  constructor(width, height) {
    this.rows = height / 10;
    this.cols = width / 10;
    this.generation = this.initGeneration();
  }
  
  /**
   * Creates an initial generation.
   */
  initGeneration(sparseness=0.3) {
    const cells = createMatrix(this.rows, this.cols);
    let population = 0;
    for (const row of cells) {
      for (let i=0; i < row.length; i++) {
        row[i] = random() < sparseness;
        if (row[i]) population++;
      }
    }

    return {
      cells, 
      population, 
      year: 1
    };
  }

  /**
   * Play the game of life, evolve to next generation and return it 
   */
  evolve() { 
    const { cells, year } = this.generation;
    const nextCells = createMatrix(this.rows, this.cols);
    
    let population = 0;
    for (let r=0; r < this.rows; r++) {
      for (let c=0; c < this.cols; c++) {
        const liveNeighbors = getLiveNeighbors(r, c, cells);
        nextCells[r][c] = (cells[r][c] 
           ? (liveNeighbors == 2 || liveNeighbors == 3) 
           : (liveNeighbors == 3));
        if (nextCells[r][c]) 
          population++;
      }
    }
    
    this.generation = {
      cells: nextCells, 
      population, 
      year: year + 1
    };
    
    return this.generation;
  }  
}

let game;

function setup() {
  const canvasEl = document.getElementById("canvas");
  const canvasStyle = getComputedStyle(canvasEl);
  const ht = (Math.floor(windowHeight / 10) * 10) - 100;
  const wd = Math.round((canvasEl.clientWidth - parseFloat(canvasStyle.paddingLeft) - parseFloat(canvasStyle.paddingLeft)) / 10) * 10;
  createCanvas(wd, ht).parent(canvasEl)  
  textSize(18);
  frameRate(8)
  stroke(255)
  fill(0);

  game = new GameOfLife(wd, ht-50);
}

function draw() {
  background(204, 229, 255)
  drawGeneration(game.evolve());
}
