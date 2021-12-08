package com.gnoht.til.datastructures;

/**
 * A data structure representing a linear collection of nodes, where each node
 * maintains a value and reference to the next node.
 *
 * head -> [value 1] -> [value 2] -> [value 3] -> null
 *
 * Core operations:
 * +-----------------------+------+-------------------------------------------+
 * | addFirst(item)        | O(1) | Add item to head of list                  |
 * +-----------------------+------+-------------------------------------------+
 * | addLast(item)         | O(n) | Add item to tail of list                  |
 * +-----------------------+------+-------------------------------------------+
 * | removeFirst() -> item | O(1) | Remove and return the head item           |
 * +-----------------------+------+-------------------------------------------+
 * | removeLast() -> item  | O(n) | Remove and return the tail item           |
 * +-----------------------+------+-------------------------------------------+
 *
 * This implementation does not support adding null values.
 * 
 * @author ikumen
 */
public class SinglyLinkedList<T> {

  private Node<T> head;
  private int size = 0;

  private void validateValue(T value) {
    if (value == null)
      throw new IllegalArgumentException("Null values are not supported by this list.");    
  }
  
  /**
   * Add a value to the beginning of the list. 
   * Runtime: O(1)
   */
  public void addFirst(T value) {
    validateValue(value);
    
    head = new Node<T>(value, head);
    size += 1;
  }
  
  /**
   * Add a value to the end of the list.
   * Runtime: O(n)
   */
  public void addLast(T value) {
    validateValue(value);
    
    if (head == null) {
      head = new Node<>(value);
    } else {
      // Traverse to last node and set it's next reference to our new node
      Node<T> node = head;
      while (node.next != null) {
        node = node.next;
      }
      node.next = new Node<>(value);
    }
    size += 1;
  }
  
  /**
   * Remove and return the value at the beginning of the list.
   * Runtime: O(1) 
   */
  public T removeFirst() {
    if (head == null)
      return null;
    
    T value = head.value;
    head = head.next;
    size -= 1;
    return value;
  }
  
  /**
   * Remove and return the value at the end of the list.
   * Runtime: O(n)
   */
  public T removeLast() {
    if (head == null)
      return null;

    size -= 1;
    Node<T> node = head;
    // Only 1 value in list
    if (head.next == null) {
      head = null;
      return node.value;
    } 
    // Traverse to node before last and remove it's next reference to last
    else {
      while (node.next.next != null) {
        node = node.next;
      }
      T value = node.next.value;
      node.next = null;
      return value;
    }
  }
  
  /**
   * Return the size of this list.
   */
  public int size() {
    return size;
  }
  

  /**
   * Internal object to store a linked list item and reference to the next item
   * in the list.
   *  
   * @author ikumen
   *
   * @param <T>
   */
  static class Node<T> {
    T value;
    Node<T> next;
    
    public Node(T value) {
      this(value, null);
    }
    
    public Node(T value, Node<T> next) {
      this.value = value;
      this.next = next;
    }
  }
}
