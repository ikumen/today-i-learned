"""
You are given a two dimensional matrix where a 1 represents a live cell and a 0 represents a dead cell. A cell's (living or dead) neighbors are its immediate horizontal, vertical and diagonal cells. Compute the next state of the matrix using these rules:

    Any living cell with two or three living neighbors lives.
    Any dead cell with three living neighbors becomes a live cell.
    All other cells die.

Constraints

    n, m ≤ 500 where n and m are the number of rows and columns in matrix


https://binarysearch.com/problems/Conway's-Game-of-Life
"""
class Solution:
    def solve2(self, matrix):

        rows = len(matrix)
        cols = len(matrix[0])
        next_generation = [0] * rows * cols

        for i in range(len(next_generation)):
            r, c = i // cols, i % cols
            north, south, east, west = r > 0, r < rows-1, c < cols-1, c > 0

            # Get neighbors
            nbrs = 0
            if north: 
                nbrs += matrix[r-1][c]
                if east: nbrs += matrix[r-1][c+1]
                if west: nbrs += matrix[r-1][c-1]
            if south: 
                nbrs += matrix[r+1][c]
                if east: nbrs += matrix[r+1][c+1]
                if west: nbrs += matrix[r+1][c-1]
            if east: nbrs += matrix[r][c+1]
            if west: nbrs += matrix[r][c-1]

            # Apply state/neighbor rules to compute next state
            if (matrix[r][c] == 0 and nbrs == 3) or \
                    (matrix[r][c] == 1 and 2 <= nbrs <= 3):
                next_generation[i] = 1
            else: 
                next_generation[i] = 0

        # Update state with next generation
        for i in range(len(next_generation)):
            matrix[i // cols][i % cols] = next_generation[i]
            
        return matrix

    def solve(self, matrix):

        rows = len(matrix)
        cols = len(matrix[0])

        for r in range(rows):
            for c in range(cols): 
                # boolean indicating if direction available (eg, north,south...
                north, south, east, west = r > 0, r < rows-1, c < cols-1, c > 0
                # neighbors
                nbrs = 0
                if north:
                    if matrix[r-1][c] % 10: nbrs += 1
                    if west and matrix[r-1][c-1] % 10: nbrs += 1
                    if east and matrix[r-1][c+1] % 10: nbrs += 1
                if south:
                    if matrix[r+1][c] % 10: nbrs += 1
                    if west and matrix[r+1][c-1] % 10: nbrs += 1
                    if east and matrix[r+1][c+1] % 10: nbrs += 1
                if east and matrix[r][c+1] % 10: nbrs += 1
                if west and matrix[r][c-1] % 10: nbrs += 1

                # assign neighbors count
                matrix[r][c] += (10 * nbrs)

        # Update the state, based on state/neighbor rules
        for r in range(rows):
            for c in range(cols): 
                if matrix[r][c] == 30 or (21 <= matrix[r][c] <= 31):
                    matrix[r][c] = 1
                else:
                    matrix[r][c] = 0
        return matrix
