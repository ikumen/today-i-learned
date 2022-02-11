---
title: Text Generation with Markov Chains 
tags: n-grams, markov-chains, algorithms
description: A gentle introduction to Markov chains and how to use them to generate text
---

# Text Generation with Markov Chains 

A gentle introduction to [Markov Chains](https://en.wikipedia.org/wiki/Markov_chain) and how to use them for generating text.

<div class="w-100">
  <textarea id="corpus" class="w-100 mb0" maxlength="50000" rows="5" placeholder="Paste in your corpus">
Congratulations! Today is your day. You're off to Great Places! You're off and away! You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose. You're on your own. And you know what you know. And YOU are the guy who'll decide where to go. You'll look up and down streets. Look 'em over with care. About some you will say, "I don't choose to go there." With your head full of brains and your shoes full of feet, you're too smart to go down any not-so-good street. And you may not find any you'll want to go down. In that case, of course, you'll head straight out of town. It's opener there in the wide open air.  Out there things can happen and frequently do to people as brainy and footsy as you.  And then things start to happen, don't worry. Don't stew. Just go right along. You'll start happening too. OH! THE PLACES YOU'LL GO! You'll be on y our way up! You'll be seeing great sights! You'll join the high fliers who soar to high heights. You won't lag behind, because you'll have the speed. You'll pass the whole gang and you'll soon take the lead. Wherever you fly, you'll be best of the best. Wherever you go, you will top all the rest. Except when you don't. Because, sometimes, you won't. I'm sorry to say so but, sadly, it's true that Bang-ups and Hang-ups can happen to you. You can get all hung up in a prickle-ly perch. And your gang will fly on. You'll be left in a Lurch. You'll come down from the Lurch with an unpleasant bump. And the chances are, then, that you'll be in a Slump. And when you're in a Slump, you're not in for much fun. Un-slumping yourself is not easily done. You will come to a place where the streets are not marked. Some windows are lighted. But mostly they're darked. A place you could sprain both your elbow and chin! Do you dare to stay out? Do you dare to go in? How much can you lose? How much can you win? And IF you go in, should you turn left or right... or right-and-three-quarters? Or, maybe, not quite? Or go around back and sneak in from behind? Simple it's not, I'm afraid you will find, for a mind-maker-upper to make up his mind. You can get so confused that you'll start in to race down long wiggled roads at a break-necking pace and grind on for miles cross weirdish wild space, headed, I fear, toward a most useless place. The Waiting Place, for people just waiting. Waiting for a train to go or a bus to come, or a plane to go or the mail to come, or the rain to go or the phone to ring, or the snow to snow or the waiting around for a Yes or No or waiting for their hair to grow. Everyone is just waiting. Waiting for the fish to bite or waiting for the wind to fly a kite or waiting around for Friday night or waiting, perhaps, for their Uncle Jake or a pot to boil, or a Better Break or a string of pearls, or a pair of pants or a wig with curls, or Another Chance. Everyone is just waiting. NO! That's not for you! Somehow you'll escape all that waiting and staying You'll find the bright places where Boom Bands are playing. With banner flip-flapping, once more you'll ride high! Ready for anything under the sky. Ready because you're that kind of a guy! Oh, the places you'll go! There is fun to be done! There are points to be scored. There are games to be won. And the magical things you can do with that ball will make you the winning-est winner of all. Fame! You'll be as famous as famous can be, with the whole wide world watching you win on TV. Except when they don't Because, sometimes they won't. I'm afraid that some times you'll play lonely games too. Games you can't win 'cause you'll play against you. All Alone! Whether you like it or not, Alone will be something you'll be quite a lot. And when you're alone, there's a very good chance you'll meet things that scare you right out of your pants. There are some, down the road between hither and yon, that can scare you so much you won't want to go on. But on you will go though the weather be foul. On you will go though your enemies prowl. On you will go though the Hakken-Kraks howl. Onward up many a frightening creek, though your arms may get sore and your sneakers may leak. On and on you will hike, And I know you'll hike far and face up to your problems whatever they are. You'll get mixed up, of course, as you already know. You'll get mixed up with many strange birds as you go. So be sure when you step. Step with care and great tact and remember that Life's a Great Balancing Act. Just never foget to be dexterous and deft. And never mix up your right foot with your left.  And will you succeed? Yes! You will, indeed! 98 and 3/4 percent guaranteed.  KID, YOU'LL MOVE MOUNTAINS!  So... be your name Buxbaum or Bixby or Bray or Mordecai Ali Van Allen O'Shea, You're off the Great Places! Today is your day! Your mountain is waiting. So... get on your way!   
  </textarea>
</div>
<div class="w-100 f7 mt0 mb3"><i>Sample text: <a href="https://en.wikipedia.org/wiki/Oh,_the_Places_You%27ll_Go!">Oh, the Places You'll Go!</a> by <a href="https://en.wikipedia.org/wiki/Dr._Seuss">Dr. Seuss</a></i></div>
<div class="flex justify-between items-end w-100 f6">
  <div>
    <div>
      N-gram type: <select id="tokenizer" class="mr3">
        <option value="StringToWords">words</option>
        <option value="StringToCharacters">characters</option>
      </select>
    </div>
    <div class="mt2">
      N-gram size: <input type="text" id="ngramSize" size="3" class="mr3" value="3">
    </div>
    <div class="mt2">
      Generated Text Length: <input type="text" id="textLen" size="4" class="mr3" value="1000">
    </div>
  </div>
  <div>
    <button id="generate-text-btn" class="">generate text</button>
  </div>
</div>
<div id="results" class="w-100 mt3 pa2 f6 bg-washed-yellow">
<span class="black-10">generated text</span>
</div>

<script defer src="/static/js/ngrams-markov-chains.js"></script>


## How it works

An n-gram is simply a contiguous sequence of n units of text (e.g. characters or words) for a given text. Take for example this excerpt from [Green Eggs and Ham](https://en.wikipedia.org/wiki/Green_Eggs_and_Ham).

> I am Sam Sam I am That Sam-I-am! That Sam-I-am! I do not like that Sam-I-am!

`(I a)`, `( am)`, `(am )`, `(m S)`, `( Sa)` and `(Sam)` are the first six character tri-grams (three character sequences). 

Here's another list, this time of bi-grams (two character sequences) and also their occurrences within the text.

```python
( a): 5
( d): 1
( i): 5
( l): 1
( n): 1
( s): 5
( t): 3
(am): 10
(at): 3
(do): 1
(e ): 1
(ha): 3
(i ): 6
(ik): 1
(ke): 1
(li): 1
(m ): 9
(no): 1
(o ): 1
(ot): 1
(sa): 5
(t ): 4
(th): 3 
```
_To keep things simple, I've lowercased the characters and excluded punctuation._ 

N-grams alone are nothing special, it's their number of occurrences and the characters that follow in each occurrence that is interesting. In the above analysis, we've only listed the number of times each bi-gram occurred. Let's replace that with the actual character that followed each occurrence.

```python
( a) -> [m, m, m, m, m]
( d) -> [o]
( i) -> [ ,  ,  ,  ,  ]
( l) -> [i]
( n) -> [o]
( s) -> [a, a, a, a, a]
( t) -> [h, h, h]
(am) -> [ ,  ,  ,  ,  ,  ,  ,  ,  ,  ]
(at) -> [ ,  ,  ]
(do) -> [ ]
(e ) -> [t]
(ha) -> [t, t, t]
(i ) -> [a, a, a, a, d, a]
(ik) -> [e]
(ke) -> [ ]
(li) -> [k]
(m ) -> [s, s, i, t, i, t, i, i, i]
(no) -> [t]
(o ) -> [n]
(ot) -> [ ]
(sa) -> [m, m, m, m, m]
(t ) -> [s, s, l, s]
(th) -> [a, a, a]
```

By including the "next" characters following an n-gram, we now have a tool to statistically predict the next possible n-grams. For example the next character after `(i )` has a 1/6 and 5/6 probability of being `d` and `a` respectively. Let's continue with this example and see what we end up with.

```bash
"(i )" -> [a, a, a, a, d, a]
"i( a)"    
```
Assuming the next character is `a`. Without any consideration for `i`, we look at the bi-gram formed by adding `a`, `( a)`, and see what the next possible characters are.

```bash
"i( a)" -> [m, m, m, m, m]
"i (am)"
```

Here are a few more iterations.

```bash
"i (am)" -> [ ,  ,  ,  ,  ,  ,  ,  ,  ,  ]
"i a(m )" -> [s, s, i, t, i, t, i, i, i]
"i am( t)" -> [h, h, h]
"i am (th)" -> [a, a, a]
"i am t(ha)" -> [t, t, t]
"i am th(at)" -> [ ,  ,  ]
"i am tha(t )" -> [s, s, l, s]
"i am that( l)" -> [i]
"i am that (li)" -> [k]
"i am that l(ik)" -> [e]
"i am that li(ke)" -> [ ]
"i am that lik(e )" -> [t]
...
"i am that like tha(t )" -> [s, s, l, s]
```

Continuing this process would yield a chain of various states, following the probability distribution of the bi-grams, thus generating new text. This process of moving from one state to the next based on probabilities is the basis of a Markov chain, and what we are going to build to generate text.

For the remainder of this post we'll build a simple Markov chain, modeled with n-grams and use it to generate some text. Here's a very high-level overview of how our text generator will work.

1. tokenize a corpus into characters
1. build a Markov model of the characters from the corpus
  1. every model entry will contain an n-gram and list of next characters
1. generate new text

We start with a simple tokenizer, splitting our text into character tokens.

```java
class SimpleMarkovTextGenerator {

  /**
   * Tokenize (e.g. split) given corpus into array of characters tokens.
   * @param corpus text corpus to tokenize
   * @return array of characters tokens or empty array
   */
  char[] tokenize(String corpus) {
    if (corpus == null)
      return new char[]{};
    return corpus.toLowerCase()        // lowercase everything
      .replaceAll("[.!\\-',?\n]", " ") // remove punctuation
      .replaceAll("\\s+", " ")         // trim to single space
      .trim()
      .toCharArray();
  }
}
```

Next we iterate through the character tokens and build a model (e.g. map of ngrams and their next characters).

```java
class SimpleMarkovTextGenerator {
  final Map<String, List<Character>> model;
  final int ngramSize;

  SimpleMarkovTextGenerator(String corpus, int ngramSize) {
    this.ngramSize = ngramSize;
    this.model = buildModel(corpus);
  }

  ...

  /** 
   * Return a Map representing a Markov model of n-grams to next characters.
   * @param corpus text to tokenize and build n-grams from
   * @return 
   */
  Map<String, List<Character>> buildModel(String corpus) {
    return buildModel(tokenize(corpus));
  }

  /**
   * Return a simple Map representing a Markov model of n-grams to next characters.
   * @param characters tokens to build n-grams from
   * @return 
   */
  Map<String, List<Character>> buildModel(char[] characters) {
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
}
```

We restructure the class a little to make our class a little easier to work with. Finally to generate our text, we'll use the following algorithm.

1. we start with a "seed" n-gram
2. look up the ngram in our model and grab the next possible characters
3. randomly choose a next possible character
4. append the character to our generated text
5. build our next ngram using the character and repeat step 2 until we have a long enough text

```java
class SimpleMarkovTextGenerator {
  ...

  /**
   * Generate text from the given model. 
   * @param ngram the starting n-gram
   * @param len the length of text to generate
   * @return 
   */
  String generate(String ngram, int len) {
    Random random = new Random();
    StringBuilder sb = new StringBuilder(ngram);
    while (len-- > 0) {
      List<Character> nextCharacters = model.get(ngram);
      if (nextCharacters == null)
        break;
      char nextChar = nextCharacters.get(random.nextInt(nextCharacters.size()));
      sb.append(nextChar);
      ngram = ngram.substring(1) + nextChar;
    }
    return sb.toString();
  }
}
```

Let's generate a couple of text from our original Green Eggs and Ham excerpt. 

```java
class SimpleMarkovTextGenerator {
  ...

  public static void main(String[] args) {
    String corpus = "I am Sam Sam I am That Sam-I-am! That Sam-I-am! I do not like that Sam-I-am!";
    String startNgram = "i ";
    int ngramSize = 2;
    int textLen = 30;

    SimpleMarkovTextGenerator markov = new SimpleMarkovTextGenerator(corpus, ngramSize);
    System.out.println(markov.generate(startNgram, textLen));
    System.out.println(markov.generate(startNgram, textLen));
    System.out.println(markov.generate(startNgram, textLen));
  }
}
```

And some sample generated text from our next text generator, powered by a Markov model using bi-grams.

```shell
i do not sam sam i am i do not s
i am sam i am that sam i am i am
i am that sam sam sam i am i am
```

Try it with uni-gram, what kind of results did you get vs say a tri-gram? Anyways, that was a brief introduction to Markov chains and n-grams.

[Demo and post source code](https://github.com/ikumen/today-i-learned/tree/main/src/main/java/com/gnoht/til/markov_chain/) on [GitHub](https://github.com/ikumen/today-i-learned).


