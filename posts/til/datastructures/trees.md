---
title: Notes on general and binary trees
weight: 0
description: Notes and snippets of code for general and binary tree implementations
---

## Notes on Trees

* restricted form of a graph, specifically directed acyclic
* child can only have 1 parent
* parent can have zero or more children


### Linked list based tree Node implementations

Both general and binary trees can be implemented using a linked list type of data structure. 

```java
/** An example general tree node */
class Node<T> {
  T value;
  Node<T> parent;
  List<Node<T>> children;

  Node(T value, Node<T> parent) {
    this.value = value;
    this.parent = parent;
    this.children = new ArrayList<>();
  }

  void addChild(Node<T> child) {
    child.parent = this;
    this.children.add(child);
  }

  Node<T> addChild(T value) {
    Node<T> child = new Node<>(value, this);
    this.children.add(child);
    return child;
  }
}
```

Computing height and depth for linked listed based versions.

```java
/** Return depth of given node. */
int depth(Node<T> node) {
  if (node == null)
    throw new IllegalArgumentException("Node is not in tree");
  if (node == isRoot(node))
    return 0;
  return 1 + depth(node.parent);
}

/** Return the height from given node */
int height(Node<T> node) {
  int ht = 0;
  for (Node<T> child: node.children) {
    ht = Math.max(ht, 1 + height(child));
  }
  return ht;
}
```

### Array based tree Node implementation

Binary trees can also be implemented using arrays. See [min/max heap implementation](https://github.com/ikumen/today-i-learned/blob/main/src/main/java/com/gnoht/til/datastructures/Heap.java). 
* good for compact shapes, otherwise parts of allocated array will be unused
* removing values can be very inefficient, force all subsequent values to be shifted
* very efficient access to left, right and parent from any given node

```java
class BinaryTree<T> {
  List<T> values = new ArrayList<>();

  void add(T value) {
    values.add(value);
  }

  T getParent(int i) {
    if (i == 0) return null;
    int p = (i - 1) / 2;
    return values.get(p);
  }

  T getLeft(int i) {
    int l = (i * 2) + 1;
    if (l >= values.size()) return null;
    return values.get(l);
  }

  T getRight(int i) {
    int r = (i * 2) + 2;
    if (r >= values.size()) return null;
    return values.get(r);
  }
}
```


### Depth-first search

The search tree is deepened as much as possible before going to the next sibling.

**PreOrder Traversal**
* general trees: root, each child
* binary trees: root, left, right

```java
void generalPreOrder(Node<T> node) {
  // Perform visit of node
  // Next visit children of node
  for (Node<T> child: node.children)
    generalPreOrder(child);
}
```

**PostOrder Traversal**
* general trees: each child, root
* binary trees: left, right, root

```java
void generalPostOrder(Node<T> node) {
  // Visit all children first
  for (Node<T> child: node.children)
    generalPostOrder(child);
  // Perform visit of node
}
```

**InOrder Traversal**
* specific to binary trees: left, root, right
* used in binary search trees

```java
void binaryInOrder(Node<T> node) {
  if (node == null)
    return;
  binaryInOrder(node.left);
  // Perform visit to node
  binaryInOrder(node.right);
}
```

### Breadth-first search (level-order)

The search tree is broadened as much as possible before going to the next depth. 

```java
void bfs(Node<T> node) {
  Queue<Node<T>> queue = new Queue<>();
  queue.enqueue(node);
  while (!queue.isEmpty()) {
    Node<T> curr = queue.dequeue();
    // Perform visit of current node
    for (Node<T> child: curr.children)
      queue.enqueue(child);
  }
}
```

