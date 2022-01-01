package com.gnoht.til.algorithms.pattern_matching;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.IntStream;

/**
 * @author ikumen@gnoht.com
 */
public class RabinKarpPatternMatcher {
  static final int M = 113; // modulus
  static final int B = 256; // base

  private final int[] bases;
  private final String pattern;

  public RabinKarpPatternMatcher(String pattern) {
    this.pattern = pattern;
    this.bases = buildBaseTable(pattern.length());
  }

  private int[] buildBaseTable(int n) {
    return IntStream.range(0, n)
        .map(i -> (int)(Math.pow(B, n-i-1) % M))
        .toArray();
  }

  private int hash(String s, int start, int end) {
    return IntStream.range(start, end)
        .map(i -> ((s.charAt(i) % M) * this.bases[i]) % M)
        .sum() % M;
  }

  private int rollHash(int prevHash, char prevCh, char nextCh) {
    int hash = prevHash - (prevCh * this.bases[0]) % M;
    return (((hash * B) % M) + nextCh) % M;
  }

  private boolean isEqual(String text, int offset) {
    if (pattern.length() + offset > text.length()) {
      return false;
    }
    for (int i = 0; i < this.pattern.length(); i++) {
      if (this.pattern.charAt(i) != text.charAt(offset + i)) {
        return false;
      }
    }
    return true;
  }

  public List<Integer> find(String text) {
    List<Integer> results = new ArrayList<>();
    int pLen = pattern.length();
    int pHash = hash(pattern, 0, pLen);
    int tHash = hash(text, 0, pLen);

    int i = 0;
    while (true) {
      if (pHash == tHash && isEqual(text, i))
        results.add(i);

      i += 1;
      if (i > text.length()-pLen)
        break;

      tHash = rollHash(tHash, text.charAt(i-1), text.charAt(i + pLen-1));
    }
    return results;
  }


  public static void main(String[] args) {
    String text = "If the substrings in question are long, this algorithm achieves great savings compared with many other hashing schemes. Theoretically, there exist other algorithms that could provide convenient recomputation, e.g. multiplying together ASCII values of all characters so that shifting substring would only entail dividing the previous hash by the first character value, then multiplying by the new last character's value. The limitation, however, is the limited size of the integer data type and the necessity of using modular arithmetic to scale down the hash results, (see hash function article). Meanwhile, naive hash functions do not produce large numbers quickly, but, just like adding ASCII values, are likely to cause many hash collisions and hence slow down the algorithm. Hence the described hash function is typically the preferred one in the Rabin–Karp algorithm If the substrings in question are long, this algorithm achieves great savings compared with many other hashing schemes";
    String pattern = "hashing schemes";
    RabinKarpPatternMatcher rk = new RabinKarpPatternMatcher(pattern);
    List<Integer> results = rk.find(text);
    System.out.println(results.size() + " = " + Arrays.toString(results.toArray()));
  }
}
