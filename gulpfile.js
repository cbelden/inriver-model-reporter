var gulp = require('gulp');
var fetchAtomShell = require('gulp-download-atom-shell');
var fs = require('fs-extra');
var R = require('ramda');
var shell = require('shelljs');
var childProcess = require('child_process');
var open = require('open');
var utils = require('./gulpUtils');


/* ==== Config ==== */
//Bower Config
var BOWER_LIBS = {
  'jquery': "bower_components/jquery/dist/",
  'semantic-ui': "bower_components/semantic-ui/build/packaged/",
  'angular': "bower_components/angular/"
};

//Source Config
var SOURCE_CODE_DIR = "src/";
var SOURCE_CODE_LIB_DIR = SOURCE_CODE_DIR + "lib/";

//Atom Config
var ATOM_SHELL_DIR = utils.pickByPlatform({
  'default': "binaries/",
  'darwin': "binaries/Atom.app/Contents/"
});
var ATOM_SHELL_APP_DIR = utils.pickByPlatform({
  'default': "binaries/resources/default_app/",
  'darwin': "binaries/Atom.app/Contents/Resources/default_app/"
});
var ATOM_SHELL_COMMAND = utils.pickByPlatform({
  'default': "binaries/atom",
  'darwin': "open -W binaries/Atom.app --args"
});
var ATOM_SHELL_DEBUG_PORT = 5858;


/* ==== Tasks ==== */
gulp.task('fetch-atom-shell',
  R.lPartial(fetchAtomShell, {
    version: '0.17.2',
    outputDir: ATOM_SHELL_DIR
  })
);

gulp.task('clean-partial',
  utils.runAll(
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
        utils.copyPair
      )
    )
  )
);

gulp.task('deploy-sources', ['clean-partial', 'copy-bower-files'],
  R.lPartial(fs.copy, SOURCE_CODE_DIR, ATOM_SHELL_APP_DIR)
);

gulp.task('run-app', ['deploy-sources'],
  utils.runAll(
    R.lPartial(shell.exec, ATOM_SHELL_COMMAND)
  )
);

gulp.task('debug-app', ['deploy-sources'], function () {
  var inspector = childProcess.exec("node-inspector");
  open("http://127.0.0.1:8080/debug?port=" + ATOM_SHELL_DEBUG_PORT);
  var atom = shell.exec(ATOM_SHELL_COMMAND + " --debug=" + ATOM_SHELL_DEBUG_PORT);
  inspector.kill();
});

gulp.task('clean', ['clean-full']);
gulp.task('build', ['clean-full', 'fetch-atom-shell', 'deploy-sources']);
gulp.task('debug', ['debug-app']);
gulp.task('default', ['run-app']);
