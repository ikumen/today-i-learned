package com.gnoht.til.algorithms.pattern_matching;

/**
 * Brute force implementation of matching text for substrings of a given pattern.
 *
 * @author ikumen@gnoht.com
 */
public class NaivePatternMatcher {

  /**
   * Return the index of the first occurrence at which pattern appears in text.
   * @param text String to search for pattern
   * @param pattern String to find in text
   * @return 0 based index or -1 if no match was found.
   */
  public static int indexOf(String text, String pattern) {
    for (int i=0; i <= text.length()-pattern.length(); i++) {
      int k = 0;
      while (k < pattern.length() && pattern.charAt(k) == text.charAt(i + k))
        k++;
      if (k == pattern.length()) {
        return i;
      }
    }
    return -1;
  }
}
