package com.gnoht.til.bloom_filters;

import java.util.BitSet;
import java.util.stream.IntStream;

/**
 * Simple implementation of <a href="https://en.wikipedia.org/wiki/Bloom_filter">bloom filter</a>.
 * Note: this implementation is not thread safe, just for demonstration.
 */
public class BloomFilter {

  private BitSet bitSet;
  private final int size;
  private final HashFunction[] hashFunctions;
  private int items;

  /**
   * Construct a bloom filter with given number of bits and hash functions.
   * @param size 
   * @param numHashFunctions
   */
  public BloomFilter(int size, int numHashFunctions) {
    this.size = size;
    this.bitSet = new BitSet(size);
    this.hashFunctions = initHashFunctions(numHashFunctions);
  }

  /**
   * Add one or more string values to the bloom filter. Silently ignores null
   * values.
   * @param values
   */
  public void add(String ... values) {
    if (values == null) 
      return;

    for (String value : values) {
      if (value == null) continue;
      for (HashFunction hashFunction : hashFunctions) {
        int key = hashFunction.hash(value);
        bitSet.set(key);
      }
      items += 1;
    }
  }

  /**
   * Return the current false positive rate of the bloom filter given its
   * size, current number of items, and number of hash functions.
   * @see: Using formula from: https://hur.st/bloomfilter/
   * @return 
   */
  public double getFalsePositiveRate() {
    int k = hashFunctions.length;
    double prob = Math.pow(1 - Math.exp(-k / (double) (size / items)), k) * 100;
    return Math.round(prob * 1000.0) / 1000.0;
  }

  /**
   * Return false with absolute certainty if item is not in filter, otherwise
   * true (with possibility of a false positive). 
   * @see #getFalsePositiveRate()
   * 
   * @param value to test if in filter
   * @return boolean indicating if filter contains value
   */
  public boolean contains(String value) {
    for (HashFunction hashFunction : hashFunctions) {
      int key = hashFunction.hash(value);
      if (!bitSet.get(key)) return false;
    }
    return true;
  }

  /*
   * Generate HashFunctions to use for hashing values to filter 
   */
  private HashFunction[] initHashFunctions(int num) {
    MurMurHash h1 = new MurMurHash(17);
    MurMurHash h2 = new MurMurHash(31);
    HashFunction[] functions = IntStream.range(0, num)
      .mapToObj(i -> new HashFunction() {
        public int hash(String value) {
          return Math.abs(h1.hash(value) + i * h2.hash(value)) % size;
        }
      }).toArray(HashFunction[]::new);
    return functions;
  }

  private interface HashFunction {
    int hash(String value);
  }
}
