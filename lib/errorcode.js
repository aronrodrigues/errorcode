/**
 * Function to add status field to an error to be used with express.
 * @module errorcode
 */
'use strict';

var _ = require('lodash');
var _dictionary = {};

module.exports = {
  add: _.curry(add, 2),
  register: register,
  get: get,
  _dictionary: _dictionary
};

/**
 * Add the status to an error.
 * @param {number} status http status code.
 * @param {Error} error the error which the status will be appended.
 * @return {Error} error with the status.
 * @throws Error when missing any argument.
 * @deprecated
 */
function add (status, err) {

  if (status) {
    
    err.status = status;
    return err;
    
  } else {
    throw new ReferenceError('Missing status code.'); 
  }
  
}

/**
 * Adds the current object to the dictionary
 * @param {object} object mapping a message to an errorcode
 */
function register (data) {

  if (data && typeof data === 'object') {
    _.assign(_dictionary, data);
  } else {
    throw new ReferenceError('Missing status code.'); 
  }
  
}

/**
 * Gets the error code for the first word of the error message or 500
 * @param {object} error with message
 */
function get (err) {

  if (err && err.message) {

    var key = err.message.split(' ')[0];

    return _dictionary[key] || 500; 
    
  } else {
    return 500;
  }
  
}
