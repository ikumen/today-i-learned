---
title: Huffman Coding
tags: algorithms, prefix-code, lossless
description: Huffman coding is an algorithm for lossless compression of data, this post is a brief introduction to the algorithm with a nice demo
---

## Huffman Coding

Huffman coding is an algorithm for lossless compression of data. 

<div class="w-100">
  <textarea id="data" class="w-100 mb2" maxlength="10000" rows="5" placeholder="Paste in some text to encode"></textarea><br/>
  <button id="encode-btn">encode</button> <button id="clear-btn">clear</button>
</div>
<div class="tr fw5">Results</div>
<div class="w-100 mt2 pa2 f7 bg-washed-yellow">
  <div id="encoding">Encoding: <p></p></div>
  <div id="encoding-table">Code Table: <p></p></div>
  <div id="stats">
  Original bits: <br/>
  Encoded bits:
  </div>
</div>

<script src="/static/js/huffman-coding.js"></script>


### How it works

Huffman coding analyzes source data and generates a new encoding scheme that is more specific to the data, usually this results in a smaller code representation of the original data. Data in this context can be anything (e.g, text, audio, photo, ...), but it's common for text data to have the least efficient encoding scheme and benefits the most from compressing. We will use text data in our examples.

To understand how Huffman coding works, we need to think about how data is represented on a computer. At the lowest level, all data can be reduced to a bit, consisting of two states, 0 or 1. From there, we can logically group bits to form additional data types. For example, 8 bits grouped together is commonly called a byte, consisting of 256 (2^8) possible states.

Encoding schemes have been established to define how data can be mapped to bits. One such [encoding scheme is US-ASCII](https://en.wikipedia.org/wiki/ASCII), it maps the English alphabet and common symbols to a fixed-width of 8 bits. Let's take a look at how "abcdef" would be encoded in ASCII as bits.

```java
String text = "abcdef";
String textInBinary = text.chars()
        .mapToObj(Integer::toBinaryString)
        .map(s -> s.length() < 8 ? '0' + s : s) // Java removes leading 0
        .collect(Collectors.joining(" "));

System.out.println(textInBinary);
```
```bash
> 01100001 01100010 01100011 01100100 01100101 01100110
```

Each of the 6 characters is represented by 8 bits, a = 01100001, b = 01100010, and so on, for a total 48 bits. What's the advantage of an encoding scheme like US-ASCII? It makes decoding very simple, we just count off 8 bits to get our code, and then look up the corresponding character. How can we improve this? What if we used variable width codes to save on bits.

```java
Map<Character, String> customEncodingTable =
    Map.of(
      'a', "0",   // only 1 bit
      'b', "1",   // only 1 bit
      'c', "01",  // 2 bits
      'd', "10",  // 2 bits
      'e', "11"   // 2 bitsts
      'f', "001"  // 3 bits
    );

  textInBinary = text.chars()
    .mapToObj(c -> customEncodingTable.get((char) c))
    .collect(Collectors.joining(" "));

System.out.println(textInBinary);
```
```bash
> 0 1 01 10 11 001
```

At first glance this seems great, we went from 48 bits to 11 bits, in practice though, variable width codes can be very ambiguous. How would you decode the following code using our `customEncodingTable` above:

```bash
> 0110
```

Here are some valid values: abba, cd, abd, cba, and aea, which one is correct?

Another issue is how do we decide which characters are mapped to the shorter codes and which to the longer ones. In our `customEncodingTable`, `a` and `b` codes are only 1 bit long, whereas the code for `f` is 3 bits long.

The current `customEncodingTable` is great if we were to encode a text like "aaaaa".

```java
textInBinary = "aaaaa".chars()
    .mapToObj(c -> customEncodingTable.get((char) c))
    .collect(Collectors.joining());

System.out.println(textInBinary);
```
```bash
> 00000
```
But what if we swap the codes for `a` and `f`?

```java
customEncodingTable.put('a', "001");
customEncodingTable.put('f', "0");

textInBinary = "fffff".chars()
    .mapToObj(c -> customEncodingTable.get((char) c))
    .collect(Collectors.joining());

System.out.println(textInBinary);
```
```bash
> 001001001001001
```

As expected the encoding result is much longer now, thus the process for mapping characters to codes need special consideration. 

To recap, fixed-width encoding like US-ASCII can be inefficient, and variable-width encoding is a possible solution but with two problems:
1. how to handle ambiguity (e.g, where one code ends and another starts)
2. how to map most frequent data to short codes, and less frequent data to longer codes

Huffman coding can produce variable-width encoding and address both issues above, using the idea of a Huffman tree to produce the encoding table. 

Huffman trees are binary trees where the leaf nodes represent a data value (in our case, a character since we are working with text data), and the path from root to each leaf represents the encoding. Traversing left or right down subtrees gets an encoding of either 0 or 1 depending on our scheme.

```bash
 example Huffman tree
     *              a = 0
  0/   \1           b = 10
  a     *           c = 11
      0/  \1
      b   c 
```

To generate a Huffman tree we will use a priority queue, specifically a min heap as we will build the tree bottom up with the less frequent data values as leaf nodes on the bottom of the tree. Again the farther down the tree, the longer the encoding.



```java
String text = "You have brains in your head. You have feet i your " +
    "shoes. You can steer yourself any direction you choose. You're " +
    "on your own. And you know what you know. And you are the guy " +
    "who'll decide where to go."



```



