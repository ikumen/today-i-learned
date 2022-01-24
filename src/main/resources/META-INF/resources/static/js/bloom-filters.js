
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

class BloomFilter {
  constructor({m, h1, h2, k}) {
    this.bits = new Array(m).fill(0);
    this.h1 = h1;
    this.h2 = h2;
    this.k = k;
    this.listeners = [];
  }

  addListener(cb) {
    this.listeners.push(cb);
  }

  notifyListeners(item, keys) {
    for (const cb of this.listeners) {
      cb(this.bits, item, keys);
    }
  }

  add(item) {
    const keys = [];
    for (let i=0; i < this.k; i++) {
      const h = (this.h1(item) + i * this.h2(item)) % this.bits.length;
      keys.push(h);
      this.bits[h] = 1;
    }
    this.notifyListeners(item, keys);
  }

  contains(item) {
    for (let i=0; i < this.k; i++) {
      const h = this.h1(item) + i * this.h2(item);
      if (this.bits[h % this.bits.length] === 0)
        return false;
    }
    return true;
  }
}

function makeCell(row, value) {
  const cell = row.insertCell();
  cell.classList.add("ph2");
  cell.innerText = value;
}



ready(() => {
  const bf = new BloomFilter({ m: 20,
      h1: (item) => murmurhash3(item, 113),
      h2: (item) => murmurhash3(item, 271),
      k: 3 });

  const bitsEl = el("bits");
  const bfAddInputEl = el("bf-add-input");
  const bfAddBtnEl = el("bf-add-btn");
  const itemKeysEl = el("item-keys");
  const bfLookupInputEl = el("bf-lookup-input");
  const bfLookupBtnEl = el("bf-lookup-btn");
  const lookupResultsEl = el("lookup-results");

  bfAddBtnEl.addListener('click', (ev) => {
    const val = bfAddInputEl.get().value;
    bf.add(val);
  });

  bfLookupBtnEl.addListener('click', (ev) => {
    const val = bfLookupInputEl.get().value;
    if (!bf.contains(val)) {
      lookupResultsEl.get().innerHTML = `No "${val}" is not in set.`;
    } else {
      lookupResultsEl.get().innerHTML = `"${val}" may be in the set.`;
    }
  });

  const onBloomFilterChange = (bits, item, keys) => {
    const tbody = bitsEl.get().getElementsByTagName("tbody")[0];
    // Clear current tbody
    while (tbody.rows.length) 
      tbody.deleteRow(0);
    // Display row of bits/indexes
    const bitsRow = tbody.insertRow();
    const indexRow = tbody.insertRow();
    for (let i=0; i < bits.length; i++) {
      makeCell(bitsRow, bits[i]);
      makeCell(indexRow, i);
    }

    if (item) {
      itemKeysEl.get().innerHTML += `${item}={${keys}}, &nbsp;`;
    }
  };

  bf.addListener(onBloomFilterChange);

  onBloomFilterChange(bf.bits);
});

