'use strict';

var expect = require('chai').expect;
var errorcode = require('./errorcode');

describe('errorcode', function () {

  describe('.add', function () {
    
    it('returns the error with status field', function () {
      
      var err = errorcode.add(404, new Error('testError'));
      
      expect(err.message).to.be.equals('testError');
      expect(err.status).to.be.equals(404);
      
    });
    
    it('supports curring', function () {
      
      var err400 = errorcode.add(400);
      
      expect(typeof err400).to.be.equals('function');
      
      var err = err400(new Error('curringError'));
      
      expect(err.message).to.be.equals('curringError');
      expect(err.status).to.be.equals(400);
      
    });
    
    it('throws a ReferenceError if errorcode is null', function () {
      
      expect(function () { errorcode.add(null, new Error('nullStatus')); })
      .to.throws(ReferenceError);

    });
    
    it('throws an Error if err is null', function () {
      
      expect(function () { errorcode.add(100, null); }).to.throws(Error);

    });
    
  });

  describe('.register', function () {

    beforeEach(clearDictionary); 

    it ('adds the current message and code to the dictionary', function () {
      
      errorcode.register({ 'xyz': 204 });
      expect(errorcode._dictionary['xyz']).to.be.equals(204);
    
    });

    it ('accepts multiples entries', function () {
      
      errorcode.register({ 'abc': 100, 'rush.yyz': 200 });
      expect(errorcode._dictionary['abc']).to.be.equals(100);
      expect(errorcode._dictionary['rush.yyz']).to.be.equals(200);

    });

    it('throws an Error if a key is duplicated', function () {
      
      errorcode.register({ 'unique': 1 });
      expect(function () { errorcode.register({ 'unique': 2 }); }).to.throws(Error);

    });

    it ('throws a ReferenceError if argument is null', function () {
      expect(function () { errorcode.register(null); })
      .to.throws(ReferenceError);
    });

    it ('throws a ReferenceError if argument is undefined', function () {
      expect(function () { errorcode.register(); })
      .to.throws(ReferenceError);
    });

  });

  describe('.get', function () {

    beforeEach(clearDictionary);
    beforeEach(function () {
      errorcode.register({ 'myapi.error': 400 });
    });

    it ('returns the errorcode of the error message', function () {

      expect(errorcode.get(new Error('myapi.error'))).to.be.equals(400);

    });

    it ('returns the errorcode of the first word of error message is in dictionary', function () {

      expect(errorcode.get(new Error('myapi.error some error message'))).to.be.equals(400);

    });

    it ('returns 500 is the error message is not in the dictionary', function () {

      expect(errorcode.get(new Error('completely unpredictable error'))).to.be.equals(500);

    });

    it ('returns 500 if the error is null', function () {

      expect(errorcode.get(null)).to.be.equals(500);

    });

    it ('returns 500 if the has no message', function () {

      expect(errorcode.get(new Error())).to.be.equals(500);

    });

    it ('returns 500 if the error is undefined', function () {

      expect(errorcode.get()).to.be.equals(500);

    });

  });

  function clearDictionary() {
    
    Object.keys(errorcode._dictionary).map(function (key) {
      delete errorcode._dictionary[key];
    });

  }

});

