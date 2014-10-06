var R = require('ramda');
var Utilities = require('../utilities');

/**
 * Returns a recursive diff report for the given field on the provided objects
 **/
var diffField = R.curry(function(objA, objB, field) {
  // Check if the passed object has the field
  var hasField = R.not(
    R.pipe(
      R.get(field),
      R.eq(undefined)
    )
  );
  // Check if the field on the passed object is an object
  var isFieldObject = R.pipe(
    R.get(field),
    R.is(Object)
  );
  // Create the diff report object
  var report = {
    'fieldName': field,
    'exists': {
      'a': hasField(objA),
      'b': hasField(objB)
    },
    'isEqual': false,
    'subDiff': null
  };
  // Only calculate a sub diff if both properties are objects.
  if (report.exists.a && report.exists.b) {
    if (isFieldObject(objA) && isFieldObject(objB)) {
      report.subDiff = diffObjects(objA[field], objB[field]);
      report.isEqual = R.every(R.get('isEqual'), report.subDiff);
    } else {
      report.isEqual = R.eqProps(field, objA, objB);
    }
  }

  return report;
})

/**
 * Generate a recursive diff for the given objects. Note: not intended to
 * handle circular references!
 */
var diffObjects = function (objA, objB) {
  var getAllFields = R.useWith(R.union, R.keys, R.keys);
  var diffFieldOnObjects =diffField(objA, objB);
  return R.pipe(
      getAllFields,
      R.map(diffFieldOnObjects)
  )(objA, objB);
}

/**
 * Iterative step of pruneDiff that handles pruning field diffs.
 */
var pruneDiffField = function (diff) {
  if (diff.isEqual)
    return null;

  if (diff.subDiff === null)
    return Utilities.clone(diff);

  var clonedDiff = R.pipe(
    Utilities.pickExcept(["subDiff"]),
    Utilities.clone
  )(diff);
  clonedDiff.subDiff = pruneDiff(diff.subDiff);
  return clonedDiff
}

/**
 * Returns a copy of the provided diff with all unchanged subtrees removed
 **/
var pruneDiff = function (diff) {
  var isNotNull = R.not(R.eq(null));
  return R.pipe(
    R.map(pruneDiffField),
    R.filter(isNotNull)
  )(diff);
}


module.exports = {
  'diffObjects': diffObjects,
  'pruneDiff': pruneDiff
}
