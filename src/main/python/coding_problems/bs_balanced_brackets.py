"""
You're given a string s consisting solely of "(" and ")". Return whether the parentheses are balanced.

Constraints

n ≤ 100,000 where n is the length of s.

https://binarysearch.com/problems/Balanced-Brackets
"""
from collections import deque
class Solution:
    def solve(self, s):
        left = 0
        for c in s:
            if c == ")":
                if left == 0:
                    return False
                else:
                    left -= 1
            else:
                left += 1
        
        return left == 0

    def solve2(self, s):
        slen = len(s)
        if slen == 0:
            return True

        stack = deque([])
        for c in s:
            if c == ")" and (not stack or stack.pop() != "("):
                return False
            elif c == "(":
                stack.append(c)
        
        return len(stack) == 0