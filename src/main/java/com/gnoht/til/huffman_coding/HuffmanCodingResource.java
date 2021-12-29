package com.gnoht.til.huffman_coding;

import com.gnoht.til.datastructures.Heap;
import com.gnoht.til.datastructures.Queue;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

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

  public static void main(String[] args) {
    String s = "taaaaaaggcccc";
    HuffmanCodingResource huff = new HuffmanCodingResource();
    Map<Character, Integer> charCounts = huff.getCharCounts(s);
    HuffmanTreeNode huffmanTree = huff.buildHuffmanTree(charCounts);
    Queue<HuffmanTreeNode> queue = new Queue<>();
    queue.enqueue(huffmanTree);
    while (queue.size() > 0) {
      System.out.println("------");
      int lvlSize = queue.size();
      while (lvlSize-- > 0) {
        HuffmanTreeNode node = queue.dequeue();
        System.out.print(node.ch + "  ");
        if (node.left != null)
          queue.enqueue(node.left);
        if (node.right != null)
          queue.enqueue(node.right);  
      }
      System.out.println();
    }   
    Map<Character, String> table = huff.buildEncodingTable(huffmanTree);         
    System.out.println("-------");
    for (Entry<Character, String> e : table.entrySet())
      System.out.println(e.getKey() + "==" + e.getValue());

    Map<Character, String> encodingTable = huff.buildEncodingTable(s);
    StringBuilder encoding = new StringBuilder();
    for (char c : s.toCharArray()) {
      encoding.append(encodingTable.get(c));
    }

    System.out.println(encoding.toString());

  }

  Map<Character, String> buildEncodingTable(String s) {
    Map<Character, Integer> charCounts = getCharCounts(s);
    HuffmanTreeNode huffmanTree = buildHuffmanTree(charCounts);
    return buildEncodingTable(huffmanTree);
  }

  Map<Character, String> buildEncodingTable(HuffmanTreeNode huffmanTree) {
    return buildEncodingTable(huffmanTree, new HashMap<>(), "");
  }

  /**
   * Return map of characters to prefix codes.
   * @param huffmanTreeNode
   * @param codes
   * @param code
   * @return
   */
  Map<Character, String> buildEncodingTable(HuffmanTreeNode huffmanTreeNode, Map<Character, String> codes, String code) {
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

  /**
   * Return a prefix tree of our characters.
   * @param charCounts
   * @return
   */
  HuffmanTreeNode buildHuffmanTree(Map<Character, Integer> charCounts) {
    Heap<HuffmanTreeNode> heap = Heap.minHeap();
    charCounts.forEach((ch, priority) -> heap.push(new HuffmanTreeNode(ch, priority)));

    HuffmanTreeNode tree = null;
    while (!heap.isEmpty()) {
      HuffmanTreeNode left = heap.pop();
      HuffmanTreeNode right = heap.pop();
      tree = new HuffmanTreeNode(left.priority + right.priority, left, right);
      if (heap.isEmpty()) break;
      heap.push(tree);
    }

    return tree;
  }

  /**
   * Return a map of characters to frequency counts.
   * @param s text corpus to analyze
   * @return
   */
  Map<Character, Integer> getCharCounts(String s) {
    Map<Character, Integer> charCounts = new HashMap<>();
    for (char c : s.toCharArray()) {
      charCounts.put(c, charCounts.getOrDefault(c, 0) + 1);
    }
    return charCounts;
  }

  static class HuffmanTreeNode implements Comparable<HuffmanTreeNode> {
    final int priority;
    char ch;
    HuffmanTreeNode left;
    HuffmanTreeNode right;

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

}
