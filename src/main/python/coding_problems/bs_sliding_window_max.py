"""

"""
from collections import deque

class Solution:
    def solveNaiveSorted(self, nums, k):
        """
        Intuition:
            for each i-th position in nums,
                - return max from sub array i..i+k
        """
        results = []
        for i in range(len(nums)-k+1):
            results.append(sorted(nums[i:i+k])[-1])
        return results

    def solveNaiveScanMax(self, nums, k):
        """
        Same as above, but for each sliding window, scan through it for max
        """
        results, maxi = [], 0
        for i in range(len(nums)-k+1):
            maxi = i
            for j in range(i, i+k):
                if nums[maxi] < nums[j]:
                    maxi = j
            results.append(nums[maxi])
        return results

    def solve(self, nums, k):
         # base cases
        n = len(nums)
        if n * k == 0:
            return []
        if k == 1:
            return nums
        
        def clean_deque(i):
            # remove indexes of elements not from sliding window
            if deq and deq[0] == i - k:
                deq.popleft()
                
            # remove from deq indexes of all elements 
            # which are smaller than current element nums[i]
            while deq and nums[i] > nums[deq[-1]]:
                deq.pop()
        
        # init deque and output
        deq = deque()
        max_idx = 0
        for i in range(k):
            clean_deque(i)
            deq.append(i)
            # compute max in nums[:k]
            if nums[i] > nums[max_idx]:
                max_idx = i
        output = [nums[max_idx]]
        
        # build output
        for i in range(k, n):
            clean_deque(i)          
            deq.append(i)
            output.append(nums[deq[0]])
        return output


    def solveAdditionalLeftRightMaxArrays(self, nums, k):
        """
        Intuition: Keep two additional arrays (left and right), 
            - each broken into k-length segments
            - for each segment, scan either left or right
                - and at each index, store the max index for the segment up to that point
            - finally scan through the segments taking max(left(rightmost), right(leftmost))
        """
        len_n = len(nums)
        left, maxi = [0] * len_n, 0
        for i in range(len_n):
            if i % k == 0 or nums[maxi] < nums[i]:
                maxi = i
            left[i] = maxi

        right, maxi = [0] * len_n, len_n-1
        for i in range(len_n-1, -1, -1):
            if i % k == 0 or nums[maxi] < nums[i]:
                maxi = i
            right[i] = maxi

        results = [0] * (len_n-k+1)
        for i in range(len_n-k+1):
            results[i] = max(nums[left[i+k-1]], nums[right[i]])

        return results

