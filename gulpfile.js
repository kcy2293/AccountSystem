var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var nodemon = require('gulp-nodemon');

gulp.task('js', function() {
	gulp.src([
		'views/app.module.js', 
		'views/app.factory.js',
		'views/app.sidenav.js', 
		'views/app.config.js', 
		'views/app/**/*.module.js', 
		'views/app/**/*.component.js'
	])
	.pipe(concat('app.min.js'))
	.pipe(ngAnnotate())
	.pipe(uglify())
	.pipe(gulp.dest('views'))
});

gulp.task('start', function() {
	nodemon({
		script: 'server.js',
		ignore: ['app.min.js'],
		tasks: ['js']
	})
});

gulp.task('watch', ['js'], function() {
	gulp.watch('views/app.module.js', ['js']);
	gulp.watch('views/app.sidenav.js', ['js']);
	gulp.watch('views/app.config.js', ['js']);
	gulp.watch('views/app/**/*.js', ['js']);
});

gulp.task('default', ['js', 'start']);
//gulp.task('default', ['js']);
