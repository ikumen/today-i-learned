---
title: Tic-Tac-Toe with Minimax Algoritm
tags: minimax, algorithms, game
description: An introduction to the minimax algorithm with tic-tac-toe
---

# Tic-Tac-Toe with Minimax Algorithm

An introduction to the [minimax algorithm](https://en.wikipedia.org/wiki/Minimax) with tic-tac-toe.

<div class="center">
<div id="sketch" class="w-100"></div>
</div>

<script src="/static/js/p5.js"></script>
<script defer src="/static/js/ttt-with-minimax.js"></script> 

## How it works

The minimax algorithm is a decision rule algorithm used for minimizing potential loss. It has applications in various fields, including game theory, like the tic-tac-toe demo above. Tic-tac-toe has a relatively small search space of possible moves and outcomes, so it will be easy to follow how minimax in tic-tac-toe and see how it works. 

Suppose we're in the middle of a tic-tac-toe game with the following game state, we're player `x` and it's our turn. 

```bash   
x o x     # assume cells  0 1 2
o o _     # are           3 4 5
_ x _     # numbered      6 7 8
```

To figure out our next move using an algorithm like minimax, we simply simulate every turn, alternating between being `x` and our opponent `o`. The name minimax comes from the fact that we want to maximize on our turn, while minimizing when we simulate our opponent's turn. Let' see how that would play out for each turn. 

To begin, we can play 5, 6 or 8. 

#### Position 5 path
Let's take 5 and see if it's a good move. 
* after we play 5, we switch and simulate being `o`, making the best possible move for `o`, who is left with positions 6 and 8
  - if `o` takes 6
    - the next turn we would be left with 8 and we win the game 
  - if `o` takes 8
    - the next turn we would be left with 6 which leads to a tie
  - so `o` would take 8 to minimize our chances of winning
* ultimately if we take 5, and `o` played optimally, we get a tie

```python
current    x turn        o turn       x turn
-------    --------      --------     ---------
            x o x        x o x        x o x
        +-- o o x <--+-- o o x <----- o o x (x wins)
        |   _ x _    |   o x _        o x x
        |            |
        |            |   x o x        x o x
        |            +-- o o x <----- o o x (tie) 
        |                _ x o        x x o
        |
        |
x o x   |   
o o _ <-+
_ x _      
        
```

#### Position 6 path
Alternatively if we 6 to start.
* `o` is left with 5 and 8 to play
  - if `o` takes 5, it wins
  - if `o` takes 8, 
    - next turn we would take 5 and cause a tie
  - so `o` would take 5 to minimize our chances of winning (by winning itself)
* ultimately if we take 6, `o` would optimally play 5 and win

```python
current    x turn        o turn       x turn
-------    --------      --------     ---------
            #x o x        x o x        x o x
        +-- #o o x <--+-- o o x <----- o o x (x wins)
        |   #_ x _    |   o x _        o x x
        |   #         |
        |   #         |   x o x        x o x
        |   #         +-- o o x <----- o o x (tie) 
        |   #             _ x o        x x o
        |
        |
x o x   |   x o x        x o x 
o o _ <-+-- o o _ <--+-- o o o (o wins) 
_ x _       x x _    |   x x _
                     |
                     |   x o x        x o x
                     +-- o o _ <----- o o x (tie)
                        x x o        x x o
```

#### Position 8 path
Finally, if we start by taking 8.
* that would leave `o` with 5 and 6
  - if `o` takes 5, it wins
  - if `o` takes 6
    - then we would be left with 5 and win
  - so `o` would play optimally and take 5
* ultimately if we take 8 to start, `o` would optimally take 5 and win

```python
current    x turn        o turn       x turn
-------    --------      --------     ---------
            #x o x        x o x        x o x
        +-- #o o x <--+-- o o x <----- o o x (x wins)
        |   #_ x _    |   o x _        o x x
        |   #         |
        |   #         |   x o x        x o x
        |   #         +-- o o x <----- o o x (tie) 
        |   #             _ x o        x x o
        |
        |
x o x   |   #x o x        x o x 
o o _ <-+-- #o o _ <--+-- o o o (o wins) 
_ x _   |   #x x _    |   x x _
        |   #         |
        |   #         |   x o x        x o x
        |   #         +-- o o _ <----- o o x (tie)
        |   #            x x o        x x o
        |    
        |        
        |   x o x        x o x        
        +-- o o _ <--+-- o o o (o wins)
            _ x x    |   _ x x        
                     |
                     |   x o x        x o x
                     +-- o o _ <----- o o x (x wins)
                         o x x        o x x
```


So the best move for us (`x`) would be 5, even though it's not a winning move, it would guarantee a tie. 

At this point, you're probably wondering how each simulated turn would pass maximizing or minimizing information back to the originating caller. We can use a simple rule that returns positive values when maximizing, and negative values when minimizing (simulating our opponent), and zero for ties. Then we just need to keep track of each turn, either maximizing or minimizing. 

Here's the updated turns showing how a maximizing, minimizing or zero value can be used.

```python
current    x turn         o turn         x turn
-------    --------       --------       ---------
            x o x  (0)    x o x     (1)  x o x
        +-- o o x <---+-- o o x <------- o o x (x wins)
        |   _ x _     |   o x _          o x x
        |             |
        |             |   x o x          x o x
        |             +-- o o x <------- o o x (tie) 
        |                 _ x o          x x o
        |
        |
x o x   |   x o x  (-1)  x o x 
o o _ <-+-- o o _ <---+-- o o o (o wins) 
_ x _   |   x x _     |   x x _
        |             |
        |             |   x o x     (0)  x o x
        |             +-- o o _ <------- o o x (tie)
        |                 x x o          x x o
        |    
        |        
        |   x o x   (-1)  x o x        
        +-- o o _ <---+-- o o o (o wins)
            _ x x     |   _ x x        
                      |
                      |   x o x      (1) x o x
                      +-- o o _ <------- o o x (x wins)
                          o x x          o x x
```
In minimax, we look at each return value and select the position with max or min value depending on which turn we are simulating. So, in a nutshell, we've just described the minimax algorithm. 

## Implementation

We'll take a look at snippets of code from the tic-tac-toe game above. The game utilizes minimax when you play the hard computer player. 

`GameState` is an immutable object that will encapsulate the game's state for any given turn, with the following properties:

* all positions within the game (e.g, the 3x3 cells)
* player that will play the next turn
* opponent the other player

```javascript
// Global Constants
/* An cell that is not played yet */
const UNPLAYED_CELL = ' ';
/* All cells that form rows, cols and diagonals */
const WINSETS = [
  [0,1,2], [3,4,5], [6,7,8], 
  [0,4,8], [6,4,2], [0,3,6],
  [1,4,7],[2,5,8]
];

/**
 * Class representing the game's current for any given turn.
 */
class GameState {
   /**
    * @param {array} positions array representing possible moves in the game
    * @param {Player} player the player that generated this state (e.g, from a move)
    * @param {Player} opponent the other player in the game
    */
  constructor(positions, player, opponent) {
    this.positions = positions;
    this.player = player;
    this.opponent = opponent;
    this.movesLeft = this.getAvailableMoves().length;
  }

  /**
   * @returns Array of unplayed position indexes (0-th based)
   */
  getAvailableMoves() {
    return this.positions
      .map((p, i) => p === UNPLAYED_POS ? i : -1)
      .filter(e => e !== -1);
  }
}
```

Also, we want some helper methods to determine if the game is over (e.g, won or tie).

```javascript
class GameState {
  // ...

  /**
   * @returns true if game is won
   */
  isWon() {
    for (const ws of WIN_SETS) {
      if (UNPLAYED_POS !== this.positions[ws[0]] 
          && this.positions[ws[0]] === this.positions[ws[1]]
          && this.positions[ws[0]] === this.positions[ws[2]]) {
        return true;
      }
    }
    return false;
  }

  /**
   * Return true if this position is unplayed.
   * @param {number} i id of position
   */
  isAvailable(i) {
    return this.positions[i] === UNPLAYED_POS;
  }
}
```

It would be nice to transition from one state to the next (e.g, taking a turn/move), `GameState` would be a good place for that functionality.

```javascript
class GameState {
  // ...

  /**
   * Make the move for the current player to given position. Note, assumes
   * moves are legal, caller is responsible for check moves are possible.
   * @param {number} i position to move to
   * @returns GameState representing the move that was just made.
   */
  move(i) {
    if (this.isWon() || this.movesLeft === 0)
      throw 'No moves available!';

    const positions = Array.from(this.positions);
    positions[i] = this.player.id;
    return new GameState(
        positions,
        this.opponent,
        this.player
      );
  }
}
```

Finally, we need a way to create an initial `GameState`.

```javascript
class GameState {
  // ...
  static create(player, opponent) {
    return new GameState(new Array(9).fill(UNPLAYED_POS), player, opponent);
  }
}
```

In the full implementation of the game above, there's a class heirarchy of `Player` <--`ComputerPlayer`<--`HardComputerPlayer` that we won't go into here, instead we'll focus on the `HardComputerPlayer` class that implements the minimax algorithm.

When the `HardComputerPlayer` makes a move, it grabs a list of available moves and applies minimax to each possible position.

```javascript
/* The max depth to allow minimax alogrithm to run */
const MM_MAX_SEARCH_DEPTH = Number.POSITIVE_INFINITY;

/**
 * Computer player that utilizes minimax to select each turn.
 */
class HardComputerPlayer extends ComputerPlayer {
  /**
   * Make a move given the current game state.
   * @param {GameState} state 
   */
  doMove(state) {
    const moves = state.getAvailableMoves();
    let maxVal = Number.NEGATIVE_INFINITY;
    let maxMove;
    // For each available position, run minimax and get the maximal
    // value of that path, ...
    for (const move of moves) {
      const val = this.minimax(state.move(move), false, 1);
      if (maxVal < val) {
        maxVal = val;
        maxMove = move;
      }
    }
    // ... then move to position that return maximal value
    return state.move(maxMove);
  }
}
```

For each potential move, it runs minimax until the end of a game, and passes back at each turn the maximizing or minizing value based on the descendent turns. After all potential moves have been explored, it makes the move corresponding to the the simulation that returned the maximum value.

The algorithm is a pretty straight-forward recursive function, each recursion switching between maximizing or minimizing. The base case is when a player wins, a tie or a max recursion depth is reached. A heuristic we haven't considered is when there are duplicate outcomes (e.g, more than a single winning move), but different search path lengths. How do we take the shortest path to the most successful outcome. 

So in the implementation, I also used the current depth to give us an additional heuristic to improve our decision making, yielding the shortest path possible to our desired outcome.

```javascript
class HardComputerPlayer extends ComputerPlayer {
  ...
  /**
   * 
   * @param {GameState} state current state of game
   * @param {boolean} maximizing indicating if we should maximize or minimize
   * @param {number} depth how far ahead have we played, if set, we can use 
   *    to limit the minimax algorithm.
   */
  minimax(state, maximizing, depth) {
    const isWon = state.isWon();
    if (isWon || state.movesLeft === 0 || depth > MM_MAX_SEARCH_DEPTH) {
      // previous move was the winning move and by the opponent so we should minimize this path
      if (isWon && maximizing) return -1 / depth;
      // otherwise previous move was winning and by us, so we should maximize this path
      else if (isWon) return 1 / depth;
      return 0;
    }

    const moves = state.getAvailableMoves();
    if (maximizing) {
      let maxVal = Number.NEGATIVE_INFINITY;
      for (const move of moves) {
        const nextState = state.move(move);
        maxVal = Math.max(maxVal, this.minimax(nextState, false, depth+1));
      }
      return maxVal;
    } 
    else {
      let minVal = Number.POSITIVE_INFINITY;
      for (const move of moves) {
        const nextState = state.move(move);
        minVal = Math.min(minVal, this.minimax(nextState, true, depth+1));
      }
      return minVal;
    }
  }
}
```

In summary, we just covered a basic implementation of the minimax algorithm, if you'd like to see how it was integrated into the demo game above [checkout the source](https://github.com/ikumen/today-i-learned/blob/main/src/main/resources/META-INF/resources/static/js/ttt-with-minimax.js) [on GitHub](https://github.com/ikumen/today-i-learned). Alternatively you can [play with it on p5js.org](https://editor.p5js.org/ikumen/sketches/tRJ5If1NC).


