var R = require('ramda');
var entityType = require('./entityType');
var fieldSet = require('./fieldSet');

/* model.js
 *
 * This module defines operations on Model objects.
 */

/* ==== Functions ==== */

/**
 * Retrieves info for all FieldSets in the specified Model
 **/
var getFieldSetInfo = R.pipe(
  fieldSet.getAll,
  R.map(fieldSet.getInfo)
);

/**
 * Retrieves info for all EntityTypes in the specified Model
 **/
var getEntityTypeInfo = R.pipe(
  entityType.getAll,
  entityType.filterLinkEntities,
  R.map(entityType.getInfo)
);


/* ==== Exports ==== */

module.exports = {
  'getFieldSetInfo': getFieldSetInfo,
  'getEntityTypeInfo': getEntityTypeInfo
};
