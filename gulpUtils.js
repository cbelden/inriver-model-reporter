var R = require('ramda');
var fs = require('fs-extra');


/**
 * Given an object mapping platforms to options, examines the process.platform
 * environment variable to choose an option. If a suitable option isn't found,
 * returns the value under the 'default' key.
 **/
var pickByPlatform = function (options) {
  if (R.contains(process.platform, R.keys(options))) {
    return options[process.platform];
  } else {
    return options['default'];
  }
}

/**
 * Takes an array containing two filepaths and performs a copy from the first
 * path to the second.
 **/
var copyPair = function (pathPair) {
  fs.copySync.apply(fs, pathPair);
}

/**
 * Return a function that runs all function arguments in order. Differs from
 * R.pipe or R.compose in that it does not past intermediate values between
 * functions.
 **/
var runAll = function () {
  var isFn = R.pipe(function (obj) { return typeof obj; }, R.eq("function"));
  var filterFns = R.filter(isFn);
  var callFn = R.func('call');
  var callFns = R.pipe(filterFns, R.forEach(callFn));
  return R.nAry(0, R.lPartial(callFns, arguments));
}


module.exports = {
  'pickByPlatform': pickByPlatform,
  'copyPair': copyPair,
  'runAll': runAll
}
