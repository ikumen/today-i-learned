"""
Given a two-dimensional integer matrix of 1s and 0s, return the number of "islands" in the matrix. A 1 represents land and 0 represents water, so an island is a group of 1s that are neighboring whose perimeter is surrounded by water.

Note: Neighbors can only be directly horizontal or vertical, not diagonal.

Constraints

    n, m ≤ 100 where n and m are the number of rows and columns in matrix.


https://binarysearch.com/problems/Number-of-Islands
"""
class Solution:
    def solve(self, matrix):
        rows, cols = len(matrix), len(matrix[0])
        def dfs(r, c):
            nonlocal rows, cols
            if r >= 0 and r < rows and c >= 0 and c < cols and matrix[r][c] == 1:
                matrix[r][c] = -1
                dfs(r+1, c)
                dfs(r-1, c)
                dfs(r, c+1)
                dfs(r, c-1)
        
        islands = 0
        for r in range(rows):
            for c in range(cols):
                if matrix[r][c] == 1:
                    islands += 1
                    dfs(r, c)
        
        return islands
