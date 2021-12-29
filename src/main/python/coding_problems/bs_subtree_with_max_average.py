"""
Given a binary tree root, return the maximum average value of a subtree. A subtree is defined to be some node in root including all of its descendants. A subtree average is the sum of the node values divided by the number of nodes.

Constraints

    1 ≤ n ≤ 100,000 where n is the number of nodes in root


https://binarysearch.com/problems/Subtree-with-Maximum-Average
"""
# class Tree:
#     def __init__(self, val, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def solve(self, root):
        ans = 0
    
        def dfs(node):
            nonlocal ans
            if node is None:
                return (0, 0)

            lsum, lcount = dfs(node.left)
            rsum, rcount = dfs(node.right)

            currsum = lsum + rsum + node.val
            currcount = lcount + rcount + 1
            ans = max(ans, currsum / currcount)
            return (currsum, currcount)
        
        dfs(root)
        return ans



                