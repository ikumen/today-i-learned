package com.gnoht.til.datastructures;

/**
 * A data structure representing a linear collection that operates in a
 * "first-in-last-out" manner, resembling a stack of cards where values are
 * added and removed from the top.
 *
 * Core operations:
 * +------------------+-------+-------------------------------------------------------+
 * | pop() -> item    | O(1)  | Remove and return an item from the top of stack       |
 * +------------------+-------+-------------------------------------------------------+
 * | peek() -> item   | O(1)  | Return (but don't remove) item from top of stack      |
 * +------------------+-------+-------------------------------------------------------+
 * | push(item)       | O(1)  | Add an item to the top of the stack                   |
 * +------------------+-------+-------------------------------------------------------+
 *
 * This implementation does not support inserting null values.
 *
 * @author ikumen
 */
public class Stack<T> {

  private Node<T> head;
  private int size;

  /**
   * Push the given value onto the top of this Stack.
   * Runtime: O(1)
   */
  public void push(T value) {
    if (value == null)
      throw new IllegalArgumentException("This Stack does not support null values");
    head = new Node<>(value, head);
    size += 1;
  }

  /**
   * Remove and return the value at the top of this Stack
   * or null if this Stack is empty.
   * Runtime: O(1)
   */
  public T pop() {
    if (head == null) {
      return null;
    }

    T value = head.value;
    head = head.next;
    size -= 1;
    return value;
  }

  /**
   * Returns the value at the top of this Stack or null if Stack is empty.
   * Runtime: O(1)
   */
  public T peek() {
    if (head == null) {
      return null;
    }
    return head.value;
  }

  /**
   * Return the size of this Stack.
   */
  public int size() {
    return size;
  }

  public boolean isEmpty() {
    return size == 0;
  }

  /**
   * Internal object to help store a value and pointer to the
   * next value, Stack is made of one or more nodes in a chain.
   */
  private static class Node<T> {
    T value;
    Node<T> next;

    Node(T value) {
      this(value, null);
    }

    Node(T value, Node<T> next) {
      this.value = value;
      this.next = next;
    }
  }
}
