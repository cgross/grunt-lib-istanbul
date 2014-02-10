'use strict';

var fs = require('fs');
var istanbulLib = require('../lib/istanbul.js');
var rimraf = require('rimraf');
var path = require('path');
var os = require('os-shim');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.istanbulLib = {
  // setUp: function(done) {
  //   done();
  // },
  // tearDown: function(done) {
  //   done();
  // },
  instrument: function(test) {
    test.expect(1);

    var instrumented = istanbulLib.instrument(['test/fixtures/sample.js']);

    var actual = fs.readFileSync(instrumented[0],'utf8');
    var expected = fs.readFileSync('test/fixtures/instrumented_sample.js','utf8');
    test.equal(actual, expected, 'should instrument the file correctly.');

    test.done();
  },
  report: function(test) {
    test.expect(1);

    var coverage = require('./fixtures/coverage.json');
    istanbulLib.writeReport(coverage, {istanbul: { report: 'lcovonly', directory: 'test/report'}});
    test.equal(fs.existsSync('test/report/lcov.info'), true, 'should create the report.');

    rimraf.sync('test/report');

    test.done();
  },
  cleanUp: function(test) {
    test.expect(1);

    istanbulLib.cleanUp();
    test.equal(fs.existsSync(path.join(os.tmpdir(),'grunt-lib-istanbul')),false, 'should clean up after itself.');

    test.done();
  }
};
