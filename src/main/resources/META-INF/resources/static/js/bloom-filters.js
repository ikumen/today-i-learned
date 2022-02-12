
/**
 * JS Implementation of MurmurHash3 (r136) (as of May 20, 2011)
 * 
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @see http://github.com/garycourt/murmurhash-js
 * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
 * @see http://sites.google.com/site/murmurhash/
 * 
 * @param {string} key ASCII only
 * @param {number} seed Positive integer only
 * @return {number} 32-bit positive integer hash 
 */
 function murmurhash3(key, seed) {
	var remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i;
	
	remainder = key.length & 3; // key.length % 4
	bytes = key.length - remainder;
	h1 = seed;
	c1 = 0xcc9e2d51;
	c2 = 0x1b873593;
	i = 0;
	
	while (i < bytes) {
	  	k1 = 
	  	  ((key.charCodeAt(i) & 0xff)) |
	  	  ((key.charCodeAt(++i) & 0xff) << 8) |
	  	  ((key.charCodeAt(++i) & 0xff) << 16) |
	  	  ((key.charCodeAt(++i) & 0xff) << 24);
		++i;
		
		k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
		k1 = (k1 << 15) | (k1 >>> 17);
		k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

		h1 ^= k1;
        h1 = (h1 << 13) | (h1 >>> 19);
		h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
		h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
	}
	
	k1 = 0;
	
	switch (remainder) {
		case 3: k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
		case 2: k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
		case 1: k1 ^= (key.charCodeAt(i) & 0xff);
		
		k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
		k1 = (k1 << 15) | (k1 >>> 17);
		k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
		h1 ^= k1;
	}
	
	h1 ^= key.length;

	h1 ^= h1 >>> 16;
	h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
	h1 ^= h1 >>> 13;
	h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
	h1 ^= h1 >>> 16;

	return h1 >>> 0;
}

/**
 * Bloom filter implementation with support for add and contains operations.s
 */
class BloomFilter {
  constructor({size, numHashFns = 3}) {
    this.size = size;
    this.items = 0;
    this.bits = new Array(size).fill(0);
    this.hashFunctions = this._initHashFunction(numHashFns);
  }

  /**
   * Return true if given val is contained in filter.
   * 
   * @param {string} val to check if contained in filter
   * @returns true if val is in filter
   */
  contains(val) {
    for (const fn of this.hashFunctions) {
      if (this.bits[fn(val)] == 0) 
        return false;
    }
    return true;
  }

  /**
   * Add the given val to filter, returning indexes (specific to this filter) where
   * the val was stored.
   * 
   * @param {string} val to add to filter
   * @returns bit indexes that val is stored at in filter
   */
  add(val) {
    const indexes = [];
    for (const fn of this.hashFunctions) {
      const i = fn(val);
      this.bits[i] = 1;
      indexes.push(i);
    }
    this.items += 1;
    return indexes;
  }

  /**
   * @returns false positive probability rate
   */
  falsePositiveRate() {
    const k = this.hashFunctions.length;
    const prob = Math.pow(1 - Math.exp(-k / (this.size / this.items)), k) * 100;
    return Math.round((prob + Number.EPSILON) * 100) / 100;    
  }

  /**
   * Clear the bloom filter.
   */
  clear() {
    this.bits = new Array(this.bits.length).fill(0);
    this.items = 0;
  }

  /* Internal helper function to initialize hash functions */
  _initHashFunction(k) {
    const hashFunctions = new Array(k);
    const h1 = (val) => murmurhash3(val, 17);
    const h2 = (val) => murmurhash3(val, 31);
    for (let i=0; i < k; i++) {
      hashFunctions[i] = (val) => (h1(val) + i * h2(val)) % this.size;
    }
    return hashFunctions;
  }
}

//////////////////// demo  ////////////////////

const bloomFilter = new BloomFilter({size: 20, numHashFns: 3});

/**
 * Helper for display bits table representing the bloom filter bits.
 */
function makeCell(row, value, em) {
  const cell = row.insertCell();
  cell.classList.add("ph2");
  if (em) {
    cell.classList.add("fw7")
  }
  cell.innerText = value;
}

/**
 * Handle add value to bloom filter.
 */
function onAddToBloomFilter() {
  const inputEl = document.getElementById("bf-add-input");
  const val = (inputEl.value || "").trim();
  // ignore, invalid input
  if (val === "")
    return;
  // add the input value to filter, grab indexes and update
  // the results view
  inputEl.value = "";    
  const indexes = bloomFilter.add(val);
  setBloomFilterItemsDisplay(val, indexes);
  setBloomFilterBitsDisplay();
  setBloomFilterFalsePositiveRateDisplay();
}

/**
 * Display the val=[indexes] in the results view.
 * 
 * @param {string} val string value added to bloom filter
 * @param {Array} indexes array of index position of stored value
 */
function setBloomFilterItemsDisplay(val, indexes) {
  document.getElementById("item-keys").innerHTML += `${val}=[${indexes}], &nbsp;`;
}

/**
 * Display the bloom filter bits.
 */
function setBloomFilterBitsDisplay() {
  const bitsEl = document.getElementById("bits");
  const tbody = bitsEl.getElementsByTagName("tbody")[0];
  // Clear current tbody
  while (tbody.rows.length) 
    tbody.deleteRow(0);

  // Display row of bits/indexes
  const bitsRow = tbody.insertRow();
  const indexRow = tbody.insertRow();
  for (let i=0; i < bloomFilter.bits.length; i++) {
    makeCell(bitsRow, bloomFilter.bits[i], bloomFilter.bits[i] === 1);
    makeCell(indexRow, i);
  }
}

/**
 * Display the false positive rate for given bloom filter.
 */
function setBloomFilterFalsePositiveRateDisplay() {
  document.getElementById("fp-prob").innerHTML = `<b>${bloomFilter.falsePositiveRate()}%</b>`;
}

function onLookupValueInBloomFilter() {
  const inputEl = document.getElementById("bf-lookup-input");
  const val = (inputEl.value || "").trim();
  if (val === "")
    return;
  document.getElementById("lookup-results").innerHTML = bloomFilter.contains(val)
    ? `"<b>${val}</b>" may be in the filter, with above probability of a false positive.`
    : `No "<b>${val}</b>" is not in filter.`;
}

function onClearBloomFilter() {
  bloomFilter.clear();
  document.getElementById("item-keys").innerHTML = ``;
  setBloomFilterBitsDisplay();
  setBloomFilterFalsePositiveRateDisplay();
}

ready(() => {
  // after page has loaded, add listeners for adding, lookup and clearing bloom filter
  document.getElementById("bf-add-btn")
    .addEventListener('click', onAddToBloomFilter);
  document.getElementById("bf-lookup-btn")
    .addEventListener('click', onLookupValueInBloomFilter);
  document.getElementById("clear-bf-btn")
    .addEventListener('click', onClearBloomFilter);

  // display initial bloom filter properties
  setBloomFilterBitsDisplay();
  setBloomFilterFalsePositiveRateDisplay();
});

