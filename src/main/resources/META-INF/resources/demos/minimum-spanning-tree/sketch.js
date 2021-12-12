/**
 * Min heap implementation that maintains the minimum edge dist at 
 * the top of the heap.
 */
class MinEdgeHeap {
  constructor() {
    this.edges = [];
  }

  swap(i, k) {
    const tmp = this.edges[i];
    this.edges[i] = this.edges[k];
    this.edges[k] = tmp;
  }

  shiftUp(i) {
    if (i <= 0) 
      return;
    const p = Math.floor((i - 1) / 2);
    if (this.edges[i].dist < this.edges[p].dist) {
      this.swap(i, p);
      this.shiftUp(p);
    }  
  }

  shiftDown(i) {
    const left = (i * 2) + 1;
    const right = left + 1;
    let k = i; // holds the items index with largest value

    if (left < this.edges.length && this.edges[left].dist < this.edges[k].dist)
      k = left;
    if (right < this.edges.length && this.edges[right].dist < this.edges[k].dist)
      k = right;
    if (k != i) {
      this.swap(i, k);
      this.shiftDown(k);
    }
  }

  push(edge) {
    this.edges.push(edge);
    this.shiftUp(this.edges.length-1);
  }

  pop() {
    const edge = this.edges[0];
    const last = this.edges.pop();
    if (this.edges.length > 0) {
      this.edges[0] = last; // move top and shift down to correct position
      this.shiftDown(0);
    }
    return edge;
  }

  isEmpty() {
    return this.edges.length == 0;
  }
}

/**
 * Represents an edge in the context of a graph, the connection
 * between two vertices.
 */
class Edge {
  constructor(v1, v2) {
    this.v1 = v1;
    this.v2 = v2;
    this.dist = dist(v1.x, v1.y, v2.x, v2.y);
  }
}

/**
 * Represents a point/node in a graph.
 */
class Vertex {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

/**
 * A minimum spanning tree, containing the vertices and edges spanning
 * a minimum distance.
 */
class MST {
  constructor() {
    this.vertices = [];
    this.edges = [];
  }

  clear() {
    this.edges = [];
    this.vertices = [];
  }

  /**
   * Every time a new vertex is added, we regenerate the edges based
   * on the updated list of vertices.
   */
  addVertex(x, y) {
    this.vertices.push(new Vertex(x, y));
    this.generateMSTVertices();
  }

  /**
   * Generate the edges with minimum distances for this MST.
   */
  generateMSTVertices() {
    const heap = new MinEdgeHeap();
    const visited = new Set();
    const edges = [];
    let v1 = this.vertices[0];
    while (visited.size < this.vertices.length) {
      // visit a vertex and add it's edges to unvisited vertices to our heap
      visited.add(v1);
      for (let v2 of this.vertices) {
        if (!visited.has(v2)) {
          heap.push(new Edge(v1, v2));
        }
      }
      // find the next vertex to visit from an already visited vertex
      // using the edges we've stored so far, the heap will give us the
      // next minimum edge to visit.
      while (!heap.isEmpty()) {
        const edge = heap.pop();
        if (!visited.has(edge.v2)) {
          edges.push(edge);
          v1 = edge.v2;
          break;
        }
      }
    }

    this.edges = edges;
  }
}

const mst = new MST();
let ht, wd;
function setup() {
  const canvasEl = document.getElementById("canvas");
  const canvasStyle = getComputedStyle(canvasEl);
  ht = windowHeight - 200;
  wd = canvasEl.clientWidth - parseFloat(canvasStyle.paddingLeft) - parseFloat(canvasStyle.paddingLeft) - 100;
  createCanvas(wd, ht).parent(canvasEl)  

  frameRate(10);
  fill(0)
  stroke(0)
  createButton("Clear tree")
    .mousePressed(() => {
      mst.clear();
    })
}

function mousePressed() {
  if (mouseX < wd && mouseY < ht) {
    mst.addVertex(mouseX, mouseY)
  }
}

function draw() {
  background(255, 204, 0)
  for (let vertex of mst.vertices) {
    ellipse(vertex.x, vertex.y, 10, 10);
  }
  for (let edge of mst.edges) {
    line(edge.v1.x, edge.v1.y, edge.v2.x, edge.v2.y);
  }
}