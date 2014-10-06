var R = require('ramda');
var fieldSet = require('./fieldSet');

/* entityType.js
 *
 * This module defines operations on EntityType objects and collections.
 */

/* ==== Constants ==== */

var FIELD_TYPE_INFO_FIELDS = [
  'Id',
  'DataType',
  'CVLId',
  'CategoryId',
  'Hidden',
  'ReadOnly'
];


/* ==== Functions ==== */

/**
 * Retrieves all EntityTypes in the passed Model object
 **/
var getAll = R.path('Model.EntityTypes.0.EntityType');

/**
 * Returns a bool indicating whether an EntityType is a link entity
 **/
var isLinkEntity = R.pipe(
  R.path('IsLinkEntityType.0'),
  R.eq('True')
);

/**
 * Filters the passed list of EntityTypes, removing all link entities
 **/
var filterLinkEntities = R.filter(R.not(isLinkEntity));

/**
 * Retrieves all raw FieldTypes from the passed EntityType
 **/
var getFieldTypes = R.path('FieldTypes.0.FieldType');

/**
 * Extracts specific info from the passed FieldType
 **/
var getFieldTypeInfo = R.pipe(
  R.pick(FIELD_TYPE_INFO_FIELDS),
  R.mapObj(R.get(0))
);

/**
 * Retrieves field info for all FieldTypes on the passed EntityType
 **/
var getEntityFieldTypeInfo = R.pipe(
  getFieldTypes,
  R.map(getFieldTypeInfo)
);

/**
 * Retrieves specific info for the passed EntityType
 **/
var getInfo = function (entity) {
  return {
    'EntityId': R.path('Id.0', entity),
    'FieldTypes': getEntityFieldTypeInfo(entity)
  }
};

/**
 * Retrieve the FieldSets for the given EntityType from the provided list of
 * FieldSets
 **/
var getFieldSets = R.curry(function (entityType, fieldSets) {
  return fieldSet.filterByEntityTypeId(entityType["EntityId"], fieldSets);
});


/* ==== Exports ==== */

module.exports = {
  'getAll': getAll,
  'filterLinkEntities': filterLinkEntities,
  'getInfo': getInfo,
  'getFieldSets': getFieldSets
};
