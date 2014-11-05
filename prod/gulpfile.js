/*
Required Dependencies
*/
var gulp 		= require('gulp'),
	compass 	= require('gulp-compass'),
	csso 		= require('gulp-csso'),
	coffee 		= require('gulp-coffee'),
	jshint 		= require('gulp-jshint'),
	closure 	= require('gulp-closure-compiler'),
	prefixer 	= require('gulp-autoprefixer'),
	pngmin 		= require('gulp-pngmin'),
	imagemin 	= require('gulp-imagemin');

/*
Settings
*/
var dist 	= '../dist/',
	prod 	= 'dev/',
	browserSupport = ['last 2 versions'],
	compilerPath = 'bower_components/closure-compiler/lib/vendor/compiler.jar'
	jsPath 	= 'js';

gulp.task('default', ['coffee-build']);

// gulp.task('optimze', ['']);

gulp.task('js-build', function() {
	gulp.watch(prod+'js/**/*.js', ['js']);
	gulp.watch(prod+'sass/**/*.scss', ['sass']);
});

gulp.task('coffee-build', function() {
	gulp.watch(prod+'js/**/*.coffee', ['coffee']);
	gulp.watch(prod+'sass/**/*.scss', ['sass']);
});

gulp.task('js', function() {
	return gulp.src( prod + jsPath +'/**/*.js')
		.pipe( plumber() )
		.pipe( jshint() )
		.pipe( plumber.stop() )
		.pipe( gulp.dest( dist + jsPath ));
});

gulp.task('coffee', function() {
	return gulp.src( prod + 'js/**/*.coffee')
		.pipe( plumber() )
		.pipe( coffee() )
		.pipe( plumber.stop() )
		.pipe( gulp.dest( dist + jsPath ));
});

gulp.task('compress-js' function(){
	return gulp.src( prod + jsPath +'/**/*.js')
		.pipe( plumber() )
		.pipe(closure({
			compilerPath: compilerPath,
			fileName: 'scripts.min.js'
		}))
		.pipe( plumber.stop() )
		.pipe( gulp.dest( dist + jsPath ));
});

gulp.task('sass', function() {
	return gulp.src( prod + 'sass/**/*.scss')
		.pipe( plumber() )
		.pipe( compass({
			css: dist+'css',
			sass: prod+'sass',
			image: dist+'img'
		}))
		.pipe( csso() )
		.pipe( plumber.stop() )
		.pipe( gulp.dest( dist + 'css' ));
});

gulp.task('prefix-css', function () {
    return gulp.src( dist + 'css/*.css')
		.pipe( plumber() )
		.pipe( autoprefixer({
			browsers: browserSupport
		}))
		.pipe( plumber.stop() )
		.pipe( gulp.dest(dist + 'css') );
});

gulp.task('compress-css', function() {
	return gulp.src( dist + 'css')
		.pipe( plumber() )
		.pipe( csso() )
		.pipe( plumber.stop() )
		.pipe( gulp.dest( dist + 'css' ));
});

gulp.task('minify-images', function() {
	return gulp.src( dist + 'img')
		.pipe( plumber() )
		.pipe( imagemin() )
		.pipe( plumber.stop() )
		.pipe( gulp.dest( dist + 'img' ));
});