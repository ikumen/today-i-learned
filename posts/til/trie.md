---
title: Tries
weight: 100
tags: data-structures
description: An efficient search tree data structure commonly used for information retrieval like string matching and predictive text (e.g. autocomplete)
date: 2021-10-18
---

## Tries

[Tries](https://en.wikipedia.org/wiki/Trie) are search tree data structures used for storage and operations on strings. The strings in a trie are stored by character at each node in the trie, where strings with matching prefixes share a common path of ancestor nodes. Operations on the strings typically involves depth-first traversal of the trie. Tries are often used in string matching algorithms and predictive text (e.g. autocomplete).

<div class="bg-washed-yellow ph2 pv3">
  <div class="mb2">
    Example autocomplete list of countries
  </div>
  <div>
    <input type="text" class="f6" size="40" placeholder="Enter a country name" id="trie-input">
  </div>
  <div class="bg-white" id="trie-output">
  </div>
</div>

<script src="/static/js/trie.js"></script>


### How it works

Strings stored in a trie are stored by character at the node level within the search tree. To visualize this, lets take the following words as an example, `ant`, `ape`, `and`, `an`, `apple`  and represent them in the tree.

![trie diagram](/static/images/trie.png)


Each node in the tree represents a character, and whether the path to it forms a word (denoted by the `*`). Ancestor nodes along the path to a node forms the prefix shared by all of the nodes children. 

prefix | full strings
--- | ---
a | an, and, ant
an | and, ant
ap | ape, apple

Given any prefix, it's easy to list all the possible words that may be form from it (i.e, like an autocomplete) by simply returning the subtree at the given prefix. 

Now that we have an idea for the general structure of a trie, lets walk through a simple implementation&mdash;one that can support the autocomplete function above.

#### Trie operations

Our implementation will support the following operations.

* `add(s)` add strings to the trie
* `remove(s)` allow removing strings from the trie
* `contains(s) -> bool` support finding a string or it's prefix in the trie
* `withPrefix(prefix) -> list` return list of strings with given prefix

#### Nodes

We'll need a data structure to represent the nodes in the tree. At a minimum the node needs to represent the stored character, a boolean flag indicating if it forms a complete string, and links to child nodes. 

```java
class TrieNode {
  static class TrieNode {
    Map<Character, TrieNode> children;
    boolean isComplete;

    TrieNode() {
      children = new HashMap<>();
      isComplete = false;  
    }
  }
}
```

The node itself does not contain the character it represents, that is inferred by the reference to the node. Next, we implement the `add(string)` operation, a depth-first traversal for each character down the tree, adding nodes along the way if one does not exists for the character. For the last character, we mark the node as "complete" to represent a complete path of a string.

```java
void add(String s) {
  add(s, 0);
}

/
private void add(String s, int i) {
  // if our pointer still valid
  if (i < s.length()) {
    // grab character for current pointer, create if not exists
    char ch = s.charAt(i);
    TrieNode node = children.get(ch);
    if (node == null) {
      node = new TrieNode();
      children.put(ch, node);
    }
    // if last character in string, mark this node "complete" to indicate
    // the path from root to this current node denotes a full string
    if (i == s.length()-1) {
      node.isComplete = true;
    } else {
      // otherwise continue traversing down tree with next character in string
      node.add(s, i+1);
    }
  }
}
```

Next we'll implement `withPrefix(prefix)` operation, where given a prefix the trie will return a list of all strings with the given prefix.

```java
Collection<String> withPrefix(String prefix) {
  return withPrefix(prefix, 0);
}

private Collection<String> withPrefix(String prefix, int i) {
  TrieNode node = this;
  // First we traverse down the tree until we are at the same
  // node as the given prefix
  while (i < prefix.length()) {
    if (!node.children.containsKey(prefix.charAt(i)))
      return Collections.emptyList();
    node = node.children.get(prefix.charAt(i));
    i += 1;
  }
  
  return findCompleteStringInTree(node, prefix, new ArrayList<>());
}

private Collection<String> findCompleteStringInTree(
    TrieNode node, String prefix, Collection<String> results) 
{
  // Recursively (e.g. dfs) traverse down the tree, any time we
  // encounter a node that represents a complete string, add it
  // to our list of strings
  if (node.isComplete) {
    results.add(prefix);
  }

  // Continue traversing down the tree, update the prefix to include
  // this character of each sub-tree we are traversing
  node.children.forEach((ch, n) -> 
    findCompleteStringInTree(n, prefix + ch, results));

  return results;
}
```

That's it for a brief introduction to tries. The complete [source for the Java implementation](https://github.com/ikumen/today-i-learned/tree/main/src/main/java/com/gnoht/til/datastructures/Trie.java), and the [JavaScript demo source](https://github.com/ikumen/today-i-learned/blob/main/src/main/resources/META-INF/resources/static/js/trie.js) can all be found on [my GitHub repo](https://github.com/ikumen/today-i-learned).





