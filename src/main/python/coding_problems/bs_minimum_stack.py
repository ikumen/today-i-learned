"""
Implement a stack with the following methods:

MinimumStack() constructs a new instance of a minimum stack
append(int val) appends val to the stack
peek() retrieves the last element in the stack
min() retrieves the minimum value in the stack
pop() pops and returns the last element in the stack
Each method should be done in \mathcal{O}(1)O(1) time. You can assume that for peek, min and pop, the stack is non-empty when they are called.

Constraints

n ≤ 100,000 where n is the number of calls to append, peek, min, and pop.

https://binarysearch.com/problems/Minimum-Stack
"""
class MinimumStack:
    def __init__(self):
        self.head = None

    def append(self, val):
        if self.head is None:
            self.head = (val, val, None)
        else:
            self.head = (val, min(self.min(), val), self.head)

    def peek(self):
        return self.head[0]

    def min(self):
        return self.head[1]

    def pop(self):
        val = self.head[0]
        self.head = self.head[2]
        return val