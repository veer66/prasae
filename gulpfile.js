const gulp = require("gulp")
const babel = require("gulp-babel")
const mocha = require('gulp-mocha')

gulp.task("default", () =>
  gulp.src("src/*.js")
    .pipe(babel())
    .pipe(gulp.dest("dist")))

gulp.task("test", () => 
          gulp.src('test/test_*.js', {read: false})
          .pipe(mocha({
            reporter: 'nyan'            
          })))
