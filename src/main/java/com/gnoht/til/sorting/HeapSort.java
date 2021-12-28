package com.gnoht.til.sorting;

/**
 * Heap sort
 *
 * An in-place comparison-based sorting algorithm that uses a heap property
 * to help find the max item and shifting it to the end.
 *
 * Runtime: best,avg,worst=O(nlog(n))
 *
 * Usage:
 *  - for best worst case runtime perf
 *  - not stable sort
 *
 * Algorithm:
 *  - build a max heap, max item at first index
 *  - swap 0 and last index
 *  - heapify from 0 to < last index (thus making new last index)
 *  - repeat, each iteration we heapify a smaller and smaller sub-array
 *
 * Example: a = [1, 7, 2, 5]
 *
 *                         1          7
 * buildHeap(a)    =>    7   2  =>  5   2     a = [7, 5, 2, 1]
 *  from 0...n-1       5           1
 *
 * swap(0, n-1)    =>                         a = [1, 5, 2, 7]
 *                         1          5
 * heapify(0, n-2) =>    5   2  =>  1   2     a = [5, 1, 2, 7]
 *
 * swap(0, n-2)    =>                         a = [2, 1, 5, 7]
 *                         2         2
 * heapify(0, n-3) =>    1     =>  1          a = [2, 1, 5, 7]
 *
 * swap(0, n-3)    =>                         a = [1, 2, 5, 7]
 *
 * @author ikumen@gnoht.com
 */
public class HeapSort {

  /* Build the initial heap and satisfies the heapify property max at 0-th index */
  static <T extends Comparable<T>> void buildHeap(T[] items) {
    int i = (items.length / 2) - 1;
    while (i >= 0) {
      heapify(items, i, items.length);
      i--;
    }
  }

  /**
   * Sort by using heapify property to find max, then swap it to end, the heapify
   * again but on smaller sub-array.
   * @param items
   * @param <T>
   */
  static <T extends Comparable<T>> void sort(T[] items) {
    // Get our initial heap and max item at 0-th index
    buildHeap(items);
    for (int i=items.length-1; i > 0; i--) {
      swap(items, 0, i);
      heapify(items, 0, i);
    }
  }

  /* Shift up the max item not including end (our last max) */
  static <T extends Comparable<T>> void heapify(T[] items, int i, int end) {
    int left = (i * 2) + 1;
    int right = left + 1;
    int maxIndex = i;

    if (left < end && items[maxIndex].compareTo(items[left]) == -1)
      maxIndex = left;
    if (right < end && items[maxIndex].compareTo(items[right]) == -1)
      maxIndex = right;
    if (maxIndex != i) {
      swap(items, maxIndex, i);
      heapify(items, maxIndex, end);
    }
  }

  static <T extends Comparable<T>> void swap(T[] items, int i, int k) {
    T tmp = items[i];
    items[i] = items[k];
    items[k] = tmp;
  }

}
