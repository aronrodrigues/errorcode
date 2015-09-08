/**
 * Function to add status field to an error to be used with express.
 * @module errorcode
 */
'use strict';

var _ = require('lodash');

/**
 * Appends the status to an error.
 * @param {number} status http status code.
 * @param {Error} error the error which the status will be appended.
 * @return {Error} error with the status.
 * @throws Error when missing any argument.
 */
function errorcode (status, err) {

  if (status) {
    
    err.status = status;
    return err;
    
  } else {
    throw new ReferenceError('Missing status code.'); 
  }
  
}

module.exports = _.curry(errorcode, 2);
