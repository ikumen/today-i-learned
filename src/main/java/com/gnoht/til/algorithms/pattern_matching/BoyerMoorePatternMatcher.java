package com.gnoht.til.algorithms.pattern_matching;

import java.util.HashMap;
import java.util.Map;

/**
 * Boyer-Moore implementation of text to pattern substring matching.
 *
 * @author ikumen@gnoht.com
 */
public class BoyerMoorePatternMatcher {

  /**
   * Return the 0-based index of where pattern was found in text, otherwise -1.
   * @param text
   * @param pattern
   * @return
   */
  static int indexOf(String text, String pattern) {
    if (pattern.length() == 0)
      return 0;

    Map<Character, Integer> charTable = makeCharTable(pattern);
    int[] offsetTable = makeOffsetTable(pattern);

    int i = pattern.length() - 1; // text pointer
    while (i < text.length()) {
      int k = pattern.length() - 1; // pattern pointer
      while (pattern.charAt(k) == text.charAt(i)) {
        if (k == 0) return i;
        i--;
        k--;
      }
      i += Math.max(offsetTable[pattern.length() - 1 - k], charTable.getOrDefault(text.charAt(i), pattern.length()));
    }
    return -1;
  }

  static Map<Character, Integer> makeCharTable(String pattern) {
    Map<Character, Integer> table = new HashMap<>();
    for (int i = 0; i < pattern.length(); ++i) {
      table.put(pattern.charAt(i), pattern.length() - 1 - i);
    }
    return table;
  }

  static int[] makeOffsetTable(String pattern) {
    int[] table = new int[pattern.length()];
    int lastPrefixPosition = pattern.length();
    for (int i = pattern.length(); i > 0; --i) {
      if (isPrefix(pattern, i)) {
        lastPrefixPosition = i;
      }
      table[pattern.length() - i] = lastPrefixPosition - i + pattern.length();
    }
    for (int i = 0; i < pattern.length() - 1; ++i) {
      int slen = suffixLength(pattern, i);
      table[slen] = pattern.length() - 1 - i + slen;
    }
    return table;
  }

  static boolean isPrefix(String pattern, int p) {
    for (int i=p, j=0; i < pattern.length(); i++, j++) {
      if (pattern.charAt(i) != pattern.charAt(j))
        return false;
    }
    return true;
  }

  static int suffixLength(String pattern, int p) {
    int len = 0;
    int i = p;
    int j = pattern.length() - 1;
    while (i >= 0 && pattern.charAt(i) == pattern.charAt(j)) {
      len++;
      i--;
      j--;
    }
    return len;
  }
}
