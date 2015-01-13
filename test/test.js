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

  it('does not handle type errors', function() {
    function causeError() {
      _([
        {name: 'sam'},
        {name: 'joe'},
        undefined,
        {name: 'alice'}
      ])
      .through(sort(['name']));
    }

    assert.throws(causeError, 'Cannot read property \'name\' of undefined');
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
});
