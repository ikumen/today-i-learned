package com.gnoht.til.algorithms.pattern_matching;

/**
 * Knuth-Morris-Pratt String Matching Algorithm
 *
 * Runtime: worst=O(n)
 *
 * Algorithm:
 *  - build the longest prefix-suffix lookup table by
 *    - iterate through pattern check if current right-hand suffix is also prefix
 *    - assign length of the prefix/suffix to right-hand index in table
 *    - when prefix != suffix (prefix + next != suffix + next)
 *      - continue if prefix at 0
 *      - else, backtrack to see if previous prefix can match new for example
 *        prefix == suffix + next
 *  - once we have the lps table
 *  - iterate through each character in text and pattern
 *    - when text[t] != pattern[p]
 *      reset using lps table if p not at start
 *    - else keep increasing t and p
 *      - until p == pattern.length
 *
 * @author ikumen@gnoht.com
 */
public class KnuthMorrisPrattPatternMatcher {
  /**
   *
   * @param text
   * @param pattern
   * @return
   */
  static int indexOf(String text, String pattern) {
    int[] lpsTable = preprocessLPSTable(pattern);
    int t = 0; // text index
    int p = 0; // pattern index

    while (t < text.length()) {
      if (pattern.charAt(p) != text.charAt(t)) {
        if (p == 0) { // we're at the beginning, just keep advancing t
          t += 1;
        } else {
          p = lpsTable[p - 1];
        }
      } else {
        t += 1;
        p += 1;
        if (p == pattern.length())
          return t - p;
      }
    }

    return -1;
  }

  /**
   * Build and return the longest prefix-suffix lookup table.
   * @param pattern
   * @return
   */
  static int[] preprocessLPSTable(String pattern) {
    int[] lpsTable = new int[pattern.length()];
    int l = 0;
    int i = 1; // prefix cannot be a single character
    while (i < pattern.length()) {
      // we have start of a matching prefix/suffix
      if (pattern.charAt(i) == pattern.charAt(l)) {
        l += 1;
        lpsTable[i] = l;
        i += 1;
      } else {
        // We don't have a match so the current prefix/suffix ends, but
        // there maybe a new suffix (e.g, shift right just 1) that may
        // match the prefix, so don't reset just decrease length by 1 to
        // see if there is a new matching prefix/suffix
        if (l != 0) {
          l = lpsTable[l - 1];
        } else {
          lpsTable[i] = 0;
          i += 1;
        }
      }
    }
    return lpsTable;
  }

}

