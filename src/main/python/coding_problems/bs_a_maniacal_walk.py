"""
A person is placed on a list of length length, at index 0, and on each step, they can move right one index or left one index (without going out of bounds), or stay on that index.

Given that the person can take exactly n steps, how many unique walks can the person take and reach back to index 0? Mod the result by 10 

https://binarysearch.com/problems/A-Maniacal-Walk
"""
class Solution:
    def solve(self, length, n):
        m = 10**9+7
        
        @lru_cache(None)
        def dp(pos, s):
            if s == 0:
                if pos == 0:
                    return 1
                return 0
            elif pos < 0 or pos >= length:
                return 0                
            return (dp(pos, s-1) + dp(pos-1, s-1) + dp(pos+1, s-1)) % m

        return dp(0, n)

    # def solve(self, length, n):
    #     m = 10**9+7
    #     seen = set()

    #     # @lru_cache(None)
    #     def dp(pos, s, k=''):
    #         if s == 0:
    #             if pos == 0:
    #                 seen.add(k)
    #                 return 1
    #             return 0
            
    #         rv = 0
    #         if k+'0' not in seen:
    #             rv = dp(pos, s-1, k+'0')
    #         if pos > 0 and k+'-1' not in seen:
    #             rv += dp(pos-1, s-1, k+'-1')
    #         if pos < length and k+'1' not in seen:
    #             rv += dp(pos+1, s-1, k+'1')
    #         return rv % m

    #     return dp(0, n, '') % m