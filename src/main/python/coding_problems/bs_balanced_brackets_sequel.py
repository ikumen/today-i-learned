"""
Given a string s containing round, curly, and square open and closing brackets, return whether the brackets are balanced.

Constraints

    n ≤ 100,000 where n is the length of s


https://binarysearch.com/problems/Balanced-Brackets-Sequel
"""
class Solution:
    def solve(self, s):
        stack = []

        for c in s:
            if c == ')':
                if not stack or stack.pop() != '(':
                    return False
            elif c == '}':
                if not stack or stack.pop() != '{':
                    return False
            elif c == ']':
                if not stack or stack.pop() != '[':
                    return False
            else:
                stack.append(c)
        
        return len(stack) == 0
