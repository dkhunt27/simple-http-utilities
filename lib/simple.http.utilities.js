/**
 * @class Simple.Http.Utilities v0.1.0
 * A collection of utilities to expost simple get, post, put methods. Wraps the base http library.
 *
 * @type {Simple.Http.Utilities}
 */

//http://stackoverflow.com/questions/6695143/how-to-make-web-service-calls-in-expressjs

module.exports = function simpleHttpUtilities() {
  "use strict";
  var className = "simpleHttpUtilities";

  var http = require('http');
  var https = require('https');
  var util = require('util');
  var querystring = require('querystring');
  var sjv = require('simple-js-validator');
  var Promise = require('promise');

  /**
   * Builds the options object
   *
   * @param fnInputs      The inputs into the function.
   * Required: host, port, path; Optional:auth OR userName, password, useHeader
   *
   * ***Examples:***
   *
   *      fnInputs = {
   *        host: "localhost",
   *        port: 80,
   *        path: "/some/endpoint"
   *      };
   *
   *      fnInputs = {
   *        host: "localhost",
   *        port: 80,
   *        path: "/some/endpoint",
   *        contentType: "application/json",
   *        auth: "{Authorization: 'Basic " + new Buffer(username + ':' + password).toString('base64') + "'}"
   *      };
   *
   *      fnInputs = {
   *        host: "localhost",
   *        port: 80,
   *        path: "/some/endpoint",
   *        contentType: "application/json",
   *        userName: "someUserName",
   *        password: "somePassword",
   *        useHeader: true
   *      };
   *
   * @returns {Object}    The options json object
   */
  var buildOptions = function (fnInputs) {
    return new Promise(function(fulfill, reject) {
      var functionName = className + ".buildOptions";
      sjv.validateFunctionInputsAreNotEmpty(fnInputs, ['host','port','path'], functionName);

      var options = {
        host: fnInputs.host,
        port: fnInputs.port,
        path: fnInputs.path,
        headers: {}
      };

      if (sjv.isNotEmpty(fnInputs.contentType)) {
        options.headers["Content-Type"] = fnInputs.contentType;
      }

      if (sjv.isNotEmpty(fnInputs.auth)) {

        options.auth = fnInputs.auth;

      } else {

        if (sjv.isNotEmpty(fnInputs.userName)) {

          if (sjv.isTrue(fnInputs.useHeader)) {
            options.headers = {Authorization: 'Basic ' + new Buffer(fnInputs.userName + ':' + fnInputs.password).toString('base64')};
          } else {
            options.auth = 'Basic ' + new Buffer(fnInputs.userName + ':' + fnInputs.password).toString('base64');
          }
        }
      }

      return fulfill(options);
    });
  };

  /**
   * Performs a http get via http/https and returns the response
   *
   * @param options       The options to pass to the http call [http request options node documentation](http://nodejs.org/api/http.html#http_http_request_options_callback)
   * Required: options; Optional: useHttps
   *
   * ***Examples:***
   *
   *      fnInputs = {
   *        options: {
   *          host: "localhost",
   *          port: 80,
   *          path: "/endpoint",
   *          auth: 'Basic ' + new Buffer(username + ':' + password).toString('base64')
   *        }
   *      };
   *
   *      fnInputs = {
   *        useHttps: true,
   *        options: {
   *          host: "localhost",
   *          port: 80,
   *          path: "/endpoint",
   *          headers: {
   *            Authorization: 'Basic ' + new Buffer(username + ':' + password).toString('base64')
   *          }
   *        }
   *      };
   *
   * @returns {String}    The response
   */
  var get = function (fnInputs) {
    return new Promise(function(fulfill, reject) {
      var functionName = className + ".get";
      sjv.validateFunctionInputsAreNotEmpty(fnInputs, ['options'], functionName);
      sjv.validateInputsAreNotEmpty(fnInputs.options, ['host','port','path'], 'fnInputs.options', functionName);

      fnInputs.options.method = 'GET';
      fnInputs.writeToBody = false;
      fnInputs.body = {};

      return performHttpRequest(fnInputs).done(fulfill, reject);
    });
  };

  /**
   * Performs a http get via http/https and returns the response parsed as json
   *
   * @param options       The options to pass to the http call [http request options node documentation](http://nodejs.org/api/http.html#http_http_request_options_callback)
   * Required: options; Optional: useHttps
   *
   * ***Examples:***
   *
   *      fnInputs = {
   *        options: {
   *          host: "localhost",
   *          port: 80,
   *          path: "/endpoint",
   *          auth: 'Basic ' + new Buffer(username + ':' + password).toString('base64')
   *        }
   *      };
   *
   *      fnInputs = {
   *        useHttps: true,
   *        options: {
   *          host: "localhost",
   *          port: 80,
   *          path: "/endpoint",
   *          headers: {
   *            Authorization: 'Basic ' + new Buffer(username + ':' + password).toString('base64')
   *          }
   *        }
   *      };
   *
   * @returns {Object}    The json object
   */
  var getJson = function (fnInputs) {
    return new Promise(function(fulfill, reject) {
      var functionName = className + ".getJson";
      sjv.validateFunctionInputsAreNotEmpty(fnInputs, ['options'], functionName);
      sjv.validateInputsAreNotEmpty(fnInputs.options, ['host','port','path'], 'fnInputs.options', functionName);

      get(fnInputs).then(function (fulfilled) {
        try {

          var data = JSON.parse(fulfilled);
          return fulfilled(data);

        } catch (err) {
          var errMsg = 'The response is not valid JSON. {error:%s, response:%s}';
          return reject(new Error(util.format(errMsg, err.message, fulfilled)));
        }
      }).done(fulfill, reject);
    });
  };

  /**
   * Performs a http post via http/https and returns the response
   *
   * @param options       The options to pass to the http call [http request options node documentation](http://nodejs.org/api/http.html#http_http_request_options_callback)
   * Required: options; Optional: useHttps, body
   *
   * ***Examples:***
   *
   *      fnInputs = {
   *        options: {
   *          host: "localhost",
   *          port: 80,
   *          path: "/endpoint",
   *          auth: 'Basic ' + new Buffer(username + ':' + password).toString('base64')
   *        }
   *      };
   *
   *      fnInputs = {
   *        useHttps: true,
   *        body: {
   *          some: "var"
   *        },
   *        options: {
   *          host: "localhost",
   *          port: 80,
   *          path: "/endpoint",
   *          headers: {
   *            Authorization: 'Basic ' + new Buffer(username + ':' + password).toString('base64')
   *          }
   *        }
   *      };
   *
   * @returns {String}    The response
   */
  var post = function (fnInputs) {
    return new Promise(function(fulfill, reject) {
      var functionName = className + ".post";
      sjv.validateFunctionInputsAreNotEmpty(fnInputs, ['options'], functionName);
      sjv.validateInputsAreNotEmpty(fnInputs.options, ['host','port','path'], 'fnInputs.options', functionName);

      fnInputs.options.method = 'POST';
      fnInputs.writeToBody = true;
      fnInputs.body = sjv.isEmpty(fnInputs.body) ? {} : fnInputs.body;

      return performHttpRequest(fnInputs).done(fulfill, reject);
    });
  };

  /**
   * Performs a http post via http/https and returns the response parsed as json
   *
   * @param options       The options to pass to the http call [http request options node documentation](http://nodejs.org/api/http.html#http_http_request_options_callback)
   * Required: options; Optional: useHttps, body
   *
   * ***Examples:***
   *
   *      fnInputs = {
   *        options: {
   *          host: "localhost",
   *          port: 80,
   *          path: "/endpoint",
   *          auth: 'Basic ' + new Buffer(username + ':' + password).toString('base64')
   *        }
   *      };
   *
   *      fnInputs = {
   *        useHttps: true,
   *        body: {
   *          some: "var"
   *        },
   *        options: {
   *          host: "localhost",
   *          port: 80,
   *          path: "/endpoint",
   *          headers: {
   *            Authorization: 'Basic ' + new Buffer(username + ':' + password).toString('base64')
   *          }
   *        }
   *      };
   *
   * @returns {Object}    The json object
   */
  var postJson = function (fnInputs) {
    return new Promise(function(fulfill, reject) {
      var functionName = className + ".postJson";
      sjv.validateFunctionInputsAreNotEmpty(fnInputs, ['options'], functionName);
      sjv.validateInputsAreNotEmpty(fnInputs.options, ['host','port','path'], 'fnInputs.options', functionName);

      post(fnInputs).then(function (fulfilled) {
        try {

          var data = JSON.parse(fulfilled);
          return fulfilled(data);

        } catch (err) {
          var errMsg = 'The response is not valid JSON. {error:%s, response:%s}';
          return reject(new Error(util.format(errMsg, err.message, fulfilled)));
        }
      }).done(fulfill, reject);
    });
  };

  /**
   * Performs a http put via http/https and returns the response
   *
   * @param options       The options to pass to the http call [http request options node documentation](http://nodejs.org/api/http.html#http_http_request_options_callback)
   * Required: options; Optional: useHttps
   *
   * ***Examples:***
   *
   *      fnInputs = {
   *        options: {
   *          host: "localhost",
   *          port: 80,
   *          path: "/endpoint",
   *          auth: 'Basic ' + new Buffer(username + ':' + password).toString('base64')
   *        }
   *      };
   *
   *      fnInputs = {
   *        useHttps: true,
   *        options: {
   *          host: "localhost",
   *          port: 80,
   *          path: "/endpoint",
   *          headers: {
   *            Authorization: 'Basic ' + new Buffer(username + ':' + password).toString('base64')
   *          }
   *        }
   *      };
   *
   * @returns {String}    The response
   */
  var put = function (fnInputs) {
    return new Promise(function(fulfill, reject) {
      var functionName = className + ".put";
      sjv.validateFunctionInputsAreNotEmpty(fnInputs, ['options'], functionName);

      fnInputs.options.method = 'PUT';
      fnInputs.writeToBody = true;
      fnInputs.body = sjv.isEmpty(fnInputs.body) ? {} : fnInputs.body;

      return performHttpRequest(fnInputs).done(fulfill, reject);
    });
  };

  var stringifyBody = function (fnInputs) {
    return new Promise(function(fulfill, reject) {
      var functionName = className + ".put";
      sjv.validateFunctionInputsAreNotEmpty(fnInputs, ['writeToBody'], functionName);

      var bodyStringified;

      if (fnInputs.writeToBody) {
        if (fnInputs.contentType === "application/json") {
          bodyStringified = JSON.stringify(fnInputs.body);
        } else if (fnInputs.contentType === "text/xml") {
          bodyStringified = fnInputs.body;
        } else {
          bodyStringified = querystring.stringify(fnInputs.body);
        }
      }

      return fulfill(bodyStringified);
    });
  };

  var performHttpRequest = function (fnInputs) {
    return new Promise(function(fulfill, reject) {
      var functionName = className + ".performHttpRequest";
      sjv.validateFunctionInputsAreNotEmpty(fnInputs, ['writeToBody','options'], functionName);
      sjv.validateInputsAreNotEmpty(fnInputs.options, ['host','port','path'], 'fnInputs.options', functionName);

      var httpType = sjv.isTrue(fnInputs.useHttps) ? https : http;

      var contentType = null;

      if (sjv.isNotEmpty(fnInputs.options.header) && sjv.isNotEmpty(fnInputs.options.headers["Content-Type"])) {
        contentType = fnInputs.options.headers["Content-Type"];
      }

      var stringifiedInputs = {
        writeToBody: fnInputs.writeToBody,
        body: fnInputs.body,
        contentType: contentType
      };

      stringifyBody(stringifiedInputs).then(function (bodyStringified) {

        var req = httpType.request(fnInputs.options, function (httpRes) {

          var httpResData = "";

          httpRes.on("data", function (chunk) {
            httpResData += chunk;
          });

          httpRes.on("end", function () {
            return fulfill({
              statusCode: this.statusCode,
              response: httpResData
            });
          });

          httpRes.on("error", function (err) {
            return reject(err);
          });
        });

        req.on('error', function (error) {
          return reject(error);
        });

        if (fnInputs.writeToBody) {
          req.write(bodyStringified);
        }

        req.end();
      }).done(fulfill, reject);
    });
  };

  return {
    buildOptions: buildOptions,
    get: get,
    getJson: getJson,
    post: post,
    postJson: postJson,
    put: put
  };

}();
