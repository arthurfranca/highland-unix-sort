var _ = require('highland'),
    assert = require('chai').assert,
    sort = require('../index');

describe('sort', function() {
  it('sorts by a single key', function(done) {
    _([
      {name: 'sam'},
      {name: 'joe'},
      {},
      {name: 'alice'}
    ])
    .through(sort(['name']))
    .toArray(function(results) {
      assert.deepEqual(results, [
        {},
        {name: 'alice'},
        {name: 'joe'},
        {name: 'sam'}
      ]);
      done();
    });
  });

  it('sorts by multiple keys', function(done) {
    _([
      {name: 'sam', species: 'penguin'},
      {name: 'joe', species: 'rabbit'},
      {name: 'alice', species: 'aardvark'},
      {name: 'sam', species: 'cat'},
      {name: 'alice', species: 'bear'}
    ])
    .through(sort(['name', 'species']))
    .toArray(function(results) {
      assert.deepEqual(results, [
        {name: 'alice', species: 'aardvark'},
        {name: 'alice', species: 'bear'},
        {name: 'joe', species: 'rabbit'},
        {name: 'sam', species: 'cat'},
        {name: 'sam', species: 'penguin'}
      ]);
      done();
    });
  });

  it('requires a key', function() {
    function noKey() {
      return sort([]);
    }

    assert.throws(noKey, 'one or more sort keys are required');
  });

  it('does not handle type errors', function(done) {
    var isErrorPassed = false;
    _([
      {name: 'sam'},
      {name: 'joe'},
      undefined,
      {name: 'alice'}
    ])
    .through(sort(['name']))
    .errors(function(error, push) {
      assert.equal(error.message, 'Cannot read property \'name\' of undefined');
      isErrorPassed = true;
    })
    .toArray(function() {
      assert.isTrue(isErrorPassed);
      done();
    });
  });

  it('sorts primitive numbers', function(done) {
    _([
      {key: 10, name: 'sam'},
      {key: 5, name: 'joe'},
      {},
      {key: 20, name: 'alice'}
    ])
    .through(sort(['key']))
    .toArray(function(results) {
      assert.deepEqual(results, [
        {},
        {key: 10, name: 'sam'},
        {key: 20, name: 'alice'},
        {key: 5, name: 'joe'}
      ]);
      done();
    });
  });

  it('lets errors pass through', function(done) {
    var isErrorPassed = false;

    _(function(push, next) {
      push(null, {name: 'sam'});
      push(null, {name: 'joe'});
      push(null, {});
      push(new Error('find me!'));
      push(null, {name: 'alice'});
      push(null, _.nil);
    })
    .through(sort(['name']))
    .errors(function(error) {
      assert.equal(error.message, 'find me!');
      isErrorPassed = true;
    })
    .toArray(function(results) {
      assert.deepEqual(results, [
        {},
        {name: 'alice'},
        {name: 'joe'},
        {name: 'sam'}
      ]);
      assert.isTrue(isErrorPassed);
      done();
    });

  });
});
