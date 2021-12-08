package com.gnoht.til.datastructures;

/**
 * @author ikumen@gnoht.com
 */
public class BinarySearchTree<T extends Comparable<T>> {

  private Node<T> root;

  /**
   * Add value to the BST.
   *
   * @param value
   */
  public void add(T value) {
    Node<T> node = new Node<>(value);
    if (root == null) {
      root = node;
    } else {
      addNode(root, node);
    }
  }

  public T remove(T value) {
    if (value == null || root == null)
      return null;
    Node<T> removedNode = removeNode(root, value);
    return null;
  }

  private Node<T> removeNode(Node<T> parent, T value) {
    if (parent == null)
      return null;

    int diff = value.compareTo(parent.value);

    if (diff < 0) { // Node to delete in left subtree


    } else if (diff > 0) { // Node to delete in right subtree

    } else { // Found node to delete
      if (parent.left == null && parent.right == null) {
        // Has no children
        return null;
      } else if (parent.left != null && parent.right != null) {
        // Has both children, find the

      }
    }
    return null;
  }

  private void addNode(Node<T> parent, Node<T> node) {
    int diff = parent.compareTo(node);
    if (diff == 0)
      throw new IllegalArgumentException("Duplicates are not supported");

    if (diff < 0) {
      if (parent.left != null) {
        addNode(parent.left, node);
      } else {
        parent.left = node;
      }
    } else {
      if (parent.right != null) {
        addNode(parent.right, node);
      } else {
        parent.right = node;
      }
    }
  }

  static class Node<T extends Comparable<T>> implements Comparable<Node<T>> {
    T value;
    Node<T> left;
    Node<T> right;

    public Node(T value) {
      this.value = value;
    }

    public Node(T value, Node<T> left, Node<T> right) {
      this.value = value;
      this.left = left;
      this.right = right;
    }

    @Override
    public int compareTo(Node<T> o) {
      return value.compareTo(o.value);
    }
  }
}
