package com.gnoht.til.datastructures;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 
 */
public class Trie {

  private TrieNode root;

  public Trie() {
    root = new TrieNode();
  }

  public Trie(Collection<String> slist) {
    this();
    addAll(slist);
  }

  public void add(String s) {
    root.add(s);
  }

  public void addAll(Collection<String> slist) {
    slist.forEach(this::add);
  }

  public void remove(String s) {
    root.remove(s);
  }

  public boolean contains(String s) {
    return root.contains(s);
  }

  public Collection<String> withPrefix(String prefix) {
    return root.withPrefix(prefix);
  }

  static class TrieNode {
    Map<Character, TrieNode> children;
    boolean isComplete;

    TrieNode() {
      children = new HashMap<>();
      isComplete = false;  
    }

    /**
     * Add the given string to the current node starting from beginning of string.
     * @param s
     */
    void add(String s) {
      add(s, 0);
    }

    /**
     * Add the given string to current node starting at given index.
     * @param s
     * @param i
     */
    private void add(String s, int i) {
      if (i < s.length()) {
        char ch = s.charAt(i);
        TrieNode node = children.get(ch);
        if (node == null) {
          node = new TrieNode();
          children.put(ch, node);
        }

        if (i == s.length()-1) {
          node.isComplete = true;
        } else {
          node.add(s, i+1);
        }
      }
    }

    void remove(String s) {
      remove(s, 0);
    }

    private boolean remove(String s, int i) {
      if (i < s.length()) {
        char ch = s.charAt(i);
        boolean isEmpty = children.get(ch).remove(s, i+1);
        if (isEmpty && children.size() == 1) {
          children.remove(ch);
          if (isComplete) {
            return true;
          }
        }
        return false;
      } else if (isComplete) {
        if (children.size() == 0) {
          return true;
        } else {
          isComplete = false;
        }
      }
      return false;
    }

    boolean contains(String s) {
      return contains(s, 0);
    }

    private boolean contains(String s, int i) {
      if (i < s.length()) {
        return children.containsKey(s.charAt(i))
          && children.get(s.charAt(i)).contains(s, i+1);
      }
      return true;
    }

    /**
     * Return list of complete strings with given prefix.
     * 
     * @param prefix string to match
     * @return list of complete strings or empty list
     */
    Collection<String> withPrefix(String prefix) {
      return withPrefix(prefix, 0);
    }

    private Collection<String> withPrefix(String prefix, int i) {
      TrieNode node = this;
      while (i < prefix.length()) {
        if (!node.children.containsKey(prefix.charAt(i)))
          return Collections.emptyList();
        node = node.children.get(prefix.charAt(i));
        i += 1;
      }
      return findCompleteStringInTree(node, prefix, new ArrayList<>());
    }

    /**
     * Dfs down the tree, adding each node to results if it's the node
     * represents a complete string. For each children sub-tree we traverse
     * update the prefix with the corresponding character.
     * 
     * @param node root/target node of current sub-tree
     * @param prefix current prefix at this node
     * @param results list of complete strings found
     * @return list of passed in strings, returned for convenience
     */
    private Collection<String> findCompleteStringInTree(TrieNode node, String prefix, Collection<String> results) {
      if (node.isComplete) {
        results.add(prefix);
      }

      node.children.forEach((ch, n) -> 
        findCompleteStringInTree(n, prefix + ch, results));

      return results;
    }

    @Override
    public String toString() {
      StringBuilder sb = new StringBuilder();
      sb.append("TrieNode {")
          .append("isComplete=").append(isComplete)
          .append(", children=")
          .append(children.entrySet().stream()
            .map((e) -> "{" + e.getKey() + "=" + e.getValue() + "}")
            .collect(Collectors.joining(", ", "[", "]")));
      return sb.toString();            
    }
  }


  public static void main(String[] args) {
    Trie trie = new Trie(
      Arrays.asList(
        "foo",
        "foobar",
        "food",
        "foot",
        "an",
        "ant",
        "app",
        "apple"
      ));

    System.out.println(trie.contains("foobar"));
    System.out.println(trie.contains("fool"));

    System.out.println("foo----");
    trie.withPrefix("foo").forEach(System.out::println);
    System.out.println("fool----");
    trie.withPrefix("fool").forEach(System.out::println);
    System.out.println("fo----");
    trie.withPrefix("fo").forEach(System.out::println);

  }
}

