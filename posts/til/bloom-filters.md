---
title: Bloom Filters
tags: data-structures, hash
description: Bloom filters are probabilistic data structures that solve membership problems, where false positives are possible, while false negatives are not
date: 2021-12-29
---

## Bloom Filters

Bloom filters are space efficient, probabilistic, hash table like data structures that tell you if an item is contained in a set. 

To add items to a Bloom filter, the item is first hashed to generate a key&mdash;much like a hash table, but only the key is add to the filter. Keys are usually stored in a bit array, where each key is modulo into the correct index. Having just one key per item isn't practical as there could be too many collisions, so multiple hash functions are used to generate multiple keys&mdash;ideally the hash functions should produce uniformly distributed keys.

Looking up an item involves hashing to generate it's keys and then simply looked up against the bit array. Any missing key is a definite indication the item _is not a member_, while all keys present indicate _a possible member_, as there may have been a collision.

Here's a naive implementation to demonstate the Bloom filter operations.

<style>
  .left-col {
    min-width: 150px;
    white-space: nowrap;
  }
  .right-col {
    overflow: scroll;
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
      add items
    </div>
    <div class="right-col">
      <div id="item-keys"></div>
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

