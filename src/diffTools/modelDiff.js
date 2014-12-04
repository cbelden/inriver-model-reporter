var R = require('ramda');
var Q = require('q');
var utils = require('../utilities');
var entity = require('../dataModels/entity');


/**
 * Loads the two model files and parses them
 **/
var loadEntityVersions = function (previousFileName, currentFileName) {
  return Q.all([
    utils.parseXMLFile(previousFileName).then(entity.parseModels),
    utils.parseXMLFile(currentFileName).then(entity.parseModels)
  ]);
}

/**
 * Takes in the name of a field and two entities and returns a new object
 * containing the old and new version of that field.
 **/
var createVersionedField = R.curry(function (previousEntity, currentEntity, fieldName) {
  var previousField = previousEntity[fieldName];
  var currentField = currentEntity[fieldName];
  if (!R.isArrayLike(previousField) || !R.isArrayLike(currentField)) {
    return {
      previous: previousField,
      current: currentField,
      changed: previousField == currentField
    }
  }
  var createVersionedFieldItems = R.pipe(
    R.zip,
    R.map(function (itemPairs) {
      return {
        previous: itemPairs[0],
        current: itemPairs[1],
        changed: itemPairs[0] == itemPairs[1]
      };
    })
  );
  return createVersionedFieldItems(previousField, currentField);
});

/**
 * Accepts two versions of an entity and returns a single entity with versioned
 * fields as described in createVersionedField.
 **/
var createVersionedEntity = function (previousEntity, currentEntity) {
  var createVersionedFieldWithEntities = createVersionedField(previousEntity, currentEntity);
  var createVersionedKeyValuePairs = R.map(function (key) {
    return [key, createVersionedFieldWithEntities(key)];
  });
  var createVersionedEntityFromEntities = R.pipe(
    utils.getKeysFromAllObjects,
    createVersionedKeyValuePairs,
    R.fromPairs
  );
  return createVersionedEntityFromEntities(previousEntity, currentEntity);
}

/**
 * Maps entities from two models to a single array of versioned entities.
 **/
var createVersionedEntities = R.pipe(
  R.zip,
  R.map(R.apply(createVersionedEntity))
)

/**
 * Performs a diff of the two files, returing the result
 **/
var diffModels = function (previousModelFilePath, currentModelFilePath) {
  return loadEntityVersions(previousModelFilePath, currentModelFilePath)
    .spread(createVersionedEntities)
}


module.exports = {
  'diffModels': diffModels
}
