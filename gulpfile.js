var gulp = require('gulp');
var fetchAtomShell = require('gulp-download-atom-shell');
var fs = require('fs-extra');
var R = require('ramda');
var spawn = require('child_process').spawn;

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
var ATOM_SHELL_EXECUTABLE = ATOM_SHELL_DIR + "atom";

/* ==== Helpers ==== */

/**
 * Copies the first element of the pair to the second
 **/
var copyPair = function (pathPair) {
  fs.copySync.apply(fs, pathPair);
}

/* ==== Tasks ==== */
gulp.task('fetch-atom-shell',
  R.lPartial(fetchAtomShell, {
    version: '0.17.2',
    outputDir: ATOM_SHELL_DIR
  })
);

gulp.task('clean-partial',
  R.pipe(
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

gulp.task('run-app',
  R.nAry(0,
    R.lPartial(spawn, ATOM_SHELL_EXECUTABLE)
  )
);

gulp.task('clean', ['clean-full']);
gulp.task('build', ['clean-full', 'fetch-atom-shell', 'deploy-sources']);
gulp.task('default', ['deploy-sources', 'run-app']);
