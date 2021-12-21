---
title: Maze generation with Kruskal's algorithm
tags: algorithms, prims, fun
description: A quick look at how Kruskal's algorithm can be used to generate a perfect maze
---

## Minimum spanning tree with Kruskals alogrithm
A quick look at how [Kruskal's algorithm](https://en.wikipedia.org/wiki/Kruskal%27s_algorithm) can be used to generate a perfect maze.

<div class="center">
<div id="sketch" class="w-100"></div>
</div>

<script src="/static/js/p5.js"></script>
<script defer src="/static/js/kruskal-maze-generator.js"></script>

### How it works

Kruskal's algorithm is an algorithm for finding a minimum spanning tree, it takes a set of vertices for input and finds the subset of edges that forms a tree that:

  * includes every vertex
  * and has a minimum sum of weights among all the edges

[Kruskal's algorithm](https://en.wikipedia.org/wiki/Kruskal%27s_algorithm) is very similar to [Prim's algorithm](/minimum-spanning-tree/), but with the following key steps:

 1. turn all vertices to individual disjoint sets
 2. build list of all `traversable` edges (sorted asc list or min heap)
 3. from `traversable` edges, get minimum edge and traverse
 4. if vertices of the traversed edge are not in same [disjoint set](https://en.wikipedia.org/wiki/Disjoint-set_data_structure), connect them (i.e, we just expanded our tree). _Note: without this check we risk forming a cycle in the graph._
 5. repeat from step 3

### Kruskals algorithm

Let demonstrate Kruskal's algorithm by using it to generate a maze. We'll use JavaScript, specifically [p5js](https://p5js.org) to help visualize what we are doing. I'll keep the UI as simple as possible.

We setup our initial canvas and a basic grid to outline the cells that will make up our maze.
```javascript
function setup() {
  const canvasSize = 400;
  const gridSize = 8;                   // num of cells in grid
  const csize = canvasSize / gridSize;  // cell size
  
  /* draw initial canvas */
  createCanvas(canvasSize, canvasSize);
  background(235);  // gray
  strokeWeight(2);  // width of lines
  stroke(255);      // white lines
    
  /* draw grid, outline each cell */
  for (let i=0; i <= gridSize; i++) {
    const k = i * csize;
    line(k, 0, k, canvasSize);
    line(0, k, canvasSize, k);
  }
}
```

Should produce the following.

![initial grid](/static/images/kruskal-maze-generator/initial-grid.png)

We can think of our grid as a graph, and each cell within the grid as a vertex. 

```javascript
function setup() {
  ...

  const cellmid = Math.floor(csize / 2); // offset to help get midpoint of cell

  stroke('lightblue')  
  for (let i=0; i < gridSize * gridSize; i++) {
    const r = Math.floor(i / gridSize);
    const c = Math.floor(i % gridSize);
    const x = (c * csize) + cellmid;
    const y = (r * csize) + cellmid;
    strokeWeight(10);
    point(x, y);
  }
}
```

![initial grid](/static/images/kruskal-maze-generator/cells-vertex.png)

At this point we can start to implement Kruskal's algorithm. The first step is to convert all the vertices to individual [disjoint sets](https://en.wikipedia.org/wiki/Disjoint-set_data_structure). We'll do that by creating a custom class to hold a cell's coordinates while support disjoint set operations. We might as well create a class to represent our edges too.

```javascript
class VertexDisjointSet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 1;
    this.parent = this;
  }
  /** Find the parent disjoint set of given set */
  find(vds) {
    if (vds.parent != vds) 
      vds.parent = this.find(vds.parent);
    return vds.parent;
  }
  
  /** Connect other set with this set */ 
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
  }
}
```

When should I use [Prim's vs Kruskal's](https://stackoverflow.com/questions/1195872/when-should-i-use-kruskal-as-opposed-to-prim-and-vice-versa)?.
