describe('simple.http.utilities.Unit.Tests.js', function(){
  "use strict";
  "use strict";
  var sjv = require('simple-js-validator');
  var path = require('path');
  var sinon = require('sinon');
  var _ = require('underscore');
  var expect = require("chai").expect;

  var http = require('http');
  var https = require('https');

  var projectDir = path.join(__dirname, "..");
  var toBeTestedFilePath = path.join(projectDir, 'lib', 'simple.http.utilities.js');

  var toBeTested, fnInputsBuilder;
  var errReturned, resultsReturned;
  var sinoned = {};

  beforeEach(function () {
    fnInputsBuilder = function (functionName, paramName, paramValue) {
      var validValue;

      // jshint indent: false
      switch (functionName) {
        case "buildOptions":
          validValue = {
            host: "localhost",
            port: 80,
            path: "/some/path"
          };
          break;
        default:
          throw new Error("fnInputsBuilder not implemented functionName:" + functionName);
      }

      if (sjv.isNotEmpty(paramName)) {
        validValue[paramName] = paramValue;
      }

      return validValue;
    };

    sinoned = {};

    toBeTested = require(toBeTestedFilePath);
  });

  afterEach(function () {
    _.invoke(sinoned, "restore");
  });

  describe('#buildOptions()', function () {
    var functionToTest = "buildOptions";
    var fnInputs;
    beforeEach(function () {
      resultsReturned = null;
      errReturned = null;
    });
    describe('given missing minimal inputs,', function () {
      beforeEach(function () {
        fnInputs = {};
        fnInputs.username = "someUser";
        fnInputs.password = "somePassword";
        fnInputs.useAuthHeader = true;
        fnInputs.contentType = "someContentType";
      });
      describe('when called', function () {
        beforeEach(function (done) {
          try {
            resultsReturned = toBeTested[functionToTest](fnInputs);
            done();
          } catch (err) {
            errReturned = err;
            done();
          }
        });

        it('should return expected results', function () {
          var expErrMsg = "input must not be empty: fnInputs.host";
          shouldReturnError(errReturned, resultsReturned, expErrMsg);
        });
      });
    });
    describe('given minimal inputs,', function () {
      beforeEach(function () {
        fnInputs = fnInputsBuilder(functionToTest);
      });
      describe('when called', function () {
        beforeEach(function (done) {
          try {
            resultsReturned = toBeTested[functionToTest](fnInputs);
            done();
          } catch (err) {
            errReturned = err;
            done();
          }
        });

        it('should return expected results', function () {
          shouldReturnResultsNoError(errReturned, resultsReturned);

          expect(resultsReturned.host, "resultsReturned.host").to.exist;
          expect(resultsReturned.host, "resultsReturned.host").to.equal("localhost");
          expect(resultsReturned.port, "resultsReturned.port").to.exist;
          expect(resultsReturned.port, "resultsReturned.port").to.equal(80);
          expect(resultsReturned.path, "resultsReturned.path").to.exist;
          expect(resultsReturned.path, "resultsReturned.path").to.equal("/some/path");
          expect(resultsReturned.auth, "resultsReturned.auth").to.not.exist;
          expect(resultsReturned.headers, "resultsReturned.headers").to.exist;
          expect(resultsReturned.headers, "resultsReturned.headers").to.deep.equal({});
        });
      });
    });
    describe('given contentType input,', function () {
      beforeEach(function () {
        fnInputs = fnInputsBuilder(functionToTest);
        fnInputs.contentType = "someContentType";
      });
      describe('when called', function () {
        beforeEach(function (done) {
          try {
            resultsReturned = toBeTested[functionToTest](fnInputs);
            done();
          } catch (err) {
            errReturned = err;
            done();
          }
        });

        it('should return expected results', function () {
          shouldReturnResultsNoError(errReturned, resultsReturned);

          expect(resultsReturned.host, "resultsReturned.host").to.exist;
          expect(resultsReturned.host, "resultsReturned.host").to.equal("localhost");
          expect(resultsReturned.port, "resultsReturned.port").to.exist;
          expect(resultsReturned.port, "resultsReturned.port").to.equal(80);
          expect(resultsReturned.path, "resultsReturned.path").to.exist;
          expect(resultsReturned.path, "resultsReturned.path").to.equal("/some/path");
          expect(resultsReturned.auth, "resultsReturned.auth").to.not.exist;
          expect(resultsReturned.headers, "resultsReturned.headers").to.exist;
          expect(resultsReturned.headers, "resultsReturned.headers").to.deep.equal({"Content-Type": "someContentType"});

        });
      });
    });
    describe('given auth input,', function () {
      beforeEach(function () {
        fnInputs = fnInputsBuilder(functionToTest);
        fnInputs.auth = "someAuth";
      });
      describe('when called', function () {
        beforeEach(function (done) {
          try {
            resultsReturned = toBeTested[functionToTest](fnInputs);
            done();
          } catch (err) {
            errReturned = err;
            done();
          }
        });

        it('should return expected results', function () {
          shouldReturnResultsNoError(errReturned, resultsReturned);

          expect(resultsReturned.host, "resultsReturned.host").to.exist;
          expect(resultsReturned.host, "resultsReturned.host").to.equal("localhost");
          expect(resultsReturned.port, "resultsReturned.port").to.exist;
          expect(resultsReturned.port, "resultsReturned.port").to.equal(80);
          expect(resultsReturned.path, "resultsReturned.path").to.exist;
          expect(resultsReturned.path, "resultsReturned.path").to.equal("/some/path");
          expect(resultsReturned.auth, "resultsReturned.auth").to.exist;
          expect(resultsReturned.auth, "resultsReturned.auth").to.equal("someAuth");
          expect(resultsReturned.headers, "resultsReturned.headers").to.exist;
          expect(resultsReturned.headers, "resultsReturned.headers").to.deep.equal({});

        });
      });
    });
    describe('given user/pass input,', function () {
      beforeEach(function () {
        fnInputs = fnInputsBuilder(functionToTest);
        fnInputs.username = "someUser";
        fnInputs.password = "somePassword";
      });
      describe('when called', function () {
        beforeEach(function (done) {
          try {
            resultsReturned = toBeTested[functionToTest](fnInputs);
            done();
          } catch (err) {
            errReturned = err;
            done();
          }
        });

        it('should return expected results', function () {
          shouldReturnResultsNoError(errReturned, resultsReturned);

          expect(resultsReturned.host, "resultsReturned.host").to.exist;
          expect(resultsReturned.host, "resultsReturned.host").to.equal("localhost");
          expect(resultsReturned.port, "resultsReturned.port").to.exist;
          expect(resultsReturned.port, "resultsReturned.port").to.equal(80);
          expect(resultsReturned.path, "resultsReturned.path").to.exist;
          expect(resultsReturned.path, "resultsReturned.path").to.equal("/some/path");
          expect(resultsReturned.auth, "resultsReturned.auth").to.exist;
          expect(resultsReturned.auth, "resultsReturned.auth").to.equal("Basic dW5kZWZpbmVkOnNvbWVQYXNzd29yZA==");
          expect(resultsReturned.headers, "resultsReturned.headers").to.exist;
          expect(resultsReturned.headers, "resultsReturned.headers").to.deep.equal({});

        });
      });
    });
    describe('given user/pass useAuthHeader input,', function () {
      beforeEach(function () {
        fnInputs = fnInputsBuilder(functionToTest);
        fnInputs.username = "someUser";
        fnInputs.password = "somePassword";
        fnInputs.useAuthHeader = true;
      });
      describe('when called', function () {
        beforeEach(function (done) {
          try {
            resultsReturned = toBeTested[functionToTest](fnInputs);
            done();
          } catch (err) {
            errReturned = err;
            done();
          }
        });

        it('should return expected results', function () {
          shouldReturnResultsNoError(errReturned, resultsReturned);

          expect(resultsReturned.host, "resultsReturned.host").to.exist;
          expect(resultsReturned.host, "resultsReturned.host").to.equal("localhost");
          expect(resultsReturned.port, "resultsReturned.port").to.exist;
          expect(resultsReturned.port, "resultsReturned.port").to.equal(80);
          expect(resultsReturned.path, "resultsReturned.path").to.exist;
          expect(resultsReturned.path, "resultsReturned.path").to.equal("/some/path");
          expect(resultsReturned.auth, "resultsReturned.auth").to.not.exist;
          expect(resultsReturned.headers, "resultsReturned.headers").to.exist;
          expect(resultsReturned.headers, "resultsReturned.headers").to.deep.equal({"Authorization": "Basic dW5kZWZpbmVkOnNvbWVQYXNzd29yZA=="});

        });
      });
    });
    describe('given user/pass useAuthHeader contentType input,', function () {
      beforeEach(function () {
        fnInputs = fnInputsBuilder(functionToTest);
        fnInputs.username = "someUser";
        fnInputs.password = "somePassword";
        fnInputs.useAuthHeader = true;
        fnInputs.contentType = "someContentType";
      });
      describe('when called', function () {
        beforeEach(function (done) {
          try {
            resultsReturned = toBeTested[functionToTest](fnInputs);
            done();
          } catch (err) {
            errReturned = err;
            done();
          }
        });

        it('should return expected results', function () {
          shouldReturnResultsNoError(errReturned, resultsReturned);

          expect(resultsReturned.host, "resultsReturned.host").to.exist;
          expect(resultsReturned.host, "resultsReturned.host").to.equal("localhost");
          expect(resultsReturned.port, "resultsReturned.port").to.exist;
          expect(resultsReturned.port, "resultsReturned.port").to.equal(80);
          expect(resultsReturned.path, "resultsReturned.path").to.exist;
          expect(resultsReturned.path, "resultsReturned.path").to.equal("/some/path");
          expect(resultsReturned.auth, "resultsReturned.auth").to.not.exist;
          expect(resultsReturned.headers, "resultsReturned.headers").to.exist;
          expect(resultsReturned.headers, "resultsReturned.headers").to.deep.equal({"Authorization": "Basic dW5kZWZpbmVkOnNvbWVQYXNzd29yZA==", "Content-Type": "someContentType"});

        });
      });
    });
  });

  var shouldReturnError = function (errReturned, resultsReturned, expErrMessage) {
    expect(errReturned, 'errReturned').to.exist;
    expect(resultsReturned, 'resultsReturned').to.not.exist;
    expect(errReturned.message, 'errReturned.message').to.contain(expErrMessage);
    return;
  };

  var shouldReturnResultsNoError = function (errReturned, resultsReturned) {
    if (errReturned) {
      console.log(errReturned.stack);
    }  // for better debugging
    expect(errReturned, 'errReturned').to.not.exist;
    expect(resultsReturned, 'resultsReturned').to.exist;

    return;
  };

  var shouldReturnNoErrors = function (errReturned, resultsReturned) {
    if (errReturned) {
      console.log(errReturned.stack);
    }  // for better debugging
    expect(errReturned, 'errReturned').to.not.exist;

    return;
  };
});

