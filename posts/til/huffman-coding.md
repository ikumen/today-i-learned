---
title: Huffman Coding
tags: algorithms, prefix-code, lossless
description: Huffman coding is an algorithm for lossless compression of data, this post is a brief introduction to the algorithm with a nice demo
---

## Huffman Coding

Huffman coding is an algorithm for generating a prefix code commonly used for lossless data compression. Below is an example of a Huffman coding that can generate binary prefix codes.

<div class="w-100">
  <textarea id="data" class="w-100 mb2" maxlength="10000" rows="5" placeholder="Paste in some text to encode"></textarea><br/>
  <button id="encode-btn">encode</button> <button id="clear-btn">clear</button>
</div>
<div class="tr mt2 fw5">Results</div>
<div class="w-100 mt0 pa2 f7 bg-washed-yellow">
  <div id="encoding">Encoding: <p></p></div>
  <div id="encoding-table">Code Table: <p></p></div>
  <div id="stats">
  </div>
</div>

<script src="/static/js/huffman-coding.js"></script>


### How it works

All data (e.g, text, audio, photos,...) is represented in computing by [bits](https://en.wikipedia.org/wiki/Bit), a bunch of ones and zeros. To make any sense of this data, we have encoding schemes that tell us what a group of bits represents. There are different encoding schemes for different purposes, but for this example we'll focus on [US-ASCII](https://en.wikipedia.org/wiki/ASCII). 

ASCII is a fixed-width encoding scheme [that maps English characters and other symbols](https://www.asciitable.com/) to bits, specifically 8 bits. Let's take a look at some ASCII symbols and their representation in bits.

```java
String text = "abc@?1";
for (char c : text.toCharArray()) {
  String bs = String.format("%8s", Integer.toBinaryString(c)).replace(' ', '0');
  System.out.println(c + " = " + bs);
}
```
```bash
a = 01100001
b = 01100010
c = 01100011
@ = 01000000
? = 00111111
1 = 00110001
```

How many different symbols can be represented with 8 bits? The 8 bits are enough to represent 2^8 or 256 possible symbols. What if we are working with DNA data and only needed 4 symbols, "acgt". Seems like a waste of space to represent just 4 symbols.

```bash
a = 01100001
c = 01100011
g = 01100111
t = 01110100
```

We could make our own fix-width encoding scheme using 2 bits for each symbol.

```bash
a = 00
c = 01
g = 10
t = 11
```

Great, we've reduced the size of each symbol by 75%. What if our DNA sequence contained mostly `a` and very little `t`, or even regular English words [where there's a lot of `e`](https://www.lexico.com/explore/which-letters-are-used-most) but very few occurrences of `q`, could we also take symbol frequency into account to improve our encoding? If we had significantly more occurrences of `a` than `t`, we can use a variable-width encoding scheme.

```bash
a = 0
c = 1
g = 01
t = 10
```

By using a variable-width scheme, we're able to reduce the size of `a` and `c` an additional 50%, and if `a` happened to occur more frequently, we gain additional space savings. But we've also introduce a very big problem. How do we decode the following using our new encoding. 

```bash
010110
```

With a fix-width, we just count off the specific width and do a quick lookup, but with variable-width we have ambiguity. Here are just some of the possible ways to decode the `010110` encoding from above.

```bash
0 1 0 1 1 0   a c a c c a
01 0 1 10     g a c t
0 10 1 10     a t c t
0 1 01 10     a c g t
...
```

So just to recap, here's what we've covered so far:
- a fixed-width general encoding scheme like ASCII is great but it can be inefficient
- we can improve on ASCII with a custom fixed-width scheme, but we don't take into account symbol frequency
- we can improve on a custom fixed-width scheme with variable-width encoding&mdash;taking into account symbol frequencies, but we have the problem of ambiguity

Huffman coding produces variable-width codes while taking into account symbol frequencies and ambiguity. Symbol frequency is pretty simple to handle, preprocess the data, count the frequencies of each symbol and make sure to assign most frequent symbols the shortest codes. How does Huffman coding address ambiguity in the resulting code? 

#### Prefix Tree

Huffman coding builds a prefix tree that accounts for symbol frequency and ensures that a code for a particular symbol is never a prefix for another symbol to handle ambiguity. Lets walk through building a prefix tree for our 4 symbols to demonstrate. We'll use the following data.

```bash
taaaaaaggcccc
```

The first step is to count the frequency of each symbol.

```bash
[ (t,1) (a,6) (g,2) (c,4) ]
```

Next we start to build the prefix tree, specifically we'll build it bottom up so that less frequent symbols are lower in our tree. Also we need to keep the list of symbols sorted in ascending order of frequencies as we are building our tree.

```bash
[ (t,1) (g,2) (c,4) (a,6) ]
```

Then take the two lowest frequency symbols to start the nodes in our prefix tree. The parent node of the two nodes gets assigned a frequency as well (even though it's not a symbol), by adding the two child node frequencies.

```bash
[ (c,4) (a,6) ]

        (,3) * 
           /   \  
          /     \ 
     (t,1)       (g,2)
```

Next we treat the parent node like the other symbols and add it back into the list of symbols, then sort it again.

```bash
[ (,3), (c,4) (a,6) ]
```

Again, take the two lowest, add them as children to a new parent node, and assign the parent a frequency by adding the two child frequencies. As you can see we are slowly building a bigger and bigger subtree of our prefix tree.

```bash
[ (a,6) ]
                 * (,7)
               /   \ 
              /     \
        (,3) *       (c,4)
           /   \  
          /     \ 
     (t,1)       (g,2)
```

Again, treat the new parent node as a symbol and add it back to our list, and sort.

```bash
[ (a,6) (,7) ]
```

Once more, take the two lowest and build another subtree.

```bash
[ ] 
             *
           /   \
          /     \
     (a,6)       * (,7)
               /   \ 
              /     \
        (,3) *       (c,4)
           /   \  
          /     \ 
     (t,1)       (g,2)
```

Since we there are no more symbols in the list, we've completed the prefix tree, but there are no prefix codes yet! Let's see how the codes are added. We simply traverse the tree applying a "0" or "1" along the path to each leaf node, depending on the left or right child we are traversing. 

```bash
[ ] 
             *
           /   \ 
      "0" /     \ "1"
     (a,6)       * (,7)
               /   \  
          "0" /     \ "1"
        (,3) *       (c,4)
           /   \   
      "0" /     \ "1" 
     (t,1)       (g,2)
```

The code for each symbol is the build up of "0"s and "1"s along the path to the a symbol's node. For our 4 symbols and the frequencies they have in our sample data, this is the resulting encoding scheme.

```bash
# Huffman generated encoding scheme
a = 0
c = 11
g = 101
t = 100
```

How does this compare with the custom fixed-width scheme we introduced earlier.

```bash
# custom fixed-width encoding scheme
a = 00
c = 01
g = 10
t = 11

# ASCII
a = 01100001
c = 01100011
g = 01100111
t = 01110100
```

Let's encode the sample data `taaaaaaggcccc` using the two schemes and ASCII.

```bash
Huffman           : 10000000010110111111111
Custom fixed-width: 11000000000000101001010101
ASCII             : 01110100011000010110000101100001011000010110000101100001011001110110011101100011011000110110001101100011
```
Roughly a 10% and 78% improvement over fixed-width and ASCII schemes respectively, but these numbers are not realistic in practice, the sample data is very small. In practice the number of symbols/characters in a body of text would be higher, leading to longer prefix codes (e.g, a deeper tree to maintain unique prefix codes). 

Anyways, that is how Huffman coding works. Let's summarize the steps and walk through a naive implementation. 

Huffman coding steps:

1. build a list of symbol:frequency
1. sort list by frequency
1. extract two lowest frequency symbols from list
  1. build a subtree where two symbols represent left/right child
  1. take subtree, give assign it frequency by adding two child symbol's frequencies
  1. put subtree back into list
  1. sort list by frequency
1. repeat step 3 until list is empty
1. traverse the tree assigning codes along path to each symbol 

For our naive implementation, we'll focus on encoding text character data to string representation of the binary ones and zeros. Before implementing, let's think about the data structures we'll need. 

1. we need a data structure to encapsulate a symbol and frequency that can also behave like a node of the prefix tree, e.g, HuffmanTreeNode
1. we'll need an efficient way to prioritize less frequent HuffmanTreeNode, like a priority queue

Let's define the `HuffmanTreeNode` class.

```java
class HuffmanTreeNode implements Comparable<HuffmanTreeNode> {
  final int priority; 
  char ch;
  Node left;
  Node right;

  HuffmanTreeNode(char ch, int priority) {
    this.ch = ch;
    this.priority = priority;
  }

  HuffmanTreeNode(int priority, HuffmanTreeNode left, HuffmanTreeNode right) {
    this.priority = priority;
    this.left = left;
    this.right = right;
  }

  boolean isLeaf() {
    return left == null && right == null;
  }

  @Override
  public int compareTo(HuffmanTreeNode o) {
    return Integer.compare(priority, o.priority);
  }
}
```

Our first step in the Huffman coding process is to extract the character frequency counts.

```java
class HuffmanCoding {
  /**
   * Return map of character to frequency counts 
   */
  Map<Character, Integer> getCharCounts(String s) {
    Map<Character, Integer> charCounts = new HashMap<>();
    for (char c : s.toCharArray()) {
      charCounts.put(c, charCounts.getOrDefault(c, 0) + 1);
    }
    return charCounts;
  }
}
```

Next, we build the prefix tree.

```java
class HuffmanCoding {
  // Map<Character, Integer> getCharCounts(String s) {...}

  /**
   * Return a prefix tree built from the given characters and their counts.
   * @param charCounts
   * @return
   */
  HuffmanTreeNode buildHuffmanTree(Map<Character, Integer> charCounts) {
    // Use a priority heap to prioritize less frequent nodes
    Heap<HuffmanTreeNode> heap = Heap.minHeap();
    charCounts.forEach((ch, priority) -> heap.push(new HuffmanTreeNode(ch, priority)));

    // Iterate through the heap
    HuffmanTreeNode tree = null;
    while (!heap.isEmpty()) {
      // Take two nodes at a time to build a subtree at the current level
      HuffmanTreeNode left = heap.pop();
      HuffmanTreeNode right = heap.pop();
      tree = new HuffmanTreeNode(left.priority + right.priority, left, right);
      // we're done
      if (heap.isEmpty()) break;
      // else add parent node back onto heap
      heap.push(tree);
    }

    // The finish prefix tree
    return tree;
  }  
}
```

Finally we traverse the prefix tree and build prefix codes for each symbol, storing it in a Map for easy look up.

```java
class HuffmanCoding {
  // Map<Character, Integer> getCharCounts(String s) {...}

  // HuffmanTreeNode buildHuffmanTree(Map<Character, Integer> charCounts) {...}

  /**
   * Return Map of characters to prefix codes.
   */
  Map<Character, String> buildEncodingTable(
      HuffmanTreeNode huffmanTreeNode, 
      Map<Character, String> codes, 
      String code) 
  {
    if (huffmanTreeNode.isLeaf()) {
      // We are at a leaf node, it must be symbol
      codes.put(huffmanTreeNode.ch, code);
    } else {
      if (huffmanTreeNode.left != null)
        // traverse left
        buildEncodingTable(huffmanTreeNode.left, codes, code + "0");
      if (huffmanTreeNode.right != null)
        // traverse right
        buildEncodingTable(huffmanTreeNode.right, codes, code + "1");
    }
    return codes;
  }  
}
```

Let's test our Huffman encoder.

```java
class HuffmanCoding {
  // Map<Character, Integer> getCharCounts(String s) {...}
    
  // HuffmanTreeNode buildHuffmanTree(Map<Character, Integer> charCounts) {...}

  // Map<Character, String> buildEncodingTable(...) {....}

  public static void main(String[] args) {
    String text = "taaaaaaggcccc";
    HuffmanCoding huffman = new HuffmanCoding();
    Map<Character, Integer> charCounts = huffman.getCharCounts(s);
    HuffmanTreeNode huffmanTree = huffman.buildHuffmanTree(charCounts);
    Map<Character, String> encodingTable = huffman.buildEncodingTable(s);

    StringBuilder encoding = new StringBuilder();
    for (char c : s.toCharArray()) {
      encoding.append(encodingTable.get(c));
    }

    System.out.println(encoding.toString());    
  }
}
```
```bash
10000000010110111111111
```

Cool, that's the same encoding we generated manually from above. We've just finished a very naive implementation of Huffman coding. How do we decode the codes back to our original text? I won't go into details here [but some strategies are](https://en.wikipedia.org/wiki/Huffman_coding#Decompression).

- pre-constructed reusable prefix tree
- include the symbols and frequencies as a header of the encoded data (usually not practical due to size)
- include just the prefix tree as a header of the encoded data

Source for [the demo](https://github.com/ikumen/today-i-learned/blob/main/src/main/java/com/gnoht/til/huffman_coding/HuffmanCodingResource.java) and a [more complete implementation](https://github.com/ikumen/today-i-learned/blob/main/src/main/java/com/gnoht/til/huffman_coding/HuffmanCoding.java) can found on [GitHub](https://github.com/ikumen/today-i-learned).





