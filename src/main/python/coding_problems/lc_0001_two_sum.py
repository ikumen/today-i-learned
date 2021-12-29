"""
Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

 

Example 1:

Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Output: Because nums[0] + nums[1] == 9, we return [0, 1].

Example 2:

Input: nums = [3,2,4], target = 6
Output: [1,2]

Example 3:

Input: nums = [3,3], target = 6
Output: [0,1]

 

Constraints:

    2 <= nums.length <= 104
    -109 <= nums[i] <= 109
    -109 <= target <= 109
    Only one valid answer exists.
"""
class Solution:
    def twoSumBrute(self, nums: List[int], target: int) -> List[int]:
        """Brute force solution with
        time: O(n^2)
        space: O(1)
        """
        for i in range(0, len(nums)-1):
            for k in range(i+1, len(nums)):
                if nums[i] + nums[k] == target:
                    return [i, k]
        return []
    
    
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        """Use a map to store already seen nums, as we loop through
        nums. For each num, compute the diff (target - num), if in seen
        then we have our two numbers
        time: O(n)
        space: O(n)
        """
        seen = {}
        for i in range(len(nums)):
            k = target - nums[i]
            if k in seen:
                return [i, seen[k]]
            seen[nums[i]] = i
        return []
    