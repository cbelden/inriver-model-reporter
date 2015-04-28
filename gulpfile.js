var gulp = require('gulp');
var fetchAtomShell = require('gulp-download-atom-shell');
var fs = require('fs-extra');
var R = require('ramda');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var open = require('open');


/* ==== Config ==== */
var BOWER_LIBS = {
  'jquery': "bower_components/jquery/dist/",
  'semantic-ui': "bower_components/semantic-ui/build/packaged/",
  'angular': "bower_components/angular/"
};
var SOURCE_CODE_DIR = "src/";
var SOURCE_CODE_LIB_DIR = SOURCE_CODE_DIR + "lib/";
var ATOM_SHELL_DIR = "binaries/";
var ATOM_SHELL_APP_DIR = ATOM_SHELL_DIR + "resources/default_app/";
var ATOM_SHELL_EXECUTABLE = ATOM_SHELL_DIR + "electron";
var ATOM_SHELL_DEBUG_PORT = 5858;


/* ==== Helpers ==== */

/**
 * Copies the first element of the pair to the second
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


/* ==== Tasks ==== */
gulp.task('fetch-atom-shell',
  R.lPartial(fetchAtomShell, {
    version: '0.25.1',
    outputDir: ATOM_SHELL_DIR
  })
);

gulp.task('clean-partial',
  runAll(
    R.lPartial(fs.removeSync, ATOM_SHELL_APP_DIR),
    R.lPartial(fs.removeSync, SOURCE_CODE_LIB_DIR)
  )
);

gulp.task('clean-full',
  R.lPartial(fs.remove, ATOM_SHELL_DIR)
);

gulp.task('copy-bower-files',
  R.pipe(
    R.always(BOWER_LIBS),
    R.toPairs,
    R.forEach(
      R.pipe(
        R.zipWith(R.add, [SOURCE_CODE_LIB_DIR, ""]),
        R.reverse,
        copyPair
      )
    )
  )
);

gulp.task('deploy-sources', ['clean-partial', 'copy-bower-files'],
  R.lPartial(fs.copy, SOURCE_CODE_DIR, ATOM_SHELL_APP_DIR)
);

gulp.task('run-app', ['deploy-sources'],
  R.nAry(0,
    R.lPartial(spawn, ATOM_SHELL_EXECUTABLE)
  )
);

gulp.task('debug-app', ['deploy-sources'],
  runAll(
    R.lPartial(spawn, ATOM_SHELL_EXECUTABLE, ["--debug=" + ATOM_SHELL_DEBUG_PORT]),
    R.lPartial(exec, "node-inspector"),
    R.lPartial(
      open,
      "http://127.0.0.1:8080/debug?port=" + ATOM_SHELL_DEBUG_PORT
    )
  )
);

gulp.task('clean', ['clean-full']);
gulp.task('build', ['clean-full', 'fetch-atom-shell', 'deploy-sources']);
gulp.task('debug', ['debug-app']);
gulp.task('default', ['run-app']);
