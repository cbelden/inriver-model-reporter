var gulp = require('gulp');
var fetchAtomShell = require('gulp-download-atom-shell');
var fs = require('fs-extra');
var R = require('ramda');
var spawn = require('child_process').spawn;

/* ==== Config ==== */
var WATCH_PATTERN = "**/*.*";
var SOURCE_CODE_DIR = "src/";
var ATOM_SHELL_DIR = "binaries/";
var ATOM_SHELL_APP_DIR = ATOM_SHELL_DIR + "resources/default_app";
var ATOM_SHELL_EXECUTABLE = ATOM_SHELL_DIR + "atom";

/* ==== Tasks ==== */
gulp.task('fetch-atom-shell',
  R.lPartial(fetchAtomShell, {
    version: '0.17.2',
    outputDir: ATOM_SHELL_DIR
  })
);

gulp.task('clean-partial',
  R.lPartial(fs.removeSync,
    ATOM_SHELL_APP_DIR
  )
);

gulp.task('clean-full',
  R.lPartial(fs.remove,
    ATOM_SHELL_DIR
  )
);

gulp.task('deploy-sources', ['clean-partial'],
  R.lPartial(fs.copy,
    SOURCE_CODE_DIR,
    ATOM_SHELL_APP_DIR
  )
);

gulp.task('run-app',
  R.nAry(0,
    R.lPartial(
      spawn,
      ATOM_SHELL_EXECUTABLE
    )
  )
);

gulp.task('clean', ['clean-full']);
gulp.task('build', ['clean-full', 'fetch-atom-shell', 'deploy-sources']);
gulp.task('default', ['deploy-sources', 'run-app']);
