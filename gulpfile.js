const gulp = require('gulp')
const hercule = require('hercule')
const through = require('through2')
const drakov = require('drakov')
const plumber = require('gulp-plumber')
const browserSync = require('browser-sync').create()
const path = require('path')
const aglio = require('gulp-aglio')

var filename = './src/api.md'
var targetfile = './build/api.md'

gulp.task('hercule', function (cb) {
  function gulpHercule () {
    return through.obj(function (file, encoding, callback) {
      if (file.isNull()) {
        throw new Error('File is empty.')
      }
      if (file.isStream()) {
        let srcPath = path.resolve(process.cwd(), './src/')
        var transcluder = new hercule.TranscludeStream(srcPath)
        file.contents = file.contents.pipe(transcluder)
        return callback(null, file)
      }
    })
  }
  gulp.src(filename, { buffer: false })
    .pipe(gulpHercule())
    .pipe(gulp.dest('./build/'))
    .on('end', cb)
})

gulp.task('docs', ['hercule'], function (cb) {
  gulp.src(targetfile)
  .pipe(plumber())
  .pipe(aglio({ template: 'default' }))
  .pipe(gulp.dest('./docs/'))
  .on('end', cb)
})

gulp.task('docserver', ['docs'], function () {
  browserSync.init({
    port: 3000,
    server: {
      baseDir: 'docs',
      index: 'api.html'
    },
    files: ['./docs'],
    ui: {
      port: 3001
    },
    open: false
  })
})

gulp.task('drakov', ['hercule'], function () {
  const argv = {
    sourceFiles: './build/api.md',
    serverPort: 7000,
    header: 'Authorization',
    autoOptions: true,
    method: 'PUT, DELETE, PATCH'
  }
  drakov.stop()
  drakov.run(argv)
})

const tasks = ['hercule', 'drakov', 'docs']

gulp.task('build', tasks)
gulp.task('watch', function () {
  gulp.watch(['./src/**/*.md'], ['hercule', 'docs', 'drakov'])
})
gulp.task('page', ['hercule', 'docs'])
gulp.task('mock', ['hercule', 'drakov'])
gulp.task('default', ['hercule', 'drakov', 'docs', 'docserver', 'watch'])
