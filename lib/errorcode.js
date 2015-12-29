/**
 * Function to add status field to an error to be used with express.
 * @module errorcode
 */
'use strict';

var _ = require('lodash');
var _dictionary = [];
var rootLogger = require('bunyan').createLogger({ name: 'errorcode' });
var elapsedThreshould = 50;

module.exports = {
  get: get,
  register: register,
  _dictionary: _dictionary,  
  elapsedThreshould: elapsedThreshould,
  logger: rootLogger
};

/**
 * Adds the current object to the dictionary
 * @param {object} object mapping a message to an errorcode
 */
function register (data, logger) {

  logger = logger || rootLogger;

  if (data && Array.isArray(data)) {
    
    _.forEach(data, function (handler) {

      if (handler.status && (handler.regexp || handler.func)) {

        logger.debug({ handler: handler }, 'errorcode.register');
        _dictionary.push(handler);

      } else {
        throw new ReferenceError('invalid handler ' + handler); 
      }

    });

  } else {
    throw new ReferenceError('errorcode.register() needs an array.'); 
  }
  
}

/**
 * Gets the error code for the first word of the error message or 500
 * @param {object} error with message
 */
function get (err, logger) {

  var elapsed = Date.now();
  var result = 500;
  var match = null;

  logger = logger || rootLogger;

  if (err) {

    _.forEach(_dictionary, function (handler) {

      if (handler.regexp && err.message && handler.regexp.test(err.message)) {
        match = handler;
      } else if (handler.func && handler.func(err)) {
        match = handler;
      }

      return !match;

    });

  }

  if (match && match.status) {
    result = match.status;
  }

  elapsed = Date.now() - elapsed;
  if (elapsed > elapsedThreshould) {
    logger.warn({ err: err, handler: match, elapsed: elapsed }, 'errorcode.get');
  } else {
    logger.debug({ err: err, handler: match, elapsed: elapsed }, 'errorcode.get');
  }

  return result;
  
}

/*

errorcode.register([
  { regexp: /^Test.*\/, status: 401 },
  { fn: function (err) { return false }, status: 401 },
  { startsWith: '401', status: 401 },
  { contains: '401', status: 401 },
  { endsWith: '401', status: 401 },
  { isA: EvalError, status: 401 },
]);

*/
 