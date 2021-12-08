package com.gnoht.til.datastructures;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * A tree base data structure that satisfies the following property, all nodes
 * within the tree must have values less than or greater than parent value,
 * dependent on how they are implemented.
 *
 * For example:
 * - in min heap, all nodes >= parent
 * - in max heap, all nodes <= parent
 *
 * The heap maintains the heap property as items are added and removed from the
 * heap. It's common to implement a heap as a binary heap/binary tree, using
 * a simple array.
 *
 * Core operations:
 * +---------------+------------+--------------------------------------------------------+
 * | pop() -> item | O(log(n))  | Remove and return the min (min heap) or max (max heap) |
 * +---------------+------------+--------------------------------------------------------+
 * | push(item)    | O(log(n))  | Add an item to the heap                                |
 * +---------------+------------+--------------------------------------------------------+
 *
 * @author ikumen
 *
 */
public abstract class Heap<T extends Comparable<?>> {

  public List<T> items = new ArrayList<>();
  protected final Comparator<T> priorityComparator;

  public Heap(Comparator<T> comparator) {
    this.priorityComparator = comparator;
  }

  /**
   * Return a {@link Heap} implementation that prioritizes maximum values first.
   *
   * @param <T>
   * @return
   */
  public static <T extends Comparable<T>> Heap<T> maxHeap() {
    return new Heap<>(Comparable::compareTo){};
  }

  /**
   * Return a {@link Heap} implementation that prioritizes minimum values first.
   *
   * @param <T>
   * @return
   */
  public static <T extends Comparable<T>> Heap<T> minHeap() {
    return new Heap<>((o1, o2) -> o2.compareTo(o1)){};
  }

  /**
   * Helper for swapping elements in items list.
   * @param i
   * @param k
   */
  void swap(int i, int k) {
    T tmp = items.get(i);
    items.set(i, items.get(k));
    items.set(k, tmp);
  }

  /**
   * Shift up the item at i-th position until in correct position. For
   * a max heap, item <= parent item and min heap vice versa.
   * Runtime: O(log(n))
   */
  void shiftUp(int i) {
    if (i == 0) return;

    int p = (i - 1) / 2;
    if (priorityComparator.compare(items.get(i), items.get(p)) > 0) {
      swap(i, p);
      shiftUp(p);
    }
  }

  /**
   * Shift down the item at i-th position until in correct position. For
   * a max heap, until item is > child items and for a min heap, vice versa.
   * Runtime: O(log(n))
   */
  void shiftDown(int i) {
    int left = (i * 2) + 1;
    int right = left + 1;
    int k = i; // holds the items index with largest value

    if (left < items.size() && priorityComparator.compare(items.get(left), items.get(k)) > 0)
      k = left;
    if (right < items.size() && priorityComparator.compare(items.get(right), items.get(k)) > 0)
      k = right;
    if (k != i) {
      swap(i, k);
      shiftDown(k);
    }
  }


  /**
   * Remove and return the item with highest priority.
   * Runtime: O(log(n)) from shiftDown operation
   */
  public T pop() {
    if (items.isEmpty())
      return null;

    T item = items.get(0);
    T last = items.remove(items.size()-1);
    if (items.size() >= 1) {
      items.set(0, last);
      shiftDown(0);
    }
    return item;
  }

  /**
   * Return the item with the highest priority.
   * Runtime: O(1)
   */
  public T peek() {
    if (items.isEmpty())
      return null;
    return items.get(0);
  }

  /**
   * Add item to the heap.
   * Runtime: O(log(n)) from shiftUp operation
   */
  public void push(T item) {
    items.add(item);
    shiftUp(items.size()-1);
  }

  public boolean isEmpty() {
    return items.isEmpty();
  }

}
