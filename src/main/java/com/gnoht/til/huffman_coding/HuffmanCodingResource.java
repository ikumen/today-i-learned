package com.gnoht.til.huffman_coding;

import com.gnoht.til.datastructures.Heap;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.IntStream;

@Path("/api/huffman")
public class HuffmanCodingResource {

  @POST
  public EncodingResult encode(String s) {
    Map<Character, String> encodingTable = buildEncodingTable(s);
    StringBuilder encoding = new StringBuilder();
    for (char c : s.toCharArray()) {
      encoding.append(encodingTable.get(c));
    }

    return new EncodingResult(encoding.toString(), encodingTable);
  }

  Map<Character, String> buildEncodingTable(String s) {
    Map<Character, Integer> charCounts = getCharCounts(s);
    Node huffmanTree = buildHuffmanTree(charCounts);
    return buildEncodingTable(huffmanTree);
  }

  Map<Character, String> buildEncodingTable(Node huffmanTree) {
    return buildEncodingTable(huffmanTree, new HashMap<>(), "");
  }

  Map<Character, String> buildEncodingTable(Node huffmanTreeNode, Map<Character, String> codes, String code) {
    if (huffmanTreeNode.isLeaf()) {
      codes.put(huffmanTreeNode.ch, code);
    } else {
      if (huffmanTreeNode.left != null)
        buildEncodingTable(huffmanTreeNode.left, codes, code + "0");
      if (huffmanTreeNode.right != null)
        buildEncodingTable(huffmanTreeNode.right, codes, code + "1");
    }
    return codes;
  }

  Node buildHuffmanTree(Map<Character, Integer> charCounts) {
    Heap<Node> heap = Heap.minHeap();
    charCounts.forEach((ch, priority) -> heap.push(new Node(ch, priority)));

    Node tree = null;
    while (!heap.isEmpty()) {
      Node left = heap.pop();
      Node right = heap.pop();
      tree = new Node(left.priority + right.priority, left, right);
      if (heap.isEmpty()) break;
      heap.push(tree);
    }

    return tree;
  }

  Map<Character, Integer> getCharCounts(String s) {
    Map<Character, Integer> charCounts = new HashMap<>();
    for (char c : s.toCharArray()) {
      charCounts.put(c, charCounts.getOrDefault(c, 0) + 1);
    }
    return charCounts;
  }

  static class Node implements Comparable<Node> {
    final int priority;
    char ch;
    Node left;
    Node right;

    Node(char ch, int priority) {
      this.ch = ch;
      this.priority = priority;
    }

    Node(int priority, Node left, Node right) {
      this.priority = priority;
      this.left = left;
      this.right = right;
    }

    boolean isLeaf() {
      return left == null && right == null;
    }

    @Override
    public int compareTo(Node o) {
      return Integer.compare(priority, o.priority);
    }
  }

}
