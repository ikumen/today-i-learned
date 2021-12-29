# class Tree:
#     def __init__(self, val, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

# class LLNode:
#     def __init__(self, val, next=None):
#         self.val = val
#         self.next = next
# https://binarysearch.com/problems/Binary-Tree-to-Linked-List
class Solution:
    def solve(self, root):
        def inorder(node, llnode):
            if node is None:
                return llnode

            llnode = inorder(node.left, llnode)
            llnode.next = llnode = LLNode(node.val)
            llnode = inorder(node.right, llnode)

            return llnode

        head = LLNode(None)
        inorder(root, head)

        return head.next

