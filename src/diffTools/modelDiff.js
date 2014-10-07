var R = require('ramda');
var Q = require('q');
var utils = require('../utilities');
var entity = require('../dataModels/entity');
var diffTools = require('./diffUtils');


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
 * Performs a diff of the two files, returing the result
 **/
var diffModels = function (previousModelFilePath, currentModelFilePath) {
  return loadEntityVersions(previousModelFilePath, currentModelFilePath)
    .spread(diffTools.diffObjects)
    .then(diffTools.pruneDiff)
}


module.exports = {
  'diffModels': diffModels
}