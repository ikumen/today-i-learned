"""
Given a string s and an integer k, return the number of k-length substrings that occur more than once in s.

Constraints

    n ≤ 100,000 where n is the length of s.
    k ≤ 10


https://binarysearch.com/problems/Repeated-K-Length-Substrings
"""
class Solution:
    def solve(self, s, k):
        slen, substrings = len(s), {}

        rv = i = 0
        while i <= slen-k:
            ss = s[i:i+k]
            # print(ss)
            substrings[ss] = substrings.get(ss, 0) + 1
            if substrings[ss] == 2:
                rv += 1
            i += 1
        return rv