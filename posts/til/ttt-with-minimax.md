---
title: Tic-Tac-Toe with Minimax Algoritm
tags: minimax, algorithms, game
description: An introduction to the minimax algorithm with tic-tac-toe
---

<!-- # Tic-Tac-Toe with Minimax Algorithm

An introduction to the minimax algorithm with tic-tac-toe.

<div class="center">
<div id="sketch" class="w-100"></div>
</div>
-->
<script src="/static/js/p5.js"></script>
<script defer src="/static/js/test-runner.js"></script> 
<script defer src="/static/js/ttt.js"></script> 
<!-- <script defer src="/static/js/ttt-with-minimax.js"></script>  -->

## How it works

The minimax algorithm is a decision rule algorithm used for minimizing potential loss. It has many applications in a wide range of fields, but to keep our introduction simple we'll focus on game theory and how minimax can be used to build a stronger computer opponent in tic-tac-toe. Tic-tac-toe is a great game to demonstrate minimax because of the relatively small number of moves and possible outcomes. 

The idea behind minimax is easier to demonstrate visually so let's do that now with the following scenario for a tic-tac-toe game currently underway.

Suppose we have the current game state and we are player `x` and it's our turn. 

```bash   
x o x     # assume cells  1 2 3
o o _     # are           4 5 6
_ x _     # numbered      7 8 9
```

To figure out our next move using an alogrithm like minimax, we simply simulate every round, alternating between being `x` and our opponent `o`. The name minimax comes from the fact that we want to maximize on our (`x`) turn, while minimizing when we simulate our opponent `o`'s turn. Let' see how that would play out for each round. 

```python
current    x turn        o turn       x turn
-------    --------      --------     ---------
            x o x        x o x        x o x
        +-- o o x <--+-- o o x <----- o o x (x wins)
        |   _ x _    |   o x _        o x x
        |            |
        |            |   x o x        x o x
        |            +-- o o x <----- o o x (t) 
        |                _ x o        x x o
        |
        |
x o x   |   x o x        x o x 
o o _ <-+-- o o _ <--+-- o o o (o wins) 
_ x _   |   x x _    |   x x _
        |            |
        |            |   x o x        x o x
        |            +-- o o _ <----- o o x (t)
        |                x x o        x x o
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

Starting with the first round, it's our turn and we can go in either 6, 7 or 9. 

#### Position 6 path
Let's take 6 and see if it's a good move. 
* next in the minimax algorithm, we switch and simulate being `o`, making the best possible move for `o`, who is left with positions 7 and 9
  - if `o` takes 7
    - the next round `x` would be left with 9 and `x` wins the game 
  - if `o` takes 9
    - the next round `x` would be left with 7 which leads to a tie
  - so `o` would take 9 to maximize (tie vs losing)
* ultimately if we take 6, and `o` played optimally, we get a tie

#### Position 7 path
Next we do try the simulation but this time take 7 to start.
* in minimax, we would switch to play optimally for `o` which is left with 6 and 9
  - if `o` takes 6, it wins
  - if `o` takes 9, 
    - next round `x` would take 6 and cause a tie
  - so `o` would take 6 to maximize (win vs tie)
* ultimately if we take 7, `o` would optimally play 6 and we loose 

#### Position 9 path
Finally what if we start by taking 9.
* that would leave `o` with 6 and 7
  - if `o` takes 6, it wins
  - if `o` takes 7
    - the next round `x` would be left with 6 and win
  - so `o` would play optimally and take 6
* ultimately if we take 9 to start, `o` would optimally take 6 and we loose

So the best move for us (`x`) would be 6, even though it's not a winning move, it would guarantee a tie. 

At this point, you're probably wondering how each simulated round would pass maximizing or minimizing information back to the originating caller. We can use a simple rule that returns positive values when maximizing, and negative values on a turn that is minimizing, and zero for ties. To indicate which round we are in, a boolean flag will suffice. 

Here's the updated turns showing how a maximizing, minimizing or zero value can be used.

```python
current    x turn         o turn         x turn
-------    --------       --------       ---------
            x o x  (0)    x o x     (1)  x o x
        +-- o o x <---+-- o o x <------- o o x (x wins)
        |   _ x _     |   o x _          o x x
        |             |
        |             |   x o x          x o x
        |             +-- o o x <------- o o x (t) 
        |                 _ x o          x x o
        |
        |
x o x   |   x o x  (-1)  x o x 
o o _ <-+-- o o _ <---+-- o o o (o wins) 
_ x _   |   x x _     |   x x _
        |             |
        |             |   x o x     (0)  x o x
        |             +-- o o _ <------- o o x (t)
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
`x` looks at each simulation and selects the position that has the highest possible (maximizing) value, while the opponent `o` will select the position with the lowest possible (minimizing) simulated value. So, in a nutshell, we've just described the minimax algorithm. 

## Algorithm

To demonstrate the minimax algorithm, we'll take a look at snippets of code from the tic-tac-toe game above. The game utilizes minimax when you play the hard computer player. 

Minimax requires a simulation of all possible game states to determine the next best move, so we need to design a class to encapsulate the game state on any given turn. Each state should include the following:

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

Great, let's test the `GameState` class to make sure it works. I recently implemented a tiny browser-based JavaScript test runner would be good for this situation.

```javascript

```

In the full implementation of the game above, there's a class heirarchy of `Player` <--`ComputerPlayer`<--`HardComputerPlayer` that we won't go into here, we are just focusing on the `HardComputerPlayer` class that implements the minimax algorithm.

When the `HardComputerPlayer` makes a move, with the exception of the two initial moves, it grabs a list of available moves and applies minimax to each possible position.

```javascript
/**
 * Computer player that utilizes minimax to select each turn.
 */
class HardComputerPlayer extends ComputerPlayer {
  /**
   * Make a move given the current game state.
   * @param {GameState} state 
   */
  doMove(state) {
    // The two initial moves we can select directly as it's 
    // advantageous to select the middle or corner positions.
    if (state.movesLeft >= 7) {
      for (const i of [4, 0, 2, 6, 8]) {
        if (state.isAvailable(i)) return state.move(i);
      }
    }

    // Beyond the two initial moves, lets deploy minimax to 
    // determine the best move.
    const moves = state.getAvailableMoves();
    let maxVal = Number.NEGATIVE_INFINITY;
    let maxMove;
    // For each available position, run minimax and get the maximal
    // value of that path, ...
    for (const move of moves) {
      const val = this.minimax(state.move(move), false, 5);
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

Minimax itself is simply a recursive function that iterates through remaining moves and applies minimax, each time switching between maximizing the value and minimizing the value. The base case is when a player wins, a tie or a max recursion depth is reached.

```javascript
  /**
   * 
   * @param {GameState} state current state of game
   * @param {boolean} maximizing indicating if we should maximize or minimize
   * @param {number} depth how far ahead have we played, if set, we can use 
   *    to limit the minimax algorithm.
   */
  minimax(state, maximizing, depth) {
    const isWon = state.isWon();
    if (isWon || state.movesLeft === 0 || depth <= MM_MAX_SEARCH_DEPTH) {
      // previous move was the winning move and by the opponent so we should minimize this path
      if (isWon && maximizing) return -1;
      // otherwise previous move was winning and by us, so we should maximize this path
      else if (isWon) return 1;
      return 0;
    }

    const moves = state.getAvailableMoves();
    let minMaxVal = maximizing ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
    if (maximizing) {
      for (const move of moves) {
        const val = this.minimax(state.move(move), !maximizing, depth+1);
        minMaxVal = Math.max(minMaxVal, val);
      }
    } else {
      for (const move of moves) {
        const val = this.minimax(state.move(move), !maximizing, depth+1);
        minMaxVal = Math.min(minMaxVal, val);
      }
    }
    return minMaxVal;
  }
}
```

Let's test out the minimax 