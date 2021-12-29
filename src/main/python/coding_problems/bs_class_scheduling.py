"""
You are given a two-dimensional list of integers times where each list has two numbers [start, end], representing the start and end time of a course.

Return the maximum number of courses you can take assuming you can only take one course at a time and the start of a course needs to be later than the end of the last course.

Constraints

    n ≤ 100,000 where n is the length of times

https://binarysearch.com/problems/Class-Scheduling
"""
class Solution:
    def solve(self, times):
        if len(times) <= 1:
            return len(times)
        times.sort(key=lambda x:x[1])
        maxc = 0
        c, i, pt = 1, 1, times[0]
        while i < len(times):
            t = times[i]
            if t[0] > pt[1]:
                c += 1
                pt = t
            i += 1
        return c