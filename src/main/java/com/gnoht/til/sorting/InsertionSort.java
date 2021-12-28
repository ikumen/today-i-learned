package com.gnoht.til.sorting;

/**
 * Insertion sort.
 *
 * An in-place comparison-based sorting algorithm that shifts current item
 * to left as it iterates through each item.
 *
 * Runtime: best=O(n) avg,worst=O(n^2)
 *
 * Use:
 *  - few items to sort
 *  - items semi-sorted
 *
 * Algorithm:
 *  - iterate from 1...n-1, for each item
 *    - shifting the item left while item < left
 *
 * @author ikumen@gnoht.com
 */
public class InsertionSort {
  /**
   *
   * @param items
   */
  public static <T extends Comparable<T>> void sort(T[] items) {
    for (int i=1; i < items.length; i++) {
      // each item, shift left while items to left are >
      shiftInsert(items, i, items[i]);
    }
  }

  static <T extends Comparable<T>> void shiftInsert(T[] items, int pos, T value) {
    int i = pos - 1;
    while (i >= 0 && items[i].compareTo(value) == 1) {
      items[i + 1] = items[i];
      i = i - 1;
    }
    items[i + 1] = value;
  }

}
