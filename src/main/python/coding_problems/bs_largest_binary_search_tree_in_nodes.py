"""
Given a binary tree root, find the largest subtree (the one with the most nodes) that is a binary search tree.

Constraints

    n ≤ 100,000 where n is the number of nodes in root


https://binarysearch.com/problems/Largest-Binary-Search-Subtree-in-Nodes
"""
# class Tree:
#     def __init__(self, val, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def solve(self, root):
        def closest_descendent(node):
            """Given left node, return closest node in left subtree."""
            if node.right is None:
                return node
            return closest_descendent(node.right)

        def closest_ancestor(node):
            """Given right node, return closest node in right subtree."""
            if node.left is None:
                return node
            return closest_ancestor(node.left)

        # current largest subtree and it's size
        ans_subtree, ans_size = None, 0

        def dfs(node):
            nonlocal ans_size, ans_subtree
            if node is None:
                return 1

            left_size = dfs(node.left)
            right_size = dfs(node.right)

            if not left_size or not right_size:
                return 0
            
            if ((node.left and (node.val < node.left.val or
                    node.val < closest_descendent(node.left).val)) or 
                (node.right and (node.val > node.right.val or 
                    node.val > closest_ancestor(node.right).val))):
                return 0
                
            # We have a BST, count the size and update ans if possible
            size = 1 + left_size + right_size
            if ans_size < size:
                ans_size = size
                ans_subtree = node

            return size
        
        dfs(root)
        return ans_subtree