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
function drawGeneration({cells, population, year}, genLabel, popLabel) {
  const rows = cells.length;
  const cols = cells[0].length;
  
  for (let r=0; r < rows; r++) {
    for (let c=0; c < cols; c++) {
      if (cells[r][c])
        square(c * 10, r * 10, 10);
    }
  }
  
  genLabel.html(" &nbsp; Generation: " + year);
  popLabel.html(" &nbsp; Population: " + population)
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
  initGeneration(sparseness=0.4) {
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

let game, generationLabel, populationLabel;
const sketch = sketchHelper('sketch');
const ht = Math.floor((sketch.height - 120) / 10) * 10;
const wd = Math.round(sketch.width / 10) * 10;

function setup() {
  let fr = 10;
  createCanvas(wd, ht).parent(sketch.get())  
  textSize(5);
  frameRate(fr)
  stroke(255)
  fill(0);

  function adjustFrameRate(inc) {
    if ((inc < 0 && fr > 1) || (inc > 0 && fr < 20)) {
      fr += inc;
      speedLabel.html("Speed: " + fr + " &nbsp;")
      frameRate(fr);
    }
  }

  game = new GameOfLife(wd, ht);
  
  speedLabel = createSpan("Speed: " + fr + " &nbsp;");
  speedLabel.parent(sketch.get());

  slowBtn = createButton("slower")
  slowBtn.parent(sketch.get());
  slowBtn.mousePressed(() => adjustFrameRate(-1));
  createSpan(" ").parent(sketch.get());
  
  fastBtn = createButton("faster");
  fastBtn.parent(sketch.get());
  fastBtn.mousePressed(() => adjustFrameRate(1));
  
  generationLabel = createSpan(" &nbsp; Generation: ")
  generationLabel.parent(sketch.get());
  populationLabel = createSpan(" &nbsp; Population: ")
  populationLabel.parent(sketch.get());
}

function draw() {
  background(204, 229, 255)
  drawGeneration(game.evolve(), generationLabel, populationLabel);
}
