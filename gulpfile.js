var gulp = require('gulp')
var livereload = require('gulp-livereload')

gulp.task('reload', function(){
  livereload.reload();
})

gulp.task('watch', function(){
  livereload.listen();
  gulp.watch('./js/*.*', ['reload'])
})

gulp.task('default', ['watch'])
