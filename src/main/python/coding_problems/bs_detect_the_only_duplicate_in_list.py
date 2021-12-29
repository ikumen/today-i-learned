"""
You are given a list nums of length n + 1 picked from the range 1, 2, ..., n. By the pigeonhole principle, there must be a duplicate. Find and return it. There is guaranteed to be exactly one duplicate.

Bonus: Can you do this in \mathcal{O}(n)O(n) time and \mathcal{O}(1)O(1) space?

Constraints

n ≤ 10,000

https://binarysearch.com/problems/Detect-the-Only-Duplicate-in-a-List
"""
class Solution:
    def solve2(self, nums):
        unique = set()
        for n in nums:
            if n in unique:
                return n
            unique.add(n)
        return None

    def solve(self, nums):
        # given sum of natural numbers 1..n = n(n+1)/2
        n = len(nums)-1
        s = sum(nums)
        return s - ((n * (n + 1)) // 2)
        
