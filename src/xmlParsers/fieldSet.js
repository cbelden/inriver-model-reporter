var R = require('ramda');

/* fieldSet.js
 *
 * This module defines operations on FieldSet objects and collections.
 */

/* ==== Functions ==== */

/**
 * Retrieves all FieldSets in the passed Model object
 **/
var getAll = R.path('Model.FieldSets.0.FieldSet');

/**
 * Retrieve all FieldTypeIds in the given FieldSet
 **/
var getFieldTypeIds = R.path('FieldTypes.0.FieldTypeId');

/**
 * Retrieves specific info for the passed FieldSet
 **/
var getInfo = function (fieldSet) {
  return {
    'FieldSetId': R.path('Id.0', fieldSet),
    'EntityTypeId': R.path('EntityTypeId.0', fieldSet),
    'FieldTypeIds': getFieldTypeIds(fieldSet)
  };
};

/**
 * Retrieve all FieldSets with the matching EntityTypeId
 **/
var filterByEntityTypeId = R.curry(function (entityTypeId, fieldSets) {
  var hasEntityTypeId = R.propEq('EntityTypeId', entityTypeId);
  return R.filter(hasEntityTypeId, fieldSets);
});


/* ==== Exports ==== */

module.exports = {
  'getAll': getAll,
  'getInfo': getInfo,
  'filterByEntityTypeId': filterByEntityTypeId
};
