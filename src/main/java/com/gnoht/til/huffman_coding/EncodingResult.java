package com.gnoht.til.huffman_coding;

import java.util.Map;

/**
 * @author ikumen@gnoht.com
 */
public class EncodingResult {
  final String value;
  final Map<Character, String> encodingTable;

  public EncodingResult(String value, Map<Character, String> encodingTable) {
    this.value = value;
    this.encodingTable = encodingTable;
  }

  public String getValue() {
    return value;
  }

  public Map<Character, String> getEncodingTable() {
    return encodingTable;
  }
}
