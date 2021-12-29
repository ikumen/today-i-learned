"""
Given a list of integers nums, split it into two lists of equal size where the absolute difference between each list's median is as small as possible and return this difference.

Note: length of nums / 2 is guaranteed to be odd.

Constraints

    n ≤ 100,000 where n is the length of nums


https://binarysearch.com/problems/Median-Minimization
"""
class Solution:
    def solve(self, nums):
        nums.sort()
        m = len(nums) // 2
        return abs(nums[m-1]-nums[m])