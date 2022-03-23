---
title: Minimum Spanning Tree using Prim's Algorithm
weight: 97
tags: prims, algorithms, mst, p5js
description: An example of a minimum spanning tree using Prim's algorithm
---

# Minimum Spanning Tree using Prim's Algorithm

An example of a [minimum spanning tree](https://en.wikipedia.org/wiki/Minimum_spanning_tree) using [Prim's algorithm](https://en.wikipedia.org/wiki/Prim%27s_algorithm). Just click on the yellow canvas to generate vertices and the algorithm will generate the edges of the spanning tree, optimizing for minimum edge distances.

<div class="center">
<div id="sketch" class="w-100"></div>
</div>

<script src="/static/js/p5.js"></script>
<script src="/static/js/minimum-spanning-tree.js"></script>

## How it works

Prim's algorithm takes a set of vertices (e.g. graph) as input and simply returns a subset of edges between the vertices that forms a tree that:

* includes every vertex
* the sum of edge weights/distances is minimal

[Prim's algorithm](https://en.wikipedia.org/wiki/Prim%27s_algorithm) is very similar to [Kruskal's algorithm](/til/maze-generation/), with the following key steps:

 1. select a vertex
 2. find all edges from this vertex and add to list of `traversable` edges
 3. from `traversable` edges, get minimum edge (using min heap) and traverse to next vertex if not already `visited`
 4. repeat from step 1
 

Note: `traversable` needs to be sorted every time we visit a vertex (step 2) and add new edges. To optimize this, a [min heap](https://github.com/ikumen/today-i-learned/blob/main/src/main/java/com/gnoht/til/datastructures/Heap.java) (e.g. priority queue) is a good data structure to use here.


Here's the algorithm in pseudocode.

```javascript
class Vertex {
   x, y
}

class Edge {
   Vertex v1
   Vertex v2
   priority = dist(v1, v2) // calculate dist between vertices and use as priority
}

vertices = [.....] // list of vertex
traversable = []   // min heap of edges to traverse
visited = []       // already visited vertices
v1 = vertices[0]   // randomly select initial vertex

while visited.length < vertices.length
   // visit vertex and find it's edges
   visited.add(v1)
   for v2 of vertices
      if v2 not in visited
         traversable.add(Edge(v1, v2))

   // select next minimal edge, and traverse
   while traversable not empty
      edge = traversable.pop()
      if edge.v2 not in visited
         v1 = edge.v2
         break
```

The demo [source code](https://github.com/ikumen/today-i-learned/blob/main/src/main/resources/META-INF/resources/static/js/minimum-spanning-tree.js).