package com.gnoht.til.datastructures;

/**
 * A data structure representing a linear collection that operates in a
 * "first-in-first-out" manner, where items are added to end and remove from
 * the front.
 *
 * Core operations:
 * +------------------+-------+--------------------------------------------------------+
 * | dequeue() -> val | O(1)  | Remove and return a value from front of queue          |
 * +------------------+-------+--------------------------------------------------------+
 * | enqueue(val)     | O(1)  | Add a value to the end of the queue                    |
 * +------------------+-------+--------------------------------------------------------+
 *
 * @author ikumen@gnoht.com
 */
public class Queue<T> {

  private Node<T> head;
  private Node<T> tail;
  private int size;

  /**
   * Add value to end of queue.
   * Runtime: O(1)
   *
   * @param value
   */
  public void enqueue(T value) {
    Node<T> node = new Node<>(value);
    if (head == null) {
      head = tail = node;
    } else {
      tail.next = node;
      tail = node;
    }
    size++;
  }

  /**
   * Remove and return the value at the front of the queue.
   * Runtime: O(1)
   *
   * @return
   */
  public T dequeue() {
    if (head == null)
      return null;
    T value = head.value;
    head = head.next;
    size--;
    return value;
  }

  public int size() {
    return size;
  }

  static class Node<T> {
    T value;
    Node<T> next;

    Node(T value) {
      this.value = value;
    }

    Node(T value, Node next) {
      this.value = value;
      this.next = next;
    }
  }
}
