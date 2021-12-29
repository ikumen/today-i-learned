"""
You are given two lists of integers a and b, both of the same length. Given that you can first permute a in any order, return the maximum number of indices where a[i] > b[i].

Constraints

    n ≤ 100,000 where n is the length of a and b


https://binarysearch.com/problems/Permute-to-Make-List-Larger
"""
class Solution:
    def solve(self, a, b):
        a.sort()
        b.sort()

        rv = 0
        ai = bi = len(a)-1
        while ai >= 0 and bi >= 0:
            if a[ai] > b[bi]:
                ai -= 1
                bi -= 1
                rv += 1
            else:
                bi -= 1
        return rv