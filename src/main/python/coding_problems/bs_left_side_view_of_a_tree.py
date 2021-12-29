# class Tree:
#     def __init__(self, val, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
# https://binarysearch.com/problems/Left-Side-View-of-a-Tree
from collections import deque

class Solution:
    def solve(self, root):
        results = []
        queue = deque([root])
        while queue:
            size = len(queue)
            results.append(queue[0].val)
            while size > 0:
                node = queue.popleft()
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
                size -= 1
        return results
