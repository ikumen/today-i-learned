package com.gnoht.til.sorting;

import java.util.Arrays;
import java.util.Random;

/**
 * Quick Sort
 *
 * An in-place divide-and-conquer sorting implementation that divides the
 * problem into two sub-problems around a pivot, where each sub-problem
 * is contains all values greater or less than the pivot.
 *
 * Runtime: best,avg=O(nlog(n))  worst=O(n^2)
 *
 * Usage: if good average runtime is desired
 *
 * Algorithm:
 *  - select a pivot
 *  - partition items < pivot to left and items > pivot to right
 *  - recursively solve for each left and right sub-problem
 *
 * @author ikumen@gnoht.com
 */
public class QuickSort {

  static <T extends Comparable<T>> void sort(T[] items) {
    sort(items, 0, items.length-1);
  }

  static <T extends Comparable<T>> void sort(T[] items, int left, int right) {
    if (left >= right)
      return;

    int pivot = partition(items, left, right);
    sort(items, left, pivot-1);
    sort(items, pivot+1, right);
  }

  /**
   * Partition items from left to right into sub-partitions and return
   * the pivot between the two partitions.
   *
   * @param items
   * @param left
   * @param right
   * @param <T>
   * @return
   */
  static <T extends Comparable<T>> int partition(T[] items, int left, int right) {
    int p = selectPivot(items, left, right);
    T pivot = items[p];

    // move pivot to end
    swap(items, p, right);

    // move all items <= pivot to left
    int k = left; // index to store next item < pivot
    for (int i=left; i < right; i++) {
      if (items[i].compareTo(pivot) <= 0) {
        swap(items, k, i);
        k++;
      }
    }

    // move pivot to last item that is <= pivot
    swap(items, k, right);
    return k;
  }

  static <T extends Comparable<T>> void swap(T[] items, int i, int k) {
    T tmp = items[i];
    items[i] = items[k];
    items[k] = tmp;
  }

  static <T extends Comparable<T>> int selectPivot(T[] items, int lo, int hi) {
    return lo;
  }

}
