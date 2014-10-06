var fs = require('fs');
var Q = require('q');
var R = require('ramda');
var xml2js = require('xml2js');
var eyes = require('eyes');

/* ==== Logging Helpers ==== */

/**
 * A customized 'eyes' inspector for xml2js objects.
 **/
var inspect = eyes.inspector({
  hideFunctions: true,
  styles: {
    all:    'grey',
    key:    'blue',
    string: 'yellow',
  }
});


/* ==== Functional Helpers ==== */

/**
 * Taps into a method chain by calling the provided function on the argument
 * and returning the argument. Perfect for sticking in a promise .then()
 * clause.
 **/
var tapChain = R.flip(R.tap)

/**
 * Returns a deep clone of an object. Note: Not designed to handle circular
 * references.
 */
var clone = function (obj) {
  //TODO Make this an actual deep clone
  return R.cloneObj(obj);
}

/**
 * Returns a copy of object with all keys except thos contained in blacklist.
 **/
var pickExcept = R.curry(function (blacklist, object) {
    return R.pickWith(
      R.flip(
        R.not(
          R.flip(R.contains)(blacklist)
        )
      ),
      object
    );
});

/* ==== Parsing Helpers ==== */

/**
 * Promisified version of the xml2js lib's 'parseString' function
 **/
var parseXMLFile = function (fileName, options) {
  var xmlParser = new xml2js.Parser(options);
  var parseXmlString = Q.nbind(xmlParser.parseString, xmlParser);
  return Q.nfcall(fs.readFile, fileName).then(parseXmlString);
}


module.exports = {
  //Logging
  'inspect': inspect,
  'tapInspect': tapChain(inspect),

  //Functional Helpers
  'tapChain': tapChain,
  'clone': clone,
  'pickExcept': pickExcept,

  //Parsing Helpers
  'parseXMLFile': parseXMLFile
}
