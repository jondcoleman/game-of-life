var gulp = require('gulp')
var livereload = require('gulp-livereload')

gulp.task('reload', function(){
  livereload.reload();
})

gulp.task('watch', function(){
  livereload.listen();
  gulp.watch('./**/*.*', ['reload'])
})

gulp.task('default', ['watch'])
