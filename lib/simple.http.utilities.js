/**
 * @class Simple.Http.Utilities v0.1.2
 * A collection of utilities to expose simple get, post, put methods. Wraps the base http library.
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

  /**
   * Builds the options object
   *
   * @param fnInputs      The inputs into the function.
   * Required: host, port, path; Optional:auth OR username, password, useAuthHeader
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
   *        username: "someUserName",
   *        password: "somePassword",
   *        useAuthHeader: true
   *      };
   *
   * @returns {Object}    The options json object
   */
  var buildOptions = function (fnInputs, callback) {
    var functionName = className + ".buildOptions";
    sjv.validateFunctionInputsAreNotEmptyCallbackOnError(fnInputs, ['host', 'port', 'path'], functionName, callback);

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

      if (sjv.isNotEmpty(fnInputs.username)) {

        if (sjv.isTrue(fnInputs.useAuthHeader)) {
          options.headers.Authorization = 'Basic ' + new Buffer(fnInputs.userName + ':' + fnInputs.password).toString('base64');
        } else {
          options.auth = 'Basic ' + new Buffer(fnInputs.userName + ':' + fnInputs.password).toString('base64');
        }
      }
    }

    return callback(null, options);
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
  var get = function (fnInputs, callback) {
    var functionName = className + ".get";
    sjv.validateFunctionInputsAreNotEmptyCallbackOnError(fnInputs, ['options'], functionName, callback);
    sjv.validateInputsAreNotEmptyCallbackOnError(fnInputs.options, ['host', 'port', 'path'], 'fnInputs.options', functionName, callback);

    fnInputs.options.method = 'GET';
    fnInputs.writeToBody = false;
    fnInputs.body = {};

    return performHttpRequest(fnInputs, callback);
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
  var getJson = function (fnInputs, callback) {
    var functionName = className + ".getJson";
    sjv.validateFunctionInputsAreNotEmptyCallbackOnError(fnInputs, ['options'], functionName, callback);
    sjv.validateInputsAreNotEmptyCallbackOnError(fnInputs.options, ['host', 'port', 'path'], 'fnInputs.options', functionName, callback);

    return get(fnInputs, function(err, results) {
      if (err) {
        return callback(err, null);
      }

      try {

        var data = JSON.parse(results);
        return callback(null, data);

      } catch (err) {
        var errMsg = 'The response is not valid JSON. {error:%s, response:%s}';
        return callback(new Error(util.format(errMsg, err.message, results)), null);
      }
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
  var post = function (fnInputs, callback) {
    var functionName = className + ".post";
    sjv.validateFunctionInputsAreNotEmptyCallbackOnError(fnInputs, ['options'], functionName, callback);
    sjv.validateInputsAreNotEmptyCallbackOnError(fnInputs.options, ['host', 'port', 'path'], 'fnInputs.options', functionName, callback);

    fnInputs.options.method = 'POST';
    fnInputs.writeToBody = true;
    fnInputs.body = sjv.isEmpty(fnInputs.body) ? {} : fnInputs.body;

    return performHttpRequest(fnInputs, callback);
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
  var postJson = function (fnInputs, callback) {
    var functionName = className + ".postJson";
    sjv.validateFunctionInputsAreNotEmptyCallbackOnError(fnInputs, ['options'], functionName, callback);
    sjv.validateInputsAreNotEmptyCallbackOnError(fnInputs.options, ['host', 'port', 'path'], 'fnInputs.options', functionName, callback);

    return post(fnInputs, function (err, results) {
      if (err) {
        return callback(err, null);
      }

      try {

        var data = JSON.parse(results);
        return callback(null, data);

      } catch (err) {
        var errMsg = 'The response is not valid JSON. {error:%s, response:%s}';
        return callback(new Error(util.format(errMsg, err.message, results)), null);
      }
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
  var put = function (fnInputs, callback) {
    var functionName = className + ".put";
    sjv.validateFunctionInputsAreNotEmptyCallbackOnError(fnInputs, ['options'], functionName, callback);
    sjv.validateInputsAreNotEmptyCallbackOnError(fnInputs.options, ['host', 'port', 'path'], 'fnInputs.options', functionName, callback);

    fnInputs.options.method = 'PUT';
    fnInputs.writeToBody = true;
    fnInputs.body = sjv.isEmpty(fnInputs.body) ? {} : fnInputs.body;

    return performHttpRequest(fnInputs, callback);
  };

  var stringifyBody = function (fnInputs, callback) {
    var functionName = className + ".stringifyBody";
    sjv.validateFunctionInputsAreNotEmptyCallbackOnError(fnInputs, ['writeToBody'], functionName, callback);

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

    return callback(null, bodyStringified);
  };

  var performHttpRequest = function (fnInputs, callback) {
    var functionName = className + ".performHttpRequest";
    sjv.validateFunctionInputsAreNotEmptyCallbackOnError(fnInputs, ['writeToBody', 'options'], functionName, callback);
    sjv.validateInputsAreNotEmptyCallbackOnError(fnInputs.options, ['host', 'port', 'path'], 'fnInputs.options', functionName, callback);

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

    stringifyBody(stringifiedInputs, function (err, bodyStringified) {
      if (err) {
        return callback(err, null);
      }

      var req = httpType.request(fnInputs.options, function (httpRes) {

        var httpResData = "";

        httpRes.on("data", function (chunk) {
          httpResData += chunk;
        });

        httpRes.on("end", function () {
          return callback(null, {
            statusCode: this.statusCode,
            response: httpResData
          });
        });

        httpRes.on("error", function (err) {
          return callback(err.null);
        });
      });

      req.on('error', function (error) {
        return callback(error, null);
      });

      if (fnInputs.writeToBody) {
        req.write(bodyStringified);
      }

      req.end();
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
