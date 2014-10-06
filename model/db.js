// Bring mongoose into the project
var mongoose = require('mongoose');

// Build the connection string
var dbURI = 'mongodb://localhost/MongoosePM';

// Create the database connection
mongoose.connect(dbURI);

// Events
mongoose.connection.on('connected', function() {
  console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', function(err) {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function() {
  console.log('Mongoose disconnected');
});

process.on('SIGINT', function() {
  mongoose.connection.close(function() {
    console.log('Mongoose disconnected through app termination');
    process.exit(0);
  });
});

//=============
//  User Schema
//=============
var userSchema = new mongoose.Schema({
  name: String,
  email: { 'type': String, 'unique': true },
  createdOn: { "type": Date, "default": Date.now },
  modifiedOn: Date,
  lastLogin: Date
});

// Build the user model
mongoose.model( 'User', userSchema );

//===============
// Course Schema
// ==============
var courseSchema = new mongoose.Schema({
  courseName: String,
  courseDesc: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref:'User' }],
  createdOn: Date,
  modifiedOn: { type: Date, default: Date.now }
});

courseSchema.statics.findByUserID = function(userid, callback) {
  this.find({ createdBy: userid },
            '_id courseName',
            { sort: 'modifiedOn' },
            callback);
}

// Build the project model
mongoose.model( 'Course', courseSchema );