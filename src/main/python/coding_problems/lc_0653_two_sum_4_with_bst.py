def contains_sum(node, k):
    seen = {}

    def contains(node, k):
        if node is None:
            return False

        if node.val in seen:
            return True

        seen.add(node.val)

        return contains(node.left, k-node.val) \
            or contains(node.right, k-node.val)