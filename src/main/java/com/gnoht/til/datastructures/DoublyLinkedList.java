package com.gnoht.til.datastructures;

/**
 * Doubly Linked List
 * A data structure representing a collection of nodes, where each node maintains a 
 * value in the collection and references to the other nodes. Order of the nodes are 
 * maintained by the references between the nodes. In a doubly linked list, references
 * to both head and tail of the list are maintained, and each node has pointers to next
 * and previous nodes. It has better performance for addLast and removeLast but require
 * extra space and complexity to maintain the previous pointer.
 * 
 * +-----------------+---------+--------------------------------------------------------+
 * | Operations	     | Runtime | Description	                                          |
 * +-----------------+---------+--------------------------------------------------------+
 * | addFirst(item)	 | O(1)    | Add an item to the front (head) of the list            |
 * +-----------------+---------+--------------------------------------------------------+
 * | addLast(item)	 | O(1)    | Add an item to the end (tail) of the list              |
 * +-----------------+---------+--------------------------------------------------------+
 * | removeFirst()	 | O(1)    | Remove and return the item from the front of the list	|
 * +-----------------+---------+--------------------------------------------------------+
 * | removeLast()	   | O(1)    | Remove and return the item from the end of the list	  |
 * +-----------------+---------+--------------------------------------------------------+
 * 
 * head -> [prev=, value, next] -> [prev, value, next] ...
 */
public class DoublyLinkedList<T> {

  private Node<T> head;
  private Node<T> tail;
  private int size;

  private void validateValue(T value) {
    if (value == null)
      throw new IllegalArgumentException("Null values are not supported in this list!");
  }

  public void addFirst(T value) {
    validateValue(value);
    if (head == null) {
      head = tail = new Node<>(value);
    } else {
      Node<T> node = new Node<>(value, head, null);
      head.prev = node;
      head = node;
    }
    size++;
  }

  public void addLast(T value) {
    validateValue(value);
    if (head == null) {
      head = tail = new Node<>(value);
    } else {
      Node<T> node = new Node<>(value, null, tail);
      tail.next = node;
      tail = node;
    }
    size++;
  }

  public T removeFirst() {
    if (head == null) {
      return null;
    }
    T value = head.value;
    if (head == tail) {
      head = tail = null;
    } else {
      head.next.prev = null;
      head = head.next;
    }
    size--;
    return value;
  }

  public T removeLast() {
    if (head == null) {
      return null;
    }
    T value = tail.value;
    if (head == tail) {
      head = tail = null;
    } else {
      tail.prev.next = null;
      tail = tail.prev;
    }
    size--;
    return value;
  }

  public int size() {
    return size;
  }

  static class Node<T> {
    Node<T> next;
    Node<T> prev;
    T value;

    public Node(T value) {
      this.value = value;
    }

    public Node(T value, Node<T> next, Node<T> prev) {
      this.value = value;
      this.next = next;
      this.prev = prev;
    }
  }

}
