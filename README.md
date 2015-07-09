###[![NPM version](https://badge.fury.io/js/simple-http-utilities.png)](http://badge.fury.io/js/simple-http-utilities)  [![Build Status](https://api.travis-ci.org/dkhunt27/simple-http-utilities.png?branch=master)](https://travis-ci.org/dkhunt27/simple-http-utilities) 

simple-http-utilities
===============

Perform simple javascript validation like isEmpty and isDefined in a consistent manner.




Please see the <a href="http://dkhunt27.github.io/simpleJSValidator/#!/api/SimpleJS.Validator" target="_blank">docs/index.html</a> for more details. If link does not work, just open the index.html in the docs folder.

# Installation

	npm install simple-http-utilities

# Usage

	var sjv = require('simple-js-validator');
    var someVar;
    if (sjv.isDefined(someVar)) {
        // do something 
    }
        	
    if (sjv.isEmpty(someVar)) {
        // do something else
    }
	
# Road Map
<table>
	<tr>
		<td>1.0</td>
		<td>buildOptions, get, getJson, post, postJson, and put functions.</td>
	</tr>
	<tr>
		<td></td>
		<td>100% unit test coverage.</td>
	</tr>
	<tr>
		<td></td>
		<td>Use grunt to build, minify, test, jshint, and publish package.</td>
	</tr>
	<tr>
		<td></td>
		<td>Publish to npm with only required files.</td>
	</tr>
	<tr>
		<td></td>
		<td>Documentation on installation, use cases, and code examples.</td>
	</tr>
</table>
 
### Note to myself

- Make sure working in dev branch
- When updates are complete, run "grunt test" to verify all tests are passing.  
- Run "grunt hint" to verify all jshint checks are passing.
- Run "grunt bump" to update version (grunt bump:patch, grunt bump:minor) or update package.json directly
- Update release history and version ref at top of js file
- Then run "grunt release".
- When it is complete, git commit, git push, and git push --tags
- Wait for travis build confirmation
- Make pull request to master
- Wait for travis build confirmation
- Pull down master locally
- Just to verify, run "grunt test" to verify all tests are passing.  Run "grunt hint" to verify all jshint checks are passing.
- Run "npm publish"
- Go back to dev branch
- Cele!!!

# Release History
<table>
	<tr>
		<td>0.1.0</td>
		<td>2015/07/09</td>
		<td>Initial Release.</td>
	</tr>
	<tr>
		<td></td>
		<td></td>
		<td>buildOptions, get, getJson, post, postJson, and put functions.</td>
	</tr>
	<tr>
		<td></td>
		<td></td>
		<td>No test coverage.</td>
	</tr>
	<tr>
		<td></td>
		<td></td>
		<td>Uses grunt to build, minify, test, jshint, and publish package.</td>
	</tr>
	<tr>
		<td></td>
		<td></td>
		<td>Also using travis for CI.</td>
	</tr>
	<tr>
		<td></td>
		<td></td>
		<td>Initial documentation.</td>
	</tr>
</table>


