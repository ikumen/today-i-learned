"""
Given a list of integers nums, return the sum of a non-empty contiguous sublist with the largest sum.

Constraints

1 ≤ n ≤ 100,000 where n is the length of nums

https://binarysearch.com/problems/Largest-Sublist-Sum
"""
class Solution:
    def brute(self, nums):
        ans = float("-inf")
        for i in range(len(nums)):
            s = 0
            for k in range(i, len(nums)):
                s += nums[k]
                ans = max(ans, s)
        return ans

    def solve(self, nums):
        ans = float("-inf")
        def dp(i, n):
            nonlocal ans
            if i < len(nums):
                n = max(nums[i], n + nums[i])
                ans = max(ans, n)
                dp(i + 1, n)
        dp(0, 0)
        return ans

    def solve2(self, nums):
        ans, n = float("-inf"), 0
        for i in range(len(nums)):
            n = max(nums[i], n + nums[i])
            ans = max(ans, n)
        return ans

