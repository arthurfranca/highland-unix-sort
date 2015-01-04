var _ = require('highland'),
    spawn = require('child_process').spawn;

/**
 * highlandUnixSort
 *
 * @param keys
 * @return {Stream} Highland stream to pipe objects to.
 */
module.exports = function highlandUnixSort(keys) {
  var delimiter = '\t',
      sort,
      cut;

  function through(stream) {
    initSort();
    initCut();

    return stream
      .map(toSort)
      .through(throughProcess(sort))
      .through(throughProcess(cut))
      .split()
      .map(parseJSON);
  }

  function initSort() {
    var args = ['-s', '-t', delimiter];

    for (var i = 1; i < keys.length; i++) {
      args.push('-k');
      args.push(i + ',' + i);
    }

    sort = spawn('sort', args);
  }

  function initCut() {
    cut = spawn('cut', ['-d', delimiter, '-f', keys.length + 1]);
  }

  function toSort(value) {
    var line = '',
        keyValues = [],
        keyValue;

    for (var i = 0; i < keys.length; i++) {
      if (typeof value[keys[i]] === 'undefined') {
        keyValue = '';
      } else {
        // stringify to escape special characters, substring to remove quotes on edges
        keyValue = JSON.stringify(value[keys[i]]);
        keyValue = keyValue.substring(1, keyValue.length);
      }

      keyValues.push(keyValue);
    }

    return keyValues.join(delimiter) + delimiter + JSON.stringify(value) + '\n';
  }

  function parseJSON(line) {
    return JSON.parse(line);
  }

  function throughProcess(process) {
    return function(stream) {
      stream.pipe(process.stdin);
      return _(process.stdout);
    };
  }

  return through;
};
