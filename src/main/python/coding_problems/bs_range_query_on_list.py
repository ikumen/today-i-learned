"""
Implement a data structure with the following methods:

RangeSum(int[] nums) constructs a new instance with the given nums.
total(int i, int j) returns the sum of integers from nums between [i, j). That is, nums[i] + nums[i + 1] + ... + nums[j - 1].
Constraints

n ≤ 100,000 where n is the length of nums
k ≤ 100,000 where k is the number of calls to total

https://binarysearch.com/problems/Range-Query-on-a-List
"""
class RangeSum:
    def __init__(self, nums):
        self.sums = [(0,0)]
        for i, n in enumerate(nums):
            self.sums.append((n, self.sums[i][1]+n))

    def total(self, i, j):
        return self.sums[j][1]-self.sums[i][1]