'use strict';

var gulp  = require('gulp')
var babel = require('gulp-babel')

gulp.task('default', function () {
    return gulp.src('./src/**')
        .pipe(babel({stage: 0}))
        .pipe(gulp.dest('./lib'))
});
