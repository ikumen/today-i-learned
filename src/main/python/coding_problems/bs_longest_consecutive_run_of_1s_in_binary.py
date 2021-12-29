"""
Given a non-negative integer n, return the length of the longest consecutive run of 1s in its binary representation.

Constraints

0 ≤ n < 2 ** 31

https://binarysearch.com/problems/Longest-Consecutive-Run-of-1s-in-Binary
"""
class Solution:
    def solve(self, n):
        s = bin(n)
        ones = max_ones = 0
        for i in range(2, len(s)):
            if s[i] == '0':
                ones = 0
            else:
                ones += 1
            max_ones = max(ones, max_ones)
        return max_ones

