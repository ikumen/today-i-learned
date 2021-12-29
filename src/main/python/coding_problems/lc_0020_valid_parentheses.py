class Solution:
    def isValid(self, s: str) -> bool:
        """
        key insight:
            - need data structure to maintain insertion order of open brackets seen
            - stack
        """
        brackets = {
            "}": "{",
            ")": "(",
            "]": "["
        }
        stack = []
        for c in s:
            # (', ')', '{', '}', '[' and ']
            if c in brackets.values():
                stack.append(c)
            elif c in brackets and (not stack or brackets[c] != stack.pop()):
                return False
            
        if len(stack) == 0:
            return True
        return False
                
        