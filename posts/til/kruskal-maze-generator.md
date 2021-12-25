---
title: Maze generation with Kruskal's algorithm
tags: algorithms, prims, fun
description: A quick look at how Kruskal's algorithm can be used to generate a perfect maze
---

## Maze generation with Kruskal's algorithm
A quick look at how [Kruskal's algorithm](https://en.wikipedia.org/wiki/Kruskal%27s_algorithm) can be used to generate a perfect maze.

<div class="center">
<div id="sketch" class="w-100"></div>
</div>

<script src="/static/js/p5.js"></script>
<script defer src="/static/js/kruskal-maze-generator.js"></script>

### How it works

Kruskal's algorithm is an algorithm for finding a [minimum spanning tree](https://en.wikipedia.org/wiki/Minimum_spanning_tree), it takes a set of vertices for input and finds the subset of edges that forms a tree that:

  * includes every vertex
  * and has a minimum sum of weights among all the edges

[Kruskal's algorithm](https://en.wikipedia.org/wiki/Kruskal%27s_algorithm) is very similar to [Prim's algorithm](/minimum-spanning-tree/), but with the following key steps:

 1. turn all vertices to individual [disjoint sets](https://en.wikipedia.org/wiki/Disjoint-set_data_structure)
 2. build list of all `traversable` edges (sorted or as priority queue)
 3. from list of `traversable` edges, get minimum edge and traverse
 4. if vertices of the traversed edge are not in same disjoint sets, connect them (i.e, we just expanded our tree). _Note: without this check we risk forming a cycle in the graph._
 5. repeat from step 3

### Kruskals algorithm

Let's demonstrate Kruskal's algorithm by using it to generate a perfect maze&mdash;a maze where all points are reachable. We'll use JavaScript, specifically [p5js](https://p5js.org) to help visualize what we are doing. I'll keep the user interface as simple as possible.

We setup our initial canvas and a basic grid to outline the cells that will make up our maze.
```javascript
function setup() {
  const canvasSize = 400;
  const gridSize = 8;                   // num of cells in grid
  const csize = canvasSize / gridSize;  // cell size
  
  /* draw initial canvas */
  createCanvas(canvasSize, canvasSize);
  background(160);  // gray
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

![initial grid](/static/images/kruskal-maze-generator/initial-grid.png)

We can think of our grid as a graph, and each cell within the grid as a vertex. 

```javascript
function setup() {
  ...

  const cellmid = Math.floor(csize / 2); // offset to help get midpoint of cell

  strokeWeight(10);
  stroke('lightblue')  
  for (let i=0; i < gridSize * gridSize; i++) {
    const r = Math.floor(i / gridSize);
    const c = Math.floor(i % gridSize);
    const x = (c * csize) + cellmid;
    const y = (r * csize) + cellmid;
    point(x, y);
  }
}
```

![cells to vertices](/static/images/kruskal-maze-generator/cells-vertex.png)

The first step of Kruskal's algorithm is to convert all the vertices to individual [disjoint sets](https://en.wikipedia.org/wiki/Disjoint-set_data_structure). We'll do that by creating a custom `VertexDisjointSet` class to hold a vertex's (e.g, cell) coordinates while supporting disjoint set operations. Additionally we will add an `Edge` class to represent the relation between two vertex.

```javascript
// define outside of setup function
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

/** A connection between two vertices */
class Edge {
  constructor(v1, v2) {
    this.v1 = v1;
    this.v2 = v2;
  }
}
```

Next we convert the vertices to the disjoint sets, and store them in the collection `vertices`. It's also a good time to build all the edges as we're initializing our vertices.

```javascript
function setup() {
  ...
  const cellmid = Math.floor(csize / 2); // offset to help get midpoint of cell
  const vertices = new Array(gridSize * gridSize);  // <-- holds our vertices
  const edges = [];
  
  strokeWeight(10);
  stroke('lightblue')
  for (let i=0; i < vertices.length; i++) {
    const r = Math.floor(i / gridSize);
    const c = Math.floor(i % gridSize);
    const x = (c * csize) + cellmid;
    const y = (r * csize) + cellmid;
    vertices[i] = new VertexDisjointSet(x, y);
    point(x, y);
    if (r > 0) {
      edges.push(new Edge(vertices[i], vertices[i-gridSize]));
    }
    if (c > 0) {
      edges.push(new Edge(vertices[i], vertices[i-1]));
    }
  }
}
```

To keep edge generation simple, we use the following formula, for every vertex:
 * we create an edge to the vertex above (e.g, row-1)
 * we create an edge to the vertex to the left (e.g, col-1)
 * except for the vertices in the top row, and first column

Let's visualize what we have so far, vertices and their edges.

```javascript
function setup() {
  ...

    ...
    vertices[i] = new VertexDisjointSet(x, y);
    point(x, y);
    if (r > 0) {
      edges.push(new Edge(vertices[i], vertices[i-gridSize]));
      line(x, y, x, y-csize); // add vertical edge line
    }
    if (c > 0) {
      edges.push(new Edge(vertices[i], vertices[i-1]));
      line(x, y, x-csize, y); // add horizontal edge line
    }
  }
}
```

![visualize edges](/static/images/kruskal-maze-generator/visualize-edges.png)

We started with a simple grid, now we have a graph with vertices and edges. Finally, we're ready to start building out the minimum spanning tree that will form our maze path.

The next part of the algorithm calls for traversing the minimal edges. At this point though our edges are not weighted and the distance between each vertex is the same, so we will introduce a random artifical weight to each edge&mdash;this will give the tree (i.e, our maze path) a more naturally non-uniform shape.

```javascript
// update the Edge class
class Edge {
  constructor(v1, v2) {
    this.v1 = v1;
    this.v2 = v2;
    this.weight = Math.random();
  }
}
```

Then we need to sort it so that we are always working with the minimal edge, we'll do descending order and just `pop()` off the end.

```javascript
function setup() {
  ...

  edges.sort((e1, e2) => {
    if (e1.weight === e2.weight) return 0;
    else if (e1.weight < e2.weight) return 1;
    return -1;
  });
}
```

Now for each edge we traverse, if it's vertices are not connected, we connect them, slowly expaning our spanning tree. 

```javascript
function setup() {
  ...

  edges.sort(.....)

  while (edges.length > 0) {
    const edge = edges.pop();
    const {v1, v2} = edge;
    if (v1.find(v1) === v2.find(v2))
      continue;
    v1.union(v2);
  }
}
```
Again to visualize, let's add a purple line for each connection.

```javascript
function setup() {
  ...

  edges.sort(.....)

  stroke('purple');  // <-- draw connection as purple
  while (edges.length > 0) {
    const edge = edges.pop();
    const {v1, v2} = edge;
    if (v1.find(v1) === v2.find(v2))
      continue;
    v1.union(v2);
    line(v1.x, v1.y, v2.x, v2.y); // <-- draw connection
  }
}
```

![traversing edges](/static/images/kruskal-maze-generator/traversing-edges.png)

The purple lines represent the minimum spanning tree (i.e, our maze path), the white lines with no purple lines crossing represent the walls. Let's turn off the original edge lines that are not connect (light blue lines), drawing only the connected edges (purple lines) for a better look at the spanning tree.

```javascript
function setup() {
  ...

    ...
    vertices[i] = new VertexDisjointSet(x, y);
    point(x, y);
    if (r > 0) {
      edges.push(new Edge(vertices[i], vertices[i-gridSize]));
      // line(x, y, x, y-csize); 
    }
    if (c > 0) {
      edges.push(new Edge(vertices[i], vertices[i-1]));
      // line(x, y, x-csize, y);
    }
  }
}
```

![connected edges only](/static/images/kruskal-maze-generator/connected-edges-only.png)

The purple lines represent the minimum spanning tree (e.g, our maze path). If you look closely, you can see the tree spans to every vertex, thus every point on the corresponding maze path is access&mdash;a perfect maze.

We've just implemented Kruskal's algorithm, cool right? To finish off the maze generation, we simply remove all the vertex and edge lines and clear out the grid lines where ever there are connected vertices.

```javascript
function setup() {
  ...

  stroke(160); // same as background color
  while (edges.length > 0) {
    const edge = edges.pop();
    const {v1, v2} = edge;
    if (v1.find(v1) === v2.find(v2))
      continue;
    v1.union(v2);
    if (v1.y == v2.y) {
      const x = v2.x + cellmid;
      const yoffset = (v2.y + cellmid-2) >= canvasSize ? 0 : 2;
      line(x, v2.y-cellmid+2, 
           x, v2.y+cellmid-yoffset);
    }
    if (v1.x == v2.x) {
      const y = v2.y + cellmid;
      const xoffset = (v2.x + cellmid-2) >= canvasSize ? 0 : 2;
      line(v2.x-cellmid+2, y, 
           v2.x+cellmid-xoffset, y);
    }
  }  
}
```

With a little tweaking of the offsets for x and y, we end up with a maze.

![maze with walls](/static/images/kruskal-maze-generator/maze-with-walls.png)

Here's it scaled out with size 20.

```javascript
function setup() {
  const canvasSize = 400;
  const gridSize = 20;                   // num of cells in grid
  ...
}
```

![maze scaled out](/static/images/kruskal-maze-generator/maze-scaled-out.png)

Now you know how to generate mazes with Kruskal's algorithm! Check out the p5js online editor to [continue playing with the code](https://editor.p5js.org/ikumen/sketches/l6UZW9uCy) we just walked through. 


Source for [this post](https://github.com/ikumen/today-i-learned/blob/main/posts/til/kruskal-maze-generator.md) and [demo above](https://github.com/ikumen/today-i-learned/blob/main/src/main/resources/META-INF/resources/static/js/kruskal-maze-generator.js) can be found [on GitHub](https://github.com/ikumen/today-i-learned).