"""
Given an integer k and a list of integers nums, return the length of the longest sublist that contains at most k distinct integers.

Constraints

    0 ≤ k ≤ n ≤ 100,000 where n is the length of nums


https://binarysearch.com/problems/Longest-Sublist-with-K-Distinct-Numbers
"""
class Solution:
    """
    Sliding pointer technique
    """
    def solve(self, k, nums):
        unique = {}
        tail = head = 0
        ans = 0
        while head < len(nums):
            h = nums[head]
            if h not in unique:
                unique[h] = 0
            unique[h] += 1

            while len(unique) > k:
                t = nums[tail]
                unique[t] -= 1
                if unique[t] == 0:
                    del unique[t]
                tail += 1
            ans = max(ans, head-tail+1)
            head += 1
        return ans

