"""

Implement a binary search tree iterator with the following methods:

next returns the next smallest element in the tree
hasnext returns whether there is a next element in the iterator
For example, given the following tree

   4
  / \
 2   7
    / \
   5   9
It should return the values in this order 2, 4, 5, 7, 9.

https://binarysearch.com/problems/Binary-Search-Tree-Iterator
"""
# class Tree:
#     def __init__(self, val, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
from collections import deque

class BSTIterator:
    def __init__(self, root):
        self.que = deque()
        self.dfs(root)

    def next(self):
        if self.que:
            return self.que.popleft().val
        return None

    def dfs(self, node):
        if node:
            if node.left:
                self.dfs(node.left)
            self.que.append(node)
            if node.right:
                self.dfs(node.right)        

    def hasnext(self):
        return len(self.que) > 0