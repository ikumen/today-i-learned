"""
Given lowercase alphabet strings a, b, and c return whether there's any way of obtaining c by merging characters in order from a and

https://binarysearch.com/problems/Zipped-String
"""
class Solution:
    def solve(self, a, b, c):
        alen, blen, clen = len(a), len(b), len(c)
        if alen + blen != clen:
            return False

        def dp(ap, bp, cp):
            if cp >= clen:
                return True

            return (ap < alen and a[ap] == c[cp] and dp(ap+1, bp, cp+1)) \
                or (bp < blen and b[bp] == c[cp] and dp(ap, bp+1, cp+1))
            
        return dp(0, 0, 0)