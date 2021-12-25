package com.gnoht.til.markov_chain;

import java.util.*;

/**
 * @author ikumen@gnoht.com
 */
public class SimpleMarkovTextGenerator {

  final Map<String, List<Character>> model;

  public SimpleMarkovTextGenerator(String corpus, int ngramSize) {
    this.model = buildModel(corpus, ngramSize);
  }

  /**
   * Tokenize (e.g, split) given corpus into array of character tokens.
   * @param corpus text corpus to tokenize
   * @return array of character tokens or empty array
   */
  char[] tokenize(String corpus) {
    if (corpus == null)
      return new char[]{};

    return corpus.toLowerCase()                            // lowercase everything
        .replaceAll("[.!\\-',?\n]", " ") // remove punctuation
        .replaceAll("\\s+", " ")         // trim to single space
        .trim()
        .toCharArray();
  }

  Map<String, List<Character>> buildModel(String corpus, int ngramSize) {
    char[] characters = tokenize(corpus);
    return buildModel(characters, ngramSize);
  }

  /**
   * Return a simple Map representing a Markov model of n-grams to next character.
   * @param characters tokens to build n-grams from
   * @param ngramSize size of n-grams to build
   * @return
   */
  Map<String, List<Character>> buildModel(char[] characters, int ngramSize) {
    Map<String, List<Character>> model = new HashMap<>();
    for (int i=0; i < characters.length-ngramSize; i++) {
      String ngram = String.copyValueOf(characters, i, ngramSize);
      char nextChar = characters[i + ngramSize];
      if (model.containsKey(ngram)) {
        model.get(ngram).add(nextChar);
      } else {
        model.put(ngram, new ArrayList<>(Arrays.asList(nextChar)));
      }
    }
    return model;
  }

  /**
   * Generate text from the model.
   * @param ngram the starting n-gram
   * @param len the length of text to generate
   * @return
   */
  String generate(String ngram, int len) {
    Random random = new Random();
    StringBuilder sb = new StringBuilder(ngram);
    while (len-- > 0) {
      List<Character> nextLetters = model.get(ngram);
      if (nextLetters == null)
        break;
      char nextLetter = nextLetters.get(random.nextInt(nextLetters.size()));
      sb.append(nextLetter);
      ngram = ngram.substring(1) + nextLetter;
    }
    return sb.toString();
  }

  public static void main(String[] args) {
    String text = "I am Sam Sam I am That Sam-I-am! That Sam-I-am! I do not like that Sam-I-am!";
    int ngramSize = 2;
    String start = "i ";
    int length = 30;
    SimpleMarkovTextGenerator markov = new SimpleMarkovTextGenerator(text, ngramSize);
    System.out.println(markov.generate(start, length));
    System.out.println(markov.generate(start, length));
    System.out.println(markov.generate(start, length));
  }

}
