package com.gnoht.til.datastructures;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class DoublyLinkedListTest {
  
  @Test
  public void testOperations() {
    DoublyLinkedList<Integer> list = new DoublyLinkedList<>();

    assertEquals(0, list.size());
    list.addFirst(10);
    assertEquals(1, list.size());
    assertEquals(10, list.removeLast());
    assertEquals(0, list.size());

    list.addFirst(10);
    list.addLast(20);
    list.addLast(30);
    list.addFirst(0);
    assertEquals(4, list.size());
    assertEquals(0, list.removeFirst());
    assertEquals(30, list.removeLast());
    assertEquals(10, list.removeFirst());
    assertEquals(20, list.removeFirst());
  }
}
