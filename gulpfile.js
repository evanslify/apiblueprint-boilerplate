const gulp = require('gulp'),
      hercule = require('hercule'),
      through = require('through2'),
      drakov = require('drakov'),
      aglio = require('gulp-aglio'),
      plumber = require('gulp-plumber'),
      browserSync = require('browser-sync').create()

var filename = './src/api.md'
var targetfile = './build/api.md'

gulp.task('hercule', function(cb) {
  function gulpHercule() {
    return through.obj(function(file, encoding, callback) {
      if (file.isNull()) {
        throw new Error ('File is empty.')
      }

      if (file.isStream()) {
        var transcluder = new hercule.TranscludeStream();
        file.contents = file.contents.pipe(transcluder);
        return callback(null, file);
      }
    });
  }
  gulp.src(filename, { buffer: false })
    .pipe(gulpHercule())
    .pipe(gulp.dest('./build/'))
    .on('end', cb)
});

gulp.task('docs', ['hercule'], function (cb) {
  gulp.src(targetfile)
  .pipe(plumber())
  .pipe(aglio({
    themeTemplate: '/Users/es/Tools/aglio-template/index.jade'
  }))
  .pipe(gulp.dest('./docs/'))
  .on('end', cb)
})

gulp.task('docserver', ['docs'], function () {
  browserSync.init({
    server: {
      baseDir: 'docs',
      index: 'api.html'
    },
    files: ['./docs'],
    ui: {
      port: 3000
    },
    open: false
  })
})

gulp.task('drakov', ['hercule'], function () {
  const argv = {
    sourceFiles: './build/api.md',
    serverPort: 8000,
    header: 'Authorization',
    autoOptions: true,
    method: 'PUT'
  }
  drakov.stop()
  drakov.run(argv)
})

const tasks = ['hercule', 'drakov', 'docs']

gulp.task('build', tasks)
gulp.task('watch', function() {
  gulp.watch(['./src/*.md'], ['build']);
})
gulp.task('default', ['hercule', 'drakov', 'docs', 'docserver', 'watch'])
