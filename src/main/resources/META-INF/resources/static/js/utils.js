function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

/**
 * Helper for working with and creating HTMLElements.
 * 
 * @param {String} id of element to lookup or if tagname was given, the id of the newly created element
 * @param {String} tagName type of element to create
 * @param {HTMLElement} parent optional parent to assign this new element.
 */
function el(id, tagName, parent) {
  const _el = tagName
    ? document.createElement(tagName)
    : document.getElementById(id);

  if (_el == null) {
    throw new Error(`No element with id: ${id}`);
  }

  // If we're creating a new element, give it an id and assign 
  // to a parent node if applicable
  if (tagName) {
    _el.id = id;
    if (parent) {
      parent.appendChild(_el);
    }
  }

  // Keep track of listeners on this element, in case we need to remove
  _el.__listeners = {};

  const props = {
    get: () => _el,
    addClass: (cls) => {
      cls.split(' ').forEach(c => {
        if (!_el.classList.contains(c))
          _el.classList.add(c);
      });
      return props; // for chaining
    },
    removeClass: (cls) => {
      cls.split(' ').forEach(c => _el.classList.remove(c));
      return props;
    },
    isEmpty: () => {
      return _el.innerHTML === '';
    },
    appendChild: (child) => {
      _el.appendChild(child);
      return props;
    },
    innerHtml: (html) => {
      _el.innerHTML = html;
      return props;
    },
    addListener: (name, handler) => {
      _el.__listeners[name] = handler;
      _el.addEventListener(name, handler, false);
      return props;
    },
    clearListeners: () => {
      for(const name in _el.__listeners) {
        _el.removeEventListener(name, _el.__listeners[name], false);
      }
      return props;
    }
  }
  return props;
}

function sketchHelper(id) {
  const el = document.getElementById(id);
  const style = getComputedStyle(el);
  return {
    get: () => el, 
    height: window.innerHeight - el.getBoundingClientRect().y,
    width: el.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
  }
}

function getCanvasHelper(id) {
  const cEl = document.getElementById(id);
  const cStyle = getComputedStyle(cEl);
  return {
    canvas: cEl,
    availHeight: window.innerHeight - cEl.getBoundingClientRect().y,
    availWidth: cEl.clientWidth - parseFloat(cStyle.paddingLeft) - parseFloat(cStyle.paddingLeft)
  }
}

class Heap {
  constructor() {
    this.vals = [];
  }

  push(val) {
    if (!('priority' in val))
      throw new 'Heap object must have a comparable priority property!'
    this.vals.push(val);
    this.shiftUp(this.vals.length-1);
  }

  pop() {
    if (this.vals.length == 0) 
      return;
    const val = this.vals[0];
    const last = this.vals.pop();
    if (this.vals.length != 0) {
      this.vals[0] = last;
      this.shiftDown(0);
    }
    return val;
  }

  swap(i, k) {
    const tmp = this.vals[i];
    this.vals[i] = this.vals[k];
    this.vals[k] = tmp;
  }

  isEmpty() {
    return this.vals.length == 0;
  }

  shiftDown(i){ /* not implemented */ }
  shiftUp(i){ /* not implemented */ }
}

class MinHeap extends Heap {
  shiftDown(i) {
    const left = (i + 1) * 2 - 1;
    const right = left + 1;
    let maxi = i;

    if (left < this.vals.length && this.vals[left].priority < this.vals[maxi].priority) {
      maxi = left;
    } else if (right < this.vals.length && this.vals[right].priority < this.vals[maxi].priority) {
      maxi = right;
    }
    if (maxi != i) {
      this.swap(i, maxi);
      this.shiftDown(maxi);
    }
  }

  shiftUp(i) {
    if (i == 0)
      return;

    const parent = Math.floor((i + 1) / 2) - 1;
    if (this.vals[i].priority < this.vals[parent].priority) {
      this.swap(i, parent);
      this.shiftUp(parent);
    }
  }
}

class MaxHeap {
  shiftDown(i) {
    const left = (i + 1) * 2 - 1;
    const right = left + 1;
    let maxi = i;

    if (left < this.vals.length && this.vals[left].priority > this.vals[maxi].priority) {
      maxi = left;
    } else if (right < this.vals.length && this.vals[right].priority > this.vals[maxi].priority) {
      maxi = right;
    }
    if (maxi != i) {
      this.swap(i, maxi);
      this.shiftDown(maxi);
    }
  }

  shiftUp(i) {
    if (i == 0)
      return;

    const parent = (i + 1) / 2 - 1;
    if (this.vals[i].priority > this.vals[parent].priority) {
      this.swap(i, parent);
      this.shiftUp(parent);
    }
  }
}



