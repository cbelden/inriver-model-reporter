var R = require('ramda');
var xmlEntityType = require('../xmlParsers/entityType');
var xmlModel = require('../xmlParsers/model');

/* entity.js
 *
 * This module is responsible for constructing the model for Entities.
 * Example:
 * {
 *   EntityId: 'Item',
 *   FieldSets: [
 *     {
 *       FieldSetId: 'ItemBook',
 *       FieldTypeIds: [
 *         'ItemBestseller',
 *         'ItemDownloadURL',
 *         'ItemHeight',
 *         'ItemIllustrations',
 *         'ItemISBN13',
 *         'ItemLanguage',
 *         'ItemLength',
 *         'ItemPages',
 *         'ItemPeerReviewed',
 *         'ItemWeight',
 *         'ItemWidth'
 *       ]
 *     },
 *     ...
 *   ],
 *   FieldTypes: [
 *     {
 *       Id: 'ItemAboutTheEditors',
 *       DataType: 'LocaleString',
 *       CategoryId: 'Subscription',
 *       Hidden: 'False',
 *       ExcludeFromDefaultView: 'True',
 *       ReadOnly: 'False'
 *     },
 *     ...
 *   ]
 * }
 *
 */

/* ==== Functions ==== */

/**
 * Pick out relevant FieldSet info
 **/
var pickFieldSetInfo = function (fieldSet) {
  return {
    'Id': fieldSet.FieldSetId,
    'FieldTypeIds': fieldSet.FieldTypeIds
  };
}

/**
 * Retrieve FieldSet info for the given EntityType
 **/
var getEntityFieldSetInfo = R.pipe(
  xmlEntityType.getFieldSets,
  R.map(pickFieldSetInfo)
);

/**
 * Create an Entity model for the given EntityType using the specified
 * FieldSets
 **/
var createEntity = R.curry(function (fieldSets, entityType) {
  return {
    'Id': entityType.EntityId,
    'FieldTypes': entityType.FieldTypes,
    'FieldSets': getEntityFieldSetInfo(entityType, fieldSets)
  };
});

/**
 * Parse the provided XML model and create a list of Entities
 **/
var parseModels = function (mdl) {
  var parseEntityType = R.map(
    createEntity(xmlModel.getFieldSetInfo(mdl))
  );
  return R.pipe(
    xmlModel.getEntityTypeInfo,
    parseEntityType
  )(mdl);
}


/* ==== Exports ==== */

module.exports = {
  'parseModels': parseModels
};
