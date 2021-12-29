"""
Given integers n, faces, and total, return the number of ways it is possible to throw n dice with faces faces each to get total.

Mod the result by 10 ** 9 + 7.

Constraints

    1 ≤ n, faces, total ≤ 100


https://binarysearch.com/problems/Dice-Throw
"""
class Solution:
    def solve(self, n, faces, total):
        m = 10 ** 9 + 7
        @lru_cache(None)
        def dp(d, t):
            if d == 0:
                return 1 if t == 0 else 0
            s = 0
            for f in range(1, faces+1):
                s += dp(d-1, t-f)
            return s % m
        
        return dp(n, total)
