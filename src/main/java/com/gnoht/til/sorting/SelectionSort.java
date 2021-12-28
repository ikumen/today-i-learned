package com.gnoht.til.sorting;

import java.util.Arrays;

/**
 * Selection sort
 *
 * An in-place comparison-based sorting algorithm that iterates through
 * each element and shifts it to the right.
 *
 * Runtime: best,avg,worst=O(n^2)
 *
 * Usage: good for checking if array is already sorted
 *
 * Algorithm:
 *  - iterate through elements 0...n-1
 *  - select largest and move to the right
 *
 *
 * @author ikumen@gnoht.com
 */
public class SelectionSort {
  /**
   *
   * @param items
   */
  public static <T extends Comparable<T>> void sort(T[] items) {
    for (int i=0; i < items.length-1; i++) {
      int minIndex = i;
      for (int k=i+1; k < items.length; k++) {
        if (items[k].compareTo(items[minIndex]) == -1) {
          minIndex = k;
        }
      }

      if (i != minIndex) {
        T tmp = items[i];
        items[i] = items[minIndex];
        items[minIndex] = tmp;
      }
    }
  }

  public static void main(String[] args) {
    Integer[] nums = {32, 9, 1, 10, 8, 7, 21, 0};
    System.out.println(Arrays.toString(nums));
    SelectionSort.sort(nums);
    System.out.println(Arrays.toString(nums));
  }
}
