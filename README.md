# Highland Unix Sort

A rewrite of [https://github.com/Clever/unix-sort](https://github.com/Clever/unix-sort) that uses [Highland](https://github.com/caolan/highland).
This performs a sort using the unix sort command.

## Install

    npm install highland-unix-sort

## Usage

    var _ = require('highland');
    var sort = require('highland-unix-sort');

    _([
      {name: 'sam'},
      {name: 'joe'},
      {},
      {name: 'alice'}
    ])
    .through(sort(['name'])
    .toArray(function(arr) { console.log(array); })
    // output is [ {}, { name: 'alice' }, { name: 'joe' }, { name: 'sam' } ]

