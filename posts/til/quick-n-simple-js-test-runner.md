---
title: Quick and Simple In-Browser JavaScript Test Runner
tags: javascript, testing, cheezy
description: I've been playing with JavaScript lately and needed a simple way to run some home grown tests directly in the browser, nothing fancy
---

# Quick and Simple JavaScript Test Runner

I just wanted to share a quick and simple in-browser JavaScript test runner. 

## How to use it

Here's an example test suite.

```javascript
const suite = new TestSuite();
const group = suite.describe("AdventureGame");

// sub-group (movePlayerForward) tests
group.describe("#movePlayerForward")
    .it('Should move forward n steps', () => {
        ...
        suite.assertEquals(....)
      })
    .it('Should not move forward if blocked', () => {
        ....
        suite.assertEquals(....)
      });

// sub-group (isWon) tests
group.describe("#isWon")
    .it('Should return true for won game', () => ...)
    .it('Should return false if game is tie', () => ....);

// top-level tests
group
  .it('Should have initialized game with 3 x 3 matrix', () => {
    suite.assertEquals(....)
  });

suite.run();
```

The test results are simply dumped to `console.log`.

![quick-n-dirty-test-results](/static/images/quick-dirty-test-results.png)

### API

Functionality wise it doesn't do much, just helps organize tests and runs them in one place. 

**_describe(desc)_**
groups tests or sub-groups (at most 1 extra level) of tests by creating a map to store the tests and sub-groups.
  - `desc: string` name of grouping
  - returns object containing
    - `describe(desc): object` for adding sub-group
      - `desc: string` name of sub-group
      - returns object containing 
        - `it(desc, fn)` for adding test to sub-group
          - `desc: string` describing the test
          - `fn: Function` for performing actual test
    - `it(desc, fn)` for adding test to top most group
      - `desc: string` describing the test
      - `fn: Function` for performing actual test

**_assertEquals(expected, actual)_** 
test equality if primitive, for objects it will `JSON.stringify` and compare the strings
  - `expected: any` expected value to test
  - `actual: any` actual value to test

**_run()_** 
for running all tests registered with `describe` and `it`

### Implementation

```javascript
/**
 * Represents a grouping or sub-groupings of tests.
 */
class TestSuite {
  static get STYLES() {
    return {
      label: 'color: #999',
      groupLabel: 'font-weight: 600',
      subgroupLabel: 'color: blue; font-style: italic;',
      testFailed: 'color: #ff3333',
      testPassed: 'color: #00cc00' 
    }
  }

  constructor() {
    this.groups = {};
  }

  /**
   * Create a top-level group, returning operations on the group.
   * 
   * @param {string} desc description of group
   * @returns object containing operations for the group, describe() to add 
   *  sub-group and it() to add tests
   */
  describe(desc) {
    const tests = [];
    const subgroups = {};
    this.groups[desc] = {tests, subgroups};
    const describeOps = {
      /**
       * Creates a sub-group under above parent, returning function 
       * to add tests to this sub-group.
       * 
       * @param {string} desc description of sub-group
       * @returns object containing operations for the sub-group, it() to add tests
       */
      describe: (desc) => {
        const _tests = [];
        subgroups[desc] = _tests;
        const subdescribeOps = {
          /**
           * Creates a test at the sub-group, returning the sub-group reference.
           * 
           * @param {string} desc description of test
           * @param {function} fn function that performs the actual test
           * @returns parent reference for chaining
           */
          it: (desc, fn) => {
            _tests.push([desc, fn]);
            return subdescribeOps;
          }
        }
        return subdescribeOps;
      },
      /**
       * Creates a test at the group level, return the group reference.
       * 
       * @param {string} desc description of test
       * @param {function} fn function that performs the actual test
       * @returns group reference for chaining
       */
      it: (desc, fn) => {
        tests.push([desc, fn]);
        return describeOps;
      }
    }
    return describeOps;
  }

  /**
   * Asserts the given expected and actual values are equal, for primitives
   * it's just a simple equality check, for objects they are JSON.stringified
   * then compared as strings.
   * 
   * @param {any} expected the expected value
   * @param {any} actual the actual value
   */
  assertEquals(expected, actual) {
    if (expected instanceof Array || expected instanceof Object) {
      expected = JSON.stringify(expected);
      actual = JSON.stringify(actual);
    }    
    if (expected !== actual) {
      throw `expected=${expected}, actual=${actual}`
    }
  }

  printResults(passed, failed) {
    console.log(`%cResults: %cpassed: ${passed}  %cfailed: ${failed}\n`, 
        TestSuite.STYLES.label, TestSuite.STYLES.testPassed, TestSuite.STYLES.testFailed);
  }

  /**
   * Runs a single test function, return true if test passed.
   * 
   * @param {string} desc description of test
   * @param {function} fn test function to execute
   * @param {boolean} isSubgroup indicates if this is a sub-group test (just for pretty printing)
   * @returns true if test passed
   */
  runTest(desc, fn, isSubgroup) {
    const indent = isSubgroup ? '      ' : '  ';
    try {
      fn();
      console.log(`%c${indent}\u2714 ${desc}`, TestSuite.STYLES.testPassed);
      return true;
    } catch (err) {
      console.log(`%c${indent}\u2718 ${desc}`, TestSuite.STYLES.testFailed);
      console.error(`%c${indent}  ${err}`, TestSuite.STYLES.testFailed);    
      return false;
    }
  }

  /**
   * Runs all test within this suite.
   */
  run() {
    let failed = 0;
    let passed = 0;
    console.log("%cRunning tests ....", TestSuite.STYLES.label)
    // For each group, get sub-groups and group level tests and run
    for (const grpName in this.groups) {
      const {tests, subgroups} = this.groups[grpName];
      console.log(`%c${grpName}:`, TestSuite.STYLES.groupLabel);
      // Run sub-group tests
      for (const sgName in subgroups) {
        console.log(`%c  ${sgName}:`, TestSuite.STYLES.subgroupLabel);
        for (const it of subgroups[sgName]) {
          if (this.runTest(...it, true)) passed += 1;
          else failed += 1;
        }
        console.log();
      }
      
      // Run group level tests
      for (const it of tests) {
        if (this.runTest(...it)) passed += 1;
        else failed += 1;
      }
    }
    this.printResults(passed, failed);
  }
}
```