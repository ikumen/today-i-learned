package com.gnoht.til.sorting;

import java.util.*;

/**
 * Bucket Sort
 *
 * A sorting algorithm that puts items into an array of buckets based
 * items hash, each bucket is then sorted (with an external sorting scheme),
 * then original items array is repopulated with sorted items from each bucket.
 *
 * Runtime: best,avg=O(n)   worst=O(n log(n))
 *
 * Usage:
 *  - input data is uniformly distributed
 *  - items must be hashable in away that hash output and buckets are ordered,
 *    if x < y, then bucket[hash(x)] < bucket[hash(y)]
 *
 * Algorithm:
 *  - create list of buckets (e.g. usually # buckets == # items)
 *  - hash each item into respective buckets
 *  - sort each bucket that is > 1 size
 *  - repopulate origin array
 *
 * @author ikumen@gnoht.com
 */
public class BucketSort {

  static void sort(int[] items) {
    int numBuckets = items.length;
    int maxKey = getMaxKeyValue(items);
    List<Integer>[] buckets = createBuckets(numBuckets + 1);

    for (int item : items) {
      int key = hash(item, numBuckets, maxKey);
      buckets[key].add(item);
    }

    int i = 0;
    for (List<Integer> bucket: buckets) {
      Collections.sort(bucket);
      for (int item: bucket) {
        items[i++] = item;
      }
    }
  }

  static int hash(int item, int numBuckets, int maxKey) {
    return (int) Math.floor((item * numBuckets) / maxKey);
  }

  static int getMaxKeyValue(int[] items) {
    int max = items[0];
    for (int i=1; i < items.length; i++) {
      max = Math.max(max, items[i]);
    }
    return max;
  }

  static List<Integer>[] createBuckets(int n) {
    List<Integer>[] buckets = new ArrayList[n];
    for (int i=0; i < buckets.length; i++)
      buckets[i] = new ArrayList<>();
    return buckets;
  }

}
