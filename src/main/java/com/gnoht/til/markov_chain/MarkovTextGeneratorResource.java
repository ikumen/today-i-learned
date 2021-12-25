package com.gnoht.til.markov_chain;

import org.jboss.logging.Logger;

import javax.ws.rs.POST;
import javax.ws.rs.Path;

/**
 * @author ikumen@gnoht.com
 */
@Path("/api/markov")
public class MarkovTextGeneratorResource {

  private static final Logger LOG = Logger.getLogger(MarkovTextGeneratorResource.class);

  @POST
  public Response generate(Request request) {
    LOG.info(request);
    MarkovTextGenerator markov = new MarkovTextGenerator<>(
        getTokenizer(request.getTokenizerType()), request.getCorpus(), request.getNgramSize());
    String results = markov.generate(request.getTextLen());
    return new Response(results);
  }

  private MarkovTextGenerator.Tokenizer<?> getTokenizer(TokenizerType type) {
    if (type == TokenizerType.StringToCharacters)
      return new MarkovTextGenerator.StringCorpusCharacterTokenizer();
    return new MarkovTextGenerator.StringCorpusWordTokenizer();
  }

  public static class Response {
    String text;

    public Response(String text) {
      this.text = text;
    }

    public String getText() {
      return text;
    }

    public void setText(String text) {
      this.text = text;
    }
  }

  public static class Request {
    String corpus;
    TokenizerType tokenizerType;
    int ngramSize;
    int textLen;

    public Request(String corpus, TokenizerType tokenizerType, int ngramSize, int textLen) {
      this.corpus = corpus;
      this.tokenizerType = tokenizerType;
      this.ngramSize = ngramSize;
      this.textLen = textLen;
    }

    public String getCorpus() {
      return corpus;
    }

    public void setCorpus(String corpus) {
      this.corpus = corpus;
    }

    public TokenizerType getTokenizerType() {
      return tokenizerType;
    }

    public void setTokenizerType(TokenizerType tokenizerType) {
      this.tokenizerType = tokenizerType;
    }

    public int getNgramSize() {
      return ngramSize;
    }

    public void setNgramSize(int ngramSize) {
      this.ngramSize = ngramSize;
    }

    public int getTextLen() {
      return textLen;
    }

    public void setTextLen(int textLen) {
      this.textLen = textLen;
    }

    @Override
    public String toString() {
      return "Request {" +
          ", tokenizerType=" + tokenizerType +
          ", ngramSize=" + ngramSize +
          ", textLen=" + textLen +
          '}';
    }
  }

  public enum TokenizerType {
    StringToCharacters, StringToWords;

    public static TokenizerType fromString(String s) {
      return TokenizerType.valueOf(s);
    }
  }
}
