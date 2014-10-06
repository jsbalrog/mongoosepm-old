/**
 * Module dependencies.
 */
var express = require('express');
var db = require('./model/db')
var routes = require('./routes');
var user = require('./routes/user');
var course = require('./routes/course');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// User routes
app.get('/', routes.index);
app.get('/user', user.index); // current user profile
app.get('/user/new', user.create); // get new user form
app.post('/user/new', user.doCreate); // create new user action
app.get('/user/edit', user.edit); // get edit user form
app.post('/user/edit', user.doEdit); // edit user action
app.get('/user/delete', user.confirmDelete); // get delete user form
app.post('/user/delete', user.doDelete); // delete user action

// Login/logout routes
app.get('/login', user.login); // get login form
app.post('/login', user.doLogin); // login action
// app.get('/logout', user.doLogout); // logout action

// Course routes
app.get('/course/new', course.create); // get create new course form
app.post('/course/new', course.doCreate); // create new course action
app.get('/course/:id', course.displayInfo); // display course info
app.get('/courses', course.listAll); // list all courses
app.get('/course/edit/:id', course.edit); // get edit course form
app.post('/course/edit/:id', course.doEdit); // edit course action
// app.get('/course/delete/:id', course.confirmDelete); // get delete course form
// app.post('/course/delete/:id', course.doDelete); // delete course action

// APIs (return JSON)
app.get('/course/createdbyuser/:userid', course.createdByUser); // get courses created by user
app.get('/course/enrolledinbyuser/:userid', course.enrolledInByUser); // get courses created by user
//app.get('/user/bycourse/:courseid', user.byCourse); // get users enrolled in course

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
