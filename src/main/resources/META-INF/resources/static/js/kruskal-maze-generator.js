class VertexDisjointSet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 1;
    this.parent = this;
  }
  
  find(vds) {
    if (vds.parent != vds) 
      vds.parent = this.find(vds.parent);
    return vds.parent;
  }
  
  union(other) {
    const ourParent = this.find(this);
    const theirParent = this.find(other);
    if (ourParent !== theirParent) {
      if (ourParent.size > theirParent.size) {
        theirParent.parent = ourParent;
        ourParent.size += theirParent.size;
      } else {
        ourParent.parent = theirParent;
        theirParent.size += ourParent.size;
      }
    }
  }
}

class Edge {
  constructor(v1, v2) {
    this.v1 = v1;
    this.v2 = v2;
    this.weight = Math.random();
  }
}

const sketch = sketchHelper('sketch');
const cellSize = 20;
const borderWidth = 2;
const mazeHt = 300;
const mazeWd = Math.floor(Math.max(300, sketch.width) / cellSize) * cellSize;
const mazeRows = Math.floor(mazeHt / cellSize);
const mazeCols = Math.floor(mazeWd / cellSize);
const cellMid = Math.floor(cellSize / 2);
const singleCell = cellSize - (borderWidth * 2);
const doubleCell = (cellSize * 2) - (borderWidth * 2);

let vertices = new Array(mazeRows * mazeCols);
let edges = [];

function setup() {  
  /* draw initial canvas */
  createCanvas(mazeWd, mazeHt).parent(sketch.get());
  background(255);  // gray
  strokeWeight(borderWidth);  // width of lines  
  stroke(80);

  let fr = 15;
  frameRate(fr);

  function adjustFrameRate(inc) {
    if ((inc < 0 && fr > 1) || (inc > 0 && fr < 30)) {
      fr += inc;
      speedLabel.html("Speed: " + fr + " &nbsp;")
      frameRate(fr);
    }
  }

  // labels + controls
  controls = createDiv();
  controls.parent(sketch.get());
  speedLabel = createSpan("Speed: " + fr + " &nbsp;")
  speedLabel.parent(controls);
  
  slowBtn = createButton("slower")
  slowBtn.parent(controls);
  slowBtn.mousePressed(() => adjustFrameRate(-1))
  createSpan(' ').parent(controls);
  fastBtn = createButton("faster")
  fastBtn.parent(controls)
  fastBtn.mousePressed(() => adjustFrameRate(1))

  /* draw grid, outline each cell */
  for (let i=0; i <= mazeRows; i++) {
    const y = i * cellSize;
    line(0, y, mazeWd, y);
  }
  for (let i=0; i <= mazeCols; i++) {
    const x = i * cellSize;
    line(x, 0, x, mazeHt);
  }

  // Convert cells to vertex/disjoint set and add edges
  for (let i=0; i < vertices.length; i++) {
    const r = Math.floor(i / mazeCols);
    const c = Math.floor(i % mazeCols);
    const x = c * cellSize;
    const y = r * cellSize;
    vertices[i] = new VertexDisjointSet(x, y);
    if (r > 0) edges.push(new Edge(vertices[i], vertices[i-mazeCols]));
    if (c > 0) edges.push(new Edge(vertices[i], vertices[i-1]));
  }
  
  edges.sort((e1, e2) => {
    if (e1.weight === e2.weight) return 0;
    else if (e1.weight < e2.weight) return 1;
    return -1
  });
  
  stroke('white');
  fill('white')
}

const grayScale = [255, 230, 205, 180, 155, 130, 105, 80, 55];
let edgesToClear = new Array(grayScale.length);

function fadeEdge({v1, v2}, lvl) {
  stroke(grayScale[lvl]);
  fill(grayScale[lvl]);
  if (v1.x === v2.x) {
    rect(v2.x+borderWidth, v2.y+borderWidth, singleCell, doubleCell);
  } else {
    rect(v2.x+borderWidth, v2.y+borderWidth, doubleCell, singleCell);
  }
}

function fadeAndClearEdges() {
  const _edges = new Array();
  for (let i=0; i < edgesToClear.length; i++) {
    const toClear = edgesToClear[i];
    if (toClear == null) 
      continue;
    toClear.lvl -= 1;
    fadeEdge(toClear.edge, toClear.lvl);
    if (toClear.lvl > 0)
      _edges.push(toClear);
  }
  edgesToClear = _edges;
}

function generateMaze(edges) {
  while (edges.length > 0) {
    const edge = edges.pop();
    const {v1, v2} = edge;
    if (v1.find(v1) === v2.find(v2))
      continue;
    v1.union(v2);
    edgesToClear.push({edge: edge, lvl: 9});
    break;
  }

  fadeAndClearEdges();
}

function draw() {
  generateMaze(edges);
}