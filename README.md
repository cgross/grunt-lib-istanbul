# grunt-lib-istanbul [![Build Status](https://travis-ci.org/cgross/grunt-lib-istanbul.png?branch=master)](https://travis-ci.org/cgross/grunt-lib-istanbul)

> Library to easily add Istanbul code coverage to Grunt test runners.

Use this library to add Istanbul code coverage to Grunt test runners which run tests via PhantomJS.  If a test runner does not use PhantomJS, another method of integrated with Istanbul is superior.

## Instructions

Integrating Istanbul code coverage via `grunt-lib-istanbul` is simple.  This library exports 3 methods:

* `instrument(filesSrc,options)` - Pass the configured files for the task runner and your task options.  The `filesSrc` argument should be `this.filesSrc` directly from your test runner task.  The `options` argument should be the test runner task's grunt options unaltered.  More information about options further down.  This method returns a list of instrumented files that the test runner should use instead of the passed in `filesSrc`.
* `writeReport(coverageJson,options)` - `coverageJson` is the data produced by Istanbul and needs to be sent from the PhantomJS instance back to the test runner task code.  The `options` argument should be the test runner task's grunt options unaltered.
* `cleanUp()` - Cleans up the temp directory containing the instrumented files.  Call after you create the report.

You'll need to call `instrument` and use the returned instrumented files array as the source files under test by the test runner.  When the test runner runs these instrumented files as part of the test run, a `__coverage__` global var is created in the PhantomJS instance.  This data must be passed back to the test runner so it may be passed in turn to `writeReport`.  Finally, you should call `cleanUp` after you've written the report.

## Options

`grunt-lib-istanbul` tries to do all the option parsing for you.  Simply pass your grunt options object through and this library will peek around at the appropriate keys.  You should do a check that istanbul coverage was turned on for your task though.  Something like:

```js
var filesSrc = this.filesSrc;
if (options.istanbul) {
	filesSrc = istanbulLib.instrument(filesSrc,this.options);
}
//do your test running
```

The following is a description of the options and can be placed into your README.md as instructions for your end-users.

## Options Documentation

Istanbul code coverage can be turned on by setting `istanbul` to `true` inside the task options.  For example:

```js
test_runner_task: {
	task: {
		options: {
			istanbul: true
		}
	}
}
```

By default, a summary of the code coverage will be written to the console.  To create an HTML report or specify any other options, configure the `istanbul` property like so:

```js
test_runner_task: {
	task: {
		options: {
			istanbul: {
				report: 'html', //other options are 'text','text-summary','lcovonly','lcov','cobertura','teamcity'
				directory: 'coverage', //directory where report will be written.  default is 'coverage'
				instrumenter: {
					//these options are passed through to Istanbul when instrumenting the files.  Not usually necessary.
				}
			}
		}
	}
}
```

If your coverage report contains coverage results for 3rd party libaries, please ensure that you've configured the test runner so that the `src` attribute contains only your code and other libraries are specifed in `vendor` or `helpers`.
