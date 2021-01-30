/**
 * sass自动转wxss自动化服务文件
 * npm install gulp -g 全局安装gulp
 * npm i gulp gulp-changed gulp-rename gulp-sass gulp-watch -S --production
 * create by Mr.Li
 */
var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename')
var changed = require('gulp-changed')
var watcher = require('gulp-watch')

//自动监听
gulp.task('default', gulp.series(function() {
  watcher('./pages/**/*.scss', function(){
    miniSassPage();
  });
  watcher('./components/**/*.scss', function(){
    miniSassComponents();
  });
}));

//手动编译
gulp.task('sass', function(){
  miniSassPage();
  miniSassComponents();
});


function miniSassPage(){
  return gulp.src('./pages/**/*.scss')//需要编译的文件
    .pipe(sass({
      outputStyle: 'expanded'//展开输出方式 expanded 
     }))
     .pipe(rename((path)=> {
      path.extname = '.wxss'
    }))
    .pipe(changed('./pages'))//只编译改动的文件
    .pipe(gulp.dest('./pages'))//编译
    .pipe(rename((path)=> {
      console.log('编译完成文件：' + 'pages\\' + path.dirname + '\\' + path.basename + '.scss')
    }))
}
function miniSassComponents(){
  return gulp.src('./components/**/*.scss')//需要编译的文件
    .pipe(sass({
      outputStyle: 'expanded'//展开输出方式 expanded 
     }))
     .pipe(rename((path)=> {
      path.extname = '.wxss'
    }))
    .pipe(changed('./components'))//只编译改动的文件
    .pipe(gulp.dest('./components'))//编译
    .pipe(rename((path)=> {
      console.log('编译完成文件：' + 'components\\' + path.dirname + '\\' + path.basename + '.scss')
    }))
}