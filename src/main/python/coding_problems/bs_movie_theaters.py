"""
Given a list of time exclusive intervals for different movie showings (possibly overlapping), find the minimum number of theatres required to be able to show all movies.

https://binarysearch.com/problems/Movie-Theatres
"""
class Solution:
    def solve(self, intervals):
        times = []
        for (start, end) in intervals:
            times.append((start, 1))
            times.append((end, -1))
        times.sort()
        theaters = 0
        max_theaters = 0
        for (time, cnt) in times:
            theaters += cnt
            max_theaters = max(max_theaters, theaters)
        return max_theaters