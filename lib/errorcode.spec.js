'use strict';

/*jshint expr: true*/

var expect = require('chai').expect;
var errorcode = require('./errorcode');
var logger = require('bunyan').createLogger({ name: 'TestLogger', level: 'fatal' });
var sinon = require('sinon');
var sandbox = null;

describe('errorcode', function () {

  beforeEach(function () {

    sandbox = sinon.sandbox.create();
    sandbox.spy(logger, 'debug');
    sandbox.spy(logger, 'warn');

  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('.register', function () {

    beforeEach(clearDictionary);

    it('adds the current regexp handler and status to the dictionary', function () {
      
      errorcode.register([{ regexp: /^Test.*/, status: 404 }]);
      expect(errorcode._dictionary[0].status).to.be.equals(404);
      expect(errorcode._dictionary[0].regexp.toString()).to.be.equals(/^Test.*/.toString());
    
    });

    it('adds the current function handler and status to the dictionary', function () {
      
      errorcode.register([{ func: function (err) { return true; }, status: 401 }]);
      expect(errorcode._dictionary[0].status).to.be.equals(401);
      expect(errorcode._dictionary[0].func()).to.be.true;
    
    });

    it('accepts multiples entries', function () {
      
      errorcode.register([{
        regexp: /^Test.*/, status: 401
      }, {
        func: function (err) { return true; }, status: 402
      }]);
      expect(errorcode._dictionary[0].status).to.be.equals(401);
      expect(errorcode._dictionary[0].regexp.toString()).to.be.equals(/^Test.*/.toString());
      expect(errorcode._dictionary[1].status).to.be.equals(402);
      expect(errorcode._dictionary[1].func()).to.be.true;
    
    });

    it('uses the default logger if none is suplied', function () {
      
      errorcode.register([{ regexp: /^Test.*/, status: 404 }]);
      expect(logger.debug.called).to.be.false;

    });

    it('uses the argument logger', function () {
      
      errorcode.register([{ regexp: /^Test.*/, status: 404 }], logger);
      expect(logger.debug.calledOnce).to.be.true;

    });

    it('throws a ReferenceError if handler is invalid', function () {
      expect(function () { errorcode.register([{ wrong: 'obj', status: 404 }]); })
      .to.throws(ReferenceError);
    });

    it('throws a ReferenceError if argument is null', function () {
      expect(function () { errorcode.register(null); })
      .to.throws(ReferenceError);
    });

    it('throws a ReferenceError if argument is not an array (string)', function () {
      expect(function () { errorcode.register('usingIt', 'wrong'); })
      .to.throws(ReferenceError);
    });

    it('throws a ReferenceError if argument is not an array (object)', function () {
      expect(function () { errorcode.register({ 'usingIt': 'wrong' }); })
      .to.throws(ReferenceError);
    });

    it('throws a ReferenceError if argument is undefined', function () {
      expect(function () { errorcode.register(); })
      .to.throws(ReferenceError);
    });

  });

  describe('.get', function () {

    var ticks = 10;

    beforeEach(clearDictionary);
    beforeEach(function () {

      var clock = sandbox.useFakeTimers();

      errorcode.register([{
        regexp: /^Test.*/, status: 401
      }, {
        func: function (err) {

          clock.tick(ticks);
          return err instanceof ReferenceError;

        }, status: 402
      }]);

    });

    it('returns the errorcode of the error message begining with Test', function () {
      expect(errorcode.get(new Error('TestMessage'))).to.be.equals(401);
    });

    it('returns the errorcode of the error instanceof ReferenceError', function () {
      expect(errorcode.get(new ReferenceError('Blah'))).to.be.equals(402);
    });

    it('returns 500 is the error message is not in the dictionary', function () {
      expect(errorcode.get(new Error('completely unpredictable error'))).to.be.equals(500);
    });

    it('returns 500 if the error is null', function () {
      expect(errorcode.get(null)).to.be.equals(500);
    });

    it('returns 500 if the error is undefined', function () {
      expect(errorcode.get()).to.be.equals(500);
    });

    it('uses the default logger if none is suplied', function () {

      errorcode.get(new Error('TestMessage'));
      expect(logger.debug.called).to.be.false;

    });

    it('uses the argument logger', function () {
      
      errorcode.get(new Error('TestMessage'), logger);
      expect(logger.debug.calledOnce).to.be.true;

    });

    it('logs a warning if elapsedThreshould is hit', function () {
      
      ticks = errorcode.elapsedThreshould + 1;
      errorcode.get(new ReferenceError('Blah'), logger);
      expect(logger.warn.calledOnce).to.be.true;

    });

  });

  function clearDictionary() {
    errorcode._dictionary.length = 0;
  }

});

