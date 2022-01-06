/**
 * TinyTest testing framework, not really it's a simple test runner 
 * to organize and run your test with some pretty output.
 * 
 * Example usage:
 * 
 *  // Initialize it, by default will put API directly onto global window scope
 *  TinyTest.init()
 *  
 *  // describe your test groups and test
 *  describe('Array', () => {
 *    describe('#push()', () => {
 *      it('Should add item to end of array', () => {
 *        const a = [0];
 *        a.push(1);
 *        assertEquals([0, 1], a);
 *      });
 *    });
 *  });
 *  
 *  // Output:
 *  > Array
 *  >    #push()
 *  >       ✔ Should add item to end of array
 *  > 1 passing, 0 failing   
 * 
 * If splattering TinyTest API onto the global scope is a problem, just give it a 
 * context name and reference it's namespace.
 * 
 *  TinyTest.init('tt');
 *  
 *  tt.describe('Array', () => {});
 *  
 * Reference:
 * 
 *    TinyTest
 *      init(ctxName, styles) initialize TinyTest, adding API to appropriate context/scope
 *        - ctxName (optional) string context name to attach API to, defaults to window scope
 *        - styles (optional) object of styles, see defaultStyles below
 * 
 *    describe(desc, fn) grouping of tests and sub-groups
 *      - desc string describing the grouping
 *      - fn function to be executed
 * 
 *    it(desc, fn) defines a test to run
 *      - desc string describing test to perform
 *      - fn function test to be executed
 * 
 *    assertEquals(expected, actual) assert equality for primitives, otherwise JSONify everything 
 *      to strings and compare
 *      - expected any value that is expected
 *      - actual any value that is to be validated
 * 
 * 
 */
const TinyTest = (function() {
  const defaultStyles = {
      label: 'color: #999',
      failing: 'color: #ff3333',
      passing: 'color: #00cc00',
      groupLabel: 'font-weight: 700',
      subgroupLabel: 'font-style: italic;',
      indentSize: 12,   
  };
  
  /**
   * Initialize the TinyTest framework
   * @param {string} ctxName name of context to dump the API to, if undefined, window scope if used
   * @param {object} styles containing styles to override, see defaultStyles above
   */
  function _TinyTest(ctxName, styles) { 
    // Apply default styles, then overwrite with any custom styles
    styles = styles || {};
    const STYLES = defaultStyles;
    for (var n in styles) { STYLES[n] = styles[n]; }

    // Determine where to dump the API
    let ctx;
    if (ctxName === undefined) {
      // Using window global scope
      ctx = window;
    } else {
      ctx = {};      
      window[ctxName] = ctx;
    }

    // For pretty indentation of result output
    ctx.___tinytest = {indent: -STYLES.indentSize}

    /**
     * Grouping of tests and sub-groups.
     * @param {string} desc describing the grouping of tests and sub-groups
     * @param {function} fn to be executed
     */
    ctx.describe = function(desc, fn) {
      // Every block gets indent 12px right
      ctx.___tinytest.indent += STYLES.indentSize;
      // Flag for "it" to know if it's inside a describe block
      ctx.___tinytest.inDescribeCtx = true;

      // We wrap console to help pretty print output.
      // Only the outer most describe should wrap/unwrap the console.log
      let unwrapConsolelog = false;
      if (ctx.___tinytest.log === undefined) {
        unwrapConsolelog = true;
        ctx.___tinytest.log = console.log;
        // Replace console.log with the following, mostly for pretty output
        console.log = function() {
          const args = Array.from(arguments);
          ctx.___tinytest.log('%c ' + args.shift(), 
                              `padding-left:${ctx.___tinytest.indent}px`,
                              ...args);
        }
        // Outer most describe block should initialize and keep 
        // track # of passing/failing tests
        ctx.___tinytest.passing = 0;
        ctx.___tinytest.failing = 0;

        // Print label for this group (outer most describe)
        console.log(`%c${desc}`, STYLES.groupLabel);  
      } else {
        // Print label for this sub-group (inner describe)
        console.log(`%c${desc}`, STYLES.subgroupLabel);  
      }

      fn();

      // Outer most describe responsible for restoring the console.log
      if (unwrapConsolelog) {
        // Also output the test results
        console.log(`${ctx.___tinytest.passing} passing, ${ctx.___tinytest.failing} failing`);
        console.log = ctx.___tinytest.log;
        ctx.___tinytest.log = undefined;
        ctx.___tinytest.inDescribeCtx = false;
      }
      // House kepping
      ctx.___tinytest.indent -= STYLES.indentSize;
    }
    
    /**
     * Check the expected and actual values for equality when primitives, 
     * otherwise JSONify and check equality of their string representations.
     * 
     * @param {any} expected value to validate against
     * @param {any} actual value to validate
     */
    ctx.assertEquals = function(expected, actual) {
      if (expected === undefined || actual === undefined)
        throw new Error('expected and actual are required');
      if (typeof expected === 'object' || typeof actual === 'object') {
        expected = JSON.stringify(expected);
        actual = JSON.stringify(actual);
      }
      if (expected !== actual)
        throw new Error(`expected=${expected}, actual=${actual}`);
    }

    /**
     * A test to run.
     * 
     * @param {string} desc describing our test
     * @param {function} fn to perform actual test
     */
    ctx.it = function(desc, fn) {
      if (!ctx.___tinytest.inDescribeCtx) {
        throw new Error('it(desc, fn) must be within describ block!');
      }

      ctx.___tinytest.indent += STYLES.indentSize;
      try {
        fn();
        console.log(`%c\u2714 ${desc}`, STYLES.passing);
        ctx.___tinytest.passing += 1;
      } catch (error) {
        console.log(`%c\u2718 ${desc}`, STYLES.failing);
        ctx.___tinytest.indent += STYLES.indentSize;
        console.log(`%c${error}`, STYLES.failing);    
        ctx.___tinytest.indent -= STYLES.indentSize;
      ctx.___tinytest.failing += 1;
      }
      ctx.___tinytest.indent -= STYLES.indentSize;
    }
  }
  
  return {
    init: (ctx, styles) => _TinyTest(ctx, styles)
  }
})();
