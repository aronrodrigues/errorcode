'use strict';

var expect = require('chai').expect;
var errorcode = require('./errorcode');

describe('errorcode', function () {
  
  it('returns the error with status field', function () {
    
    var err = errorcode(404, new Error('testError'));
    
    expect(err.message).to.be.equals('testError');
    expect(err.status).to.be.equals(404);
    
  });
  
  it('supports curring', function () {
    
    var err400 = errorcode(400);
    
    expect(typeof err400).to.be.equals('function');
    
    var err = err400(new Error('curringError'));
    
    expect(err.message).to.be.equals('curringError');
    expect(err.status).to.be.equals(400);
    
  });
  
  it('throws a ReferenceError if errorcode is null', function () {
    
    expect(function () { errorcode(null, new Error('nullStatus')); })
    .to.throws(ReferenceError);

  });
  
  it('throws an Error if err is null', function () {
    
    expect(function () { errorcode(100, null); }).to.throws(Error);

  });
  
});
