"""
Given a string s, consisting of "X" and "Y"s, delete the minimum number of characters such that there's no consecutive "X" and no consecutive "Y".

Constraints

    n ≤ 100,000 where n is the length of s


https://binarysearch.com/problems/Consecutive-Duplicates
"""
class Solution:
    def solve(self, s):
        # Write your code here
        results = []
        for c in s:
            if len(results) == 0 or results[len(results)-1] != c:
                results.append(c)
        return "".join(results)