"""
Given a list of integers nums, return a new list such that each element at index i of the new list is the product of all the numbers in the original list except the one at i. Do this without using division.

Constraints

2 ≤ n ≤ 100,000 where n is the length of nums

https://binarysearch.com/problems/Special-Product-List
"""
class Solution:
    def solve(self, nums):
        def dp(before, i):
            if i == len(nums):
                return 1
            n = nums[i]
            after = dp(before * nums[i], i+1)
            nums[i] = before * after
            return n * after
        
        dp(1, 0)
        return nums