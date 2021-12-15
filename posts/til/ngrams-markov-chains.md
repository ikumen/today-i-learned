---
title: N-grams and Markov Chains
tags: n-grams, markov-chains, algorithms
description: A simple text generator to demonstrate how n-grams and Markov Chains work
---
## N-grams and Markov Chains

A simple text generator to demonstrate how [n-grams](https://en.wikipedia.org/wiki/N-gram) and [Markov Chains](https://en.wikipedia.org/wiki/Markov_chain) work.

An n-gram is simply a contiguous sequence of n words for a given text. Here's an example of all bi-grams for a given text.

```java
String[] words = ("You have brains in your head. You have feet in your shoes. " +
    "You can steer yourself any direction you choose.").split("\\s+");

for (int i=0; i < words.length-1; i++) {
  System.out.println("(" + words[i] + " " + words[i+1] + ")");
}
```
Note, given a list of words size _P_ and _N_ size grams, there will be _P-(N-1)_ n-grams.

```bash
(You have)
(have brains)
(brains in)
(in your)
(your head.)
(head. You)
(You have)
(have feet)
(feet in)
(in your)
(your shoes.)
(shoes. You)
(You can)
(can steer)
(steer yourself)
(yourself any)
(any direction)
(direction you)
(you choose.) 
```

A Markov chain is a process for predicting possible states, where the probability of the future state is only dependent on the present state. A simple Markov chain can be modeled using n-grams, in our case we'll demonstrate using our bi-grams generated above. 

Suppose we start with the word `You` from above, the possible bi-grams are `You have`, `You have`, and `You can`. If we had to predict the next word after `You`, there is a 2/3 probability that `have` would be the next word.

```bash
You --> have 
    --> have
    --> can  
```

Assuming we selected `have`, we can consider the next word using our bi-grams that start with `have` (our current state), without any consideration for the previous state `You`. 

```bash
have --> brains
     --> feet
```
Continuing this process would yield a chain of various states, following the probability distribution of the bi-grams, and that is the gist of a Markov chain. 

Let's build a Markov chain model with bi-grams and use it to generate some text.

