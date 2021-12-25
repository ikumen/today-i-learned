package com.gnoht.til.markov_chain;

import java.util.*;
import java.util.stream.Collectors;

/**
 * @author ikumen@gnoht.com
 */
public class MarkovTextGenerator<T> {

  final Map<NGram, List<T>> markovModel;
  final Tokenizer<T> tokenizer;
  final int ngramSize;
  final Random random;

  public MarkovTextGenerator(Tokenizer<T> tokenizer, String corpus, int ngramSize) {
    this(tokenizer, corpus, ngramSize, System.currentTimeMillis());
  }

  public MarkovTextGenerator(Tokenizer<T> tokenizer, String corpus, int ngramSize, long seed) {
    this.tokenizer = tokenizer;
    this.ngramSize = ngramSize;
    this.random = new Random(seed);
    this.markovModel = buildModel(corpus);
    if (markovModel.isEmpty()) {
      throw new IllegalArgumentException("Unable to generate model from given corpus: " + corpus);
    }
  }

  private NGram getRandomNGram() {
    List<NGram> ngrams = new ArrayList<>(markovModel.keySet());
    return ngrams.get(random.nextInt(ngrams.size()));
  }

  /**
   * Generate some random text based on this generators model.
   * @param textLen length of text to generate
   * @return
   */
  public String generate(int textLen) {
    return generate(textLen, getRandomNGram());
  }

  /**
   * Generate some random text based on this generators model.
   * @param length length of text to generate
   * @param ngram starting ngram
   * @return
   */
  public String generate(int length, NGram ngram) {
    StringBuilder text = new StringBuilder(ngram.toString());
    while (true) {
      List<T> nextGrams = markovModel.get(ngram);
      /* Make sure we always have a list of "next" grams */
      while (nextGrams == null) nextGrams = markovModel.get(getRandomNGram());
      /* Check if we've generated enough text */
      if (text.length() >= length) break;
      T gram = nextGrams.get(random.nextInt(nextGrams.size()));
      text.append(tokenizer.getDelimiter()).append(gram.toString());
      ngram = ngram.from(gram);
    }
    return text.substring(0, length);
  }

  /**
   * Build the Markov model.
   * @param corpus of text to build model from.
   * @return
   */
  Map<NGram, List<T>> buildModel(String corpus) {
    return buildModel(tokenizer.tokenize(corpus));
  }

  /**
   * Build the Markov model.
   * @param tokens of text to build model from.
   * @return
   */
  Map<NGram, List<T>> buildModel(T[] tokens) {
    Map<NGram, List<T>> model = new HashMap<>();
    for (int i=0; i < tokens.length-ngramSize; i++) {
      int n = i + ngramSize;
      NGram ngram = new NGram(Arrays.copyOfRange(tokens, i, n), tokenizer.getDelimiter());
      if (model.containsKey(ngram)) {
        model.get(ngram).add(tokens[n]);
      } else {
        model.put(ngram, new ArrayList<>(Arrays.asList(tokens[n])));
      }
    }
    return model;
  }


  /**
   * Class representing an n-gram.
   * @param <T>
   */
  public static class NGram<T> {
    final T[] grams;
    final String delim;

    public NGram(T[] grams, String delim) {
      this.grams = grams;
      this.delim = delim;
    }

    /**
     * Helper for generating the next n-gram, by remove the first gram in
     * this ngram and appending the given gram.
     * @param gram
     * @return
     */
    public NGram from(T gram) {
      T[] newGrams = (T[]) new Object[grams.length];
      for (int i=1; i < grams.length; i++)
        newGrams[i-1] = grams[i];
      newGrams[grams.length-1] = gram;
      return new NGram(newGrams, delim);
    }

    @Override
    public boolean equals(Object o) {
      if (this == o) return true;
      if (o == null || getClass() != o.getClass()) return false;
      NGram nGram = (NGram) o;
      return Arrays.equals(grams, nGram.grams);
    }

    @Override
    public int hashCode() {
      int result = 17;
      for (T gram: grams)
        result = 31 * result + gram.hashCode();
      return result;
    }

    @Override
    public String toString() {
      if (grams == null || grams.length == 0)
        return "";
      return Arrays.stream(grams).map(gram -> gram.toString())
          .collect(Collectors.joining(delim));
    }
  }

  /**
   * String corpus character tokenizer.
   */
  public static class StringCorpusCharacterTokenizer implements Tokenizer<Character> {

    /**
     * Tokenize the given corpus into an array of characters.
     * @param corpus
     * @return
     */
    @Override
    public Character[] tokenize(String corpus) {
      if (corpus == null)
        return new Character[]{};
      return corpus.trim()
          .chars()
          .mapToObj(i -> (char) i)
          .toArray(Character[]::new);
    }

    @Override
    public String getDelimiter() {
      return "";
    }
  }

  /**
   * String corpus word tokenizer.
   */
  public static class StringCorpusWordTokenizer implements Tokenizer<String> {
    /**
     * Tokenize the given corpus into an array of words, words are assumed to
     * be deliminated by one or more whitespace characters.
     *
     * @param corpus
     * @return
     */
    @Override
    public String[] tokenize(String corpus) {
      if (corpus == null)
        return new String[]{};
      return corpus.trim()
        .split("\\s+");
    }

    @Override
    public String getDelimiter() {
      return " ";
    }
  }

  /**
   * Tokenizes a given corpus.
   * @param <E>
   */
  public interface Tokenizer<E> {
    E[] tokenize(String corpus);
    String getDelimiter();
  }

}
