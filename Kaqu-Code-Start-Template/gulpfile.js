var
	gulp = require('gulp'),
	gutil = require('gulp-util' ),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	cleanCSS = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	del = require('del'),
	imagemin = require('gulp-imagemin'),
	cache = require('gulp-cache'),
	autoprefixer = require('gulp-autoprefixer'),
	ftp = require('vinyl-ftp'),
	notify = require("gulp-notify"),
	rsync = require('gulp-rsync'),
	pug = require('gulp-pug');

// EDIT THIS VAR
var app_name = 'app-default';

// Pug Task
gulp.task('pug', function() {
	return gulp.src('app/' + app_name + '/pages/*.pug')
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest('app/' + app_name + '/html'))
		.pipe(browserSync.reload({stream: true}));
});

// JS
gulp.task('common-js', function() {
	return gulp.src([
		'app/' + app_name + '/vendor/common.js',
		])
	.pipe(concat('common.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/' + app_name + '/vendor'));
});

gulp.task('js', ['common-js'], function() {
	return gulp.src([
		'app/' + app_name + '/vendor/libs/jquery/jquery.min.js',
		'app/' + app_name + '/vendor/common.min.js',
		])
	.pipe(concat('scripts.min.js'))
	// .pipe(uglify())
	.pipe(gulp.dest('app/' + app_name + '/vendor'))
	.pipe(browserSync.reload({stream: true}));
});

// Browser-sync
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app/' + app_name
		},
		notify: false,
	});
});

// scss
gulp.task('scss', function() {
	return gulp.src('app/' + app_name + '/scss/**/*.scss')
	.pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleanCSS())
	.pipe(gulp.dest('app/' + app_name + '/css'))
	.pipe(browserSync.reload({stream: true}));
});

// Watch Task
gulp.task('watch', ['scss', 'js', 'browser-sync'], function() {
	gulp.watch('app/' + app_name + '/pages/**/*.pug', ['pug', browserSync.reload]);
	gulp.watch(['app/' + app_name + '/vendor/**/*.js', 'app/' + app_name + '/vendor/common.js'], ['js', browserSync.reload]);
	gulp.watch('app/' + app_name + '/scss/**/*.scss', ['scss', browserSync.reload]);
});

gulp.task('default', ['watch']);
