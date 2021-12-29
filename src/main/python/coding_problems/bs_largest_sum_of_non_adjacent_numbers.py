"""
Given a list of integers nums, write a function that returns the largest sum of non-adjacent numbers. Numbers can be 0 or negative.

Constraints

    n ≤ 100,000 where n is the length of nums.


https://binarysearch.com/problems/Largest-Sum-of-Non-Adjacent-Numbers
"""
class Solution:
    def solve(self, nums):
        previous, current = 0, 0
        for n in nums:
            previous, current = current, max(current, previous + n)
        return current