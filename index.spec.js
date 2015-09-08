'use strict';

var expect = require('chai').expect;
var index = require('./index');
var errorcode = require('./lib/errorcode');

describe('index', function () {
  
  it('returns the errorcode module', function () {
    
    expect(typeof index).to.be.equals('function');
    expect(index).to.be.equals(errorcode);
    
  });
  
});
