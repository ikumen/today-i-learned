"""
You are given a two-dimensional list of integers matrix where each matrix[r][c] represents the number of coins in that cell. When you pick up coins on matrix[r][c], all the coins on row r - 1 and r + 1 disappear, as well as the coins at the two cells matrix[r][c + 1] and matrix[r][c - 1]. Return the maximum number of coins that you can collect.

Constraints

    n, m ≤ 250 where n and m are the number of rows and columns in matrix



https://binarysearch.com/problems/Collecting-Disappearing-Coins
"""
class Solution:
    def solve(self, matrix):
        def largest(row):
            previous, current = 0, 0
            for n in row:
                previous, current = current, max(current, previous + n)
            return current

        previous, current = 0, 0
        for row in matrix:
            previous, current = current, max(current, previous + largest(row))
        
        return current
            