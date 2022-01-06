---
title: Conway's Game of Life 
tags: p5js, game
description: An implementation of Conway's Game of Life
---

# Conway's Game of Life

An implementation of [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) using the [p5js](//p5js.org).

<div class="center">
<div id="sketch" class="w-100"></div>
</div>

<script src="/static/js/p5.js"></script>
<script defer src="/static/js/conways-game-of-life.js"></script>

## How it works

Basic implementation with support for [periodic boundary conditions](https://en.wikipedia.org/wiki/Periodic_boundary_conditions). 

```javascript
/* Returns the neighbors for the given cell, wrapping around to 
opposite side if at boundary */
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
```

See [source code](https://github.com/ikumen/today-i-learned/blob/main/src/main/resources/META-INF/resources/static/js/conways-game-of-life.js).


