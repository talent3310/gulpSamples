var gulp = require('gulp'); // this look into the node_modules folder for a package named gulp.
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create(); //npm install browser-sync --save-dev
gulp.task('hello', function() {
    console.log('hello deniz');
});

gulp.task('convertToCss', function() {
    return gulp.src('app/scss/styles.scss')
        .pipe(sass())
        .pipe(gulp.dest('app/css'))
});

// gulp.task('watch', function(){
// 	gulp.watch('app/scss/**/*.scss',['hello','convertToCss']);//'convertToCss',
// });

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
    })
});

gulp.task('sass', function() {
    return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss
        .pipe(sass())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('watch', ['browserSync', 'sass'], function() {
    gulp.watch('app/scss/**/*.scss', ['sass', browserSync.reload]);
    // Reloads the browser whenever HTML or JS files change
    // gulp.watch('app/*.html', browserSync.reload);
    // gulp.watch('app/js/**/*.js', browserSync.reload);
    // Other watchers
});

//optimizing css and javascript files
//cmd:=>npm install gulp-useref --save-dev
////cmd:=>npm install gulp-if --save-dev

var useref = require('gulp-useref');

		// gulp.task('useref', function() {
		//     return gulp.src('app/*.html')
		//         .pipe(useref())
		//         .pipe(gulp.dest('dist'))
		// });
//uglify
//cmd:=>npm install gulp-uglify --save-dev 

		var uglify = require('gulp-uglify');
		var gulpIf = require('gulp-if');

		// gulp.task('useref', function() {
		//     return gulp.src('app/*.html')
		//         .pipe(useref())
		//         // Minifies only if it's a JavaScript file
		//         .pipe(gulpIf('*.js', uglify()))
		//         .pipe(gulp.dest('dist'))
		// });
//css
//cmd:=>npm install gulp-cssnano
var cssnano = require('gulp-cssnano');

gulp.task('useref', function() {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        // Minifies only if it's a CSS file
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'))
});

//optimizing images
//cmd:=>npm install gulp-imagemin --save-dev

var imagemin = require('gulp-imagemin');
// gulp.task('images', function(){
//   return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
//   .pipe(imagemin())
//   .pipe(gulp.dest('dist/images'))
// });

gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
  .pipe(imagemin({
      // Setting interlaced to true
      interlaced: true
    }))
  .pipe(gulp.dest('dist/images'))
});

//Optimizing images however, is an extremely slow process that you'd not want to repeat unless necessary. To do so, we can use the gulp-cache plugin.
//npm install gulp-cache --save-dev

var cache = require('gulp-cache');

gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/images'))
});

//copy fonts to dist

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

//Since we're generating files automatically, we'll want to make sure that files that are no longer used don't remain anywhere without us knowing.
//cmd:=>npm install del --save-dev
var del = require('del');
gulp.task('clean:dist', function() {
  return del.sync('dist');
})
//Note: We don't have to worry about deleting the dist/images folder because gulp-cache has already stored the caches of the images on your local system.

//Combining Gulp tasks
//cmd:=>npm install run-sequence --save-dev

var runSequence = require('run-sequence');

gulp.task('task-name', function(callback) {
  runSequence('task-one', 'task-two', 'task-three', callback);
});

// gulp.task('task-name', function(callback) {
//   runSequence('task-one', ['tasks','two','run','in','parallel'], 'task-three', callback);
// }); 
// In this case, Gulp first runs task-one. When task-one is completed, Gulp runs every task in the second argument simultaneously. All tasks in this second argument must be completed before task-three is run.