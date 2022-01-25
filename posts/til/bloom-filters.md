---
title: Bloom Filters
tags: data-structures, hash
description: Bloom filters are probabilistic data structures that solve membership problems, where false positives are possible, while false negatives are not
date: 2021-12-29
---

## Bloom Filters

[Bloom filters](https://en.wikipedia.org/wiki/Bloom_filter) are space efficient, probabilistic, hash table like data structures that tell you if an item is contained in a set. 

Here's a naive implementation that demonstrates how a Bloom filter operates.

<style>
  .left-col {
    min-width: 160px;
    white-space: nowrap;
  }
  .right-col {
    overflow: scroll;
    white-space: nowrap;
  }
</style>

<div class="bg-washed-yellow pa3 w-100 f6">
  <div class="w-100 flex items-start pb2">
    <div class="left-col">
      add operation
    </div>
    <div class="f7 ml1">
      <input type="text" id="bf-add-input"> <button id="bf-add-btn">add</button>
    </div>
  </div>
  <div class="w-100 flex items-start pb2">
    <div class="left-col">
      items in set (w/ keys)
    </div>
    <div class="right-col">
      <div id="item-keys" class="right-col"></div>
    </div>
  </div>
  <div class="w-100 flex items-start pb2">
    <div class="left-col">
      bit array
    </div>
    <div class="right-col">
      <table id="bits" class="pa0 f7 ml1 right-col">
        <tbody></tbody>
      </table>
    </div>
  </div>
  <div class="w-100 flex items-start pb2">
    <div class="left-col">
      prob. false positive
    </div>
    <div class="right-col">
      <div id="fp-prob"></div>
    </div>
  </div>
  <div class="w-100 flex items-start">
    <div class="left-col">
      lookup operation
    </div>
    <div class="f7 ml1">
      <input type="text" id="bf-lookup-input"> <button id="bf-lookup-btn">lookup</button><br/>
      <span id="lookup-results">&nbsp;</span>
    </div>
  </div>
</div>

<script src="/static/js/bloom-filters.js"></script>

### How it works

To add items to a Bloom filter, the item is first hashed to generate a key&mdash;much like a hash table, but only the key is add to the filter. Keys are usually stored in a bit array, where each key is modulo into the correct index. Having just one key per item isn't practical as there could be too many collisions, so multiple hash functions are used to generate multiple keys&mdash;ideally the hash functions should produce uniformly distributed keys.

Looking up an item involves hashing to generate it's keys and then simply looked up against the bit array. Any missing key is a definite indication the item _is not a member_, while all keys present indicate _a possible member_, as there may have been a collision.

### Hash functions

The hash functions for a Bloom filter should be fast and produce uniformly distributed hashes. Some common hash functions to consider are [FNV](https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function) and [MurmurHash](https://en.wikipedia.org/wiki/MurmurHash). Also, there is a [technique that uses just two hash functions to simulate additional hash functions](https://www.eecs.harvard.edu/~michaelm/postscripts/rsa2008.pdf).

### Optimal Bloom filter

As you add more items to a Bloom filter the false positive rate will increase. Adjusting the number of hash functions or size of bit array can also affect the false positive rate with relation to the number of items. Here's a [nice Bloom filter calculator](https://hur.st/bloomfilter/) that helps you choose the optimal number of hash functions and bit array for a target false positive rate.






