/**
 * Internal representation of trie, where each node contains a sub-tree
 * of words. Paths leading to a node form the prefix of subsequent words.
 * Each character in a word corresponds to a TrieNode.
 */
class TrieNode {
  constructor() {
    this.children = new Map();
    this.isWord = false;
  }

  /**
   * 
   * @param {string} word to add to trie
   * @param {number} i index of character in word to add as this node
   */
  add(word, i = 0) {
    if (i < word.length) {
      if (!this.children.has(word[i])) {
        this.children.set(word[i], new TrieNode());
      }
      const node = this.children.get(word[i]);
      if (i == word.length-1) {
        node.isWord = true;
      }
      node.add(word, i+1);
    }
  }

  /**
   * 
   * @param {string} word to remove from trie
   * @param {number} i index of character to remoe
   */
  remove(word, i = 0) {
    if (i < word.length) {
      const isEmpty = this.children.get(word[i]).remove(word, i+1);
      if (isEmpty && this.children.size == 1) {
        this.children.delete(word[i]);
        if (this.isWord) {
          return true;
        }
      }
      return false;
    } 
    
    if (this.isWord) {
      if (this.children.size == 0) {
        return true;
      } else {
        isWord = false;
      }
    }
    
    return false;
  }

  /**
   * Return true if given word is contained in the trie.
   * 
   * @param {string} word that maybe stored in trie
   * @param {number} i index of character in word to check at this node
   * @returns {boolean} true if word is contained in trie
   */
  contains(word, i = 0) {
    if (i < word.length) {
      return this.children.has(word[i])
        && this.children.get(word[i]).contains(word, i+1);
    }
    return true;
  }

  /**
   * Return list of words starting with given prefix.
   * 
   * @param {string} prefix to look up
   * @param {numer} i index of character in prefix to check
   * @returns list of words or empty list
   */
   wordsWithPrefix(prefix, i = 0) {
    let node = this;
    // traverse to end of prefix
    while (i < prefix.length) {
      if (!node.children.has(prefix[i]))
        return [];
      node = node.children.get(prefix[i]);
      i += 1;
    }

    return this._findWordsInSubtree(node, prefix, []);
  }

  /**
   * Traverse through the subtree (e.g. node) and find words.
   * 
   * @param {TrieNode} node current TrieNode 
   * @param {string} prefix current prefix
   * @param {Array} words list of words found so far
   */
  _findWordsInSubtree(node, prefix, words) {
    if (node.isWord) {
      words.push(prefix);
    }

    node.children.forEach((n, ch) => 
      this._findWordsInSubtree(n, prefix + ch, words));

    return words;
  }
}

/**
 * 
 */
class Trie {
  constructor(words) {
    this.root = new TrieNode();
    if (words) {
      if (typeof words == "object") {
        this.addAll(words);
      } else {
        this.add(words);
      }
    }
  }

  /**
   * Add given word to trie.
   * 
   * @param {string} word to add to trie
   */
  add(word) {
    this.root.add(word, 0);
  }

  /**
   * Add the given list of words to the trie.
   * 
   * @param {Array} words list of words to add to trie
   */
  addAll(words) {
    words.forEach((word) => this.add(word));
  }

  /**
   * Remove the given word from trie.
   * 
   * @param {string} word to remove from trie
   */
  remove(word) {
    this.root.remove(word, 0);
  }

  /**
   * Return true if word is in trie.
   * 
   * @param {string} word to check if in trie
   * @returns true if word is contained in trie
   */
  contains(word) {
    return this.root.contains(word, 0);
  }

  /**
   * Return list of words starting with given prefix.
   * 
   * @param {string} prefix to look up
   * @returns List of words starting with given prefix
   */
  wordsWithPrefix(prefix) {
    return this.root.wordsWithPrefix(prefix, 0);
  }
}


//////////// demo /////////////
const trie = new Trie([
  'afghanistan',
  'albania',
  'algeria',
  'andorra',
  'angola',
  'antigua & deps',
  'argentina',
  'armenia',
  'australia',
  'austria',
  'azerbaijan',
  'bahamas',
  'bahrain',
  'bangladesh',
  'barbados',
  'belarus',
  'belgium',
  'belize',
  'benin',
  'bhutan',
  'bolivia',
  'bosnia herzegovina',
  'botswana',
  'brazil',
  'brunei',
  'bulgaria',
  'burkina',
  'burundi',
  'cambodia',
  'cameroon',
  'canada',
  'cape verde',
  'central african rep',
  'chad',
  'chile',
  'china',
  'colombia',
  'comoros',
  'congo',
  'costa rica',
  'croatia',
  'cuba',
  'cyprus',
  'czech republic',
  'denmark',
  'djibouti',
  'dominica',
  'dominican republic',
  'east timor',
  'ecuador',
  'egypt',
  'el salvador',
  'equatorial guinea',
  'eritrea',
  'estonia',
  'ethiopia',
  'fiji',
  'finland',
  'france',
  'gabon',
  'gambia',
  'georgia',
  'germany',
  'ghana',
  'greece',
  'grenada',
  'guatemala',
  'guinea',
  'guinea-bissau',
  'guyana',
  'haiti',
  'honduras',
  'hungary',
  'iceland',
  'india',
  'indonesia',
  'iran',
  'iraq',
  'ireland',
  'israel',
  'italy',
  'ivory coast',
  'jamaica',
  'japan',
  'jordan',
  'kazakhstan',
  'kenya',
  'kiribati',
  'korea north',
  'korea south',
  'kosovo',
  'kuwait',
  'kyrgyzstan',
  'laos',
  'latvia',
  'lebanon',
  'lesotho',
  'liberia',
  'libya',
  'liechtenstein',
  'lithuania',
  'luxembourg',
  'macedonia',
  'madagascar',
  'malawi',
  'malaysia',
  'maldives',
  'mali',
  'malta',
  'marshall islands',
  'mauritania',
  'mauritius',
  'mexico',
  'micronesia',
  'moldova',
  'monaco',
  'mongolia',
  'montenegro',
  'morocco',
  'mozambique',
  'myanmar',
  'namibia',
  'nauru',
  'nepal',
  'netherlands',
  'new zealand',
  'nicaragua',
  'niger',
  'nigeria',
  'norway',
  'oman',
  'pakistan',
  'palau',
  'panama',
  'papua new guinea',
  'paraguay',
  'peru',
  'philippines',
  'poland',
  'portugal',
  'qatar',
  'romania',
  'russian federation',
  'rwanda',
  'st kitts & nevis',
  'st lucia',
  'saint vincent & the grenadines',
  'samoa',
  'san marino',
  'sao tome & principe',
  'saudi arabia',
  'senegal',
  'serbia',
  'seychelles',
  'sierra leone',
  'singapore',
  'slovakia',
  'solomon islands',
  'somalia',
  'south africa',
  'south sudan',
  'spain',
  'sri lanka',
  'sudan',
  'suriname',
  'swaziland',
  'sweden',
  'switzerland',
  'syria',
  'taiwan',
  'tajikistan',
  'tanzania',
  'thailand',
  'togo',
  'tonga',
  'trinidad & tobago',
  'tunisia',
  'turkey',
  'turkmenistan',
  'tuvalu',
  'uganda',
  'ukraine',
  'united arab emirates',
  'united kingdom',
  'united states',
  'uruguay',
  'uzbekistan',
  'vanuatu',
  'vatican city',
  'venezuela',
  'vietnam',
  'yemen',
  'zambia',
  'zimbabwe',
]);

ready(() => {

  const outputEl = document.getElementById("trie-output");
  document.getElementById("trie-input")
    .addEventListener('input', (ev) => {
      outputEl.innerHTML = "";
      const val = (ev.target.value || "").trim();
      if (val.length > 0) {
        const results = trie.wordsWithPrefix(val.toLowerCase());
        if (results.length) {
          results.forEach((word) => outputEl.innerHTML += `<div>${word}</div>`);
        } else {
          outputEl.innerHTML = `<div>no results found</div>`
        }
      }
    });


});