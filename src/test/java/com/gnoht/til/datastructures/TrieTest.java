package com.gnoht.til.datastructures;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.Test;

public class TrieTest {
  
  List<String> testData = Arrays
    .asList(
      "foo",
      "foobar",
      "food",
      "foot",
      "an",
      "ant",
      "app",
      "apple"
    );

  @Test
  public void testAdd() {
    Trie trie = new Trie();
    assertFalse(trie.contains("foo"));

    trie.add("foo");
    assertTrue(trie.contains("foo"));
  }

  @Test
  public void testRemove() {
    Trie trie = new Trie();    
    testData.forEach((s) -> assertFalse(trie.contains(s)));
    testData.forEach(trie::add);
    testData.forEach((s) -> assertTrue(trie.contains(s)));
  }

  @Test
  public void testContains() {
    Trie trie = new Trie();    
    testData.forEach((s) -> assertFalse(trie.contains(s)));
    testData.forEach(trie::add);
    testData.forEach((s) -> assertTrue(trie.contains(s)));
  }

  @Test
  public void testWithPrefix() {
    Trie trie = new Trie(testData);    

    Set<String> results = new HashSet<>(trie.withPrefix("foo"));
    assertEquals(results.size(), 4);
    assertTrue(new HashSet<String>(results).contains("foo"));
    assertFalse(new HashSet<String>(results).contains("fool"));
    assertTrue(new HashSet<String>(results).contains("foobar"));
  }
}
