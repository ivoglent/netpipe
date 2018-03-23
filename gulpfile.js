
const gulp = require('gulp');
const ts = require('gulp-typescript');
const JSON_FILES = ['src/*.json', 'src/**/*.json'];
const del = require('del');
var rename = require('gulp-rename');
var argv = require('yargs').argv;

var env = (argv.env === undefined) ? 'development' : argv.env;
var envfile = env + '.js';
// pull in the project TypeScript config
const tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts', ['clean'], function() {
    const tsResult = tsProject.src()
        .pipe(tsProject());
    return tsResult.js.pipe(gulp.dest('dist'));
});
gulp.task('clean', function(){
    return del('dist/**', {force:true});
});
gulp.task('watch', ['scripts'], function() {
    gulp.watch('src/**/*.ts', ['scripts']);
});

gulp.task('assets', function() {
    return gulp.src(JSON_FILES)
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['watch', 'assets']);

gulp.task('build', ['scripts'], function () {
    /*return gulp.src('./environments/' + envfile, {base: './dist/configs'}).pipe(rename('server.config.js'))
        .pipe(gulp.dest('./dist/configs'));*/
    return true;
});