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