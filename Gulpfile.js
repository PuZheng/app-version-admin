var gulp = require('gulp')
    ,babel = require('gulp-babel')
    ,del = require('del')
    ,insert = require('gulp-insert')
    ,changed = require('gulp-changed')
    ,sourcemaps = require('gulp-sourcemaps')
    ,path = require('path')
    ,rollup = require('gulp-rollup')
    ,nodemon = require('gulp-nodemon')
    ,rename = require('gulp-rename')
    ,livereload = require('gulp-livereload');

gulp.task('serve-dev', function() {
    var options = {
        script: './index.js',
        execMap: {
            "js": "node"
        },
        delayTime: 1,
        watch: ['./']
    };

    return nodemon(options);
});

gulp.task('reload', function () {
    gulp.src(['./**/*.html'])
    .pipe(livereload());
});

gulp.task('watch', function () {
    livereload.listen();
    gulp.watch(['frontend/index.html', 'frontend/css/main.css'], ['reload']);
    gulp.watch(['frontend/js/*.js'], ['compile']);
});

gulp.task('compile', function () {
    console.log("COMPILE SCRIPTS");
    return gulp.src(['frontend/js/main.js'])
        .pipe(sourcemaps.init())
        .pipe(rollup({
            // any option supported by Rollup can be set here, including sourceMap 
            sourceMap: true
        }))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(sourcemaps.write('.', { 
            sourceRoot: path.join(__dirname, 'es6')
        }))
        .pipe(rename('bundle.js'))
        .pipe(gulp.dest('frontend/js')).pipe(livereload());
});

gulp.task('clean', () => {
  return del('frontend/js/bundle.js');
});

gulp.task('default', ['serve-dev', 'compile', 'watch']);
