var _ = require('highland'),
    spawn = require('child_process').spawn,
    throughProcess = require('highland-process').through;

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

  if (!keys || !keys.length) {
    throw new Error('one or more sort keys are required');
  }

  function through(stream) {
    initSort();
    initCut();

    return stream
      .map(toSort)
      .through(throughProcess(sort))
      .through(throughProcess(cut))
      .split()
      .filter(filterEmpty)
      .map(parseJSON);
  }

  function initSort() {
    var args = ['-s', '-t', delimiter];

    for (var i = 0; i < keys.length; i++) {
      args.push('-k');
      args.push((i + 1) + ',' + (i + 1));
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

        // trim off quotes produced by JSON.stringify
        // note that quotes aren't always produced
        if (keyValue[0] === '"' && keyValue[keyValue.length - 1] === '"') {
          keyValue = keyValue.substring(1, keyValue.length - 1);
        }
      }

      keyValues.push(keyValue);
    }

    return keyValues.join(delimiter) + delimiter + JSON.stringify(value) + '\n';
  }

  function filterEmpty(line) {
    return line !== '';
  }

  function parseJSON(line) {
    return JSON.parse(line);
  }

  return through;
};
