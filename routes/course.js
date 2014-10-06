var mongoose = require('mongoose');
var Course = mongoose.model('Course');
var User = mongoose.model('User');

exports.index = function(req, res) {
};

exports.create = function(req, res) {
  res.render('course-form', {
    title: 'Create course',
    buttonText: 'Create Course!',
    courseName: '',
    courseDesc: ''
  });
};

exports.doCreate = function(req, res) {
  Course.create({
    courseName: req.body.CourseName,
    courseDesc: req.body.CourseDesc,
    createdBy: req.session.user._id,
    modifiedOn: Date.now(),
    lastLogin: Date.now()
  }, function(err, course) {
    if(err) {
      console.log(err);
      if(err.code === 11000) {
        res.redirect('/course/new?exists=true');
      } else {
        res.redirect('/?error=true');
      }
    } else {
      console.log("Course created and saved: " + course);
      res.render('course-page', {
        courseName: course.courseName,
        courseDescription: course.courseDesc,
        createdBy: req.session.user,
        courseId: course._id
      });
    }
  });
};

exports.edit = function(req, res) {
  if(req.session.loggedIn !== true) {
    res.redirect('/login');
  } else {
    if( req.params.id ) {
      Course.findById(req.params.id)
        .exec(function (err, course) {
          if( err ) {
            console.log(err);
            res.redirect('/course?error=finding');
          }
          else {
            console.log(course);
            res.render('course-form', {
              title: "Edit Course",
              buttonText: 'Edit',
              userid: req.session.user._id,
              courseId: course._id,
              courseName: course.courseName,
              courseDesc: course.courseDesc
            });
          }
        });
    }
    else {
      res.redirect('/user');
    }
  }
};

exports.doEdit = function(req, res) {
  if(req.session.loggedIn !== true) {
    res.redirect('/login');
  } else {
    if (req.body.courseId) {
      Course.findById(req.body.courseId, function (err, course) {
        if(!err) {
          course.courseName = req.body.CourseName;
          course.courseDesc = req.body.CourseDesc;
          course.modifiedOn = Date.now();
          course.save(function (err, course) {
            if(err){
              console.log(err);
            } else {
              console.log('Course updated: ' + req.body.courseName);
              res.redirect( '/course/' + req.body.courseId );
            }
          });
        }
      });
    }
  }
};

exports.displayInfo = function(req, res) {
  console.log("Finding course _id: " + req.params.id);
  if(req.session.loggedIn !== true) {
    res.redirect('/login');
  } else {
    if(req.params.id) {
      Course.findById(req.params.id)
        .populate('createdBy', 'name email')
        .exec(function(err, course) {
          if(err) {
            console.log(err);
            res.redirect('/user?404=course');
          } else {
            console.log(course);
            res.render('course-page', {
              courseName: course.courseName,
              courseDescription: course.courseDesc,
              createdBy: course.createdBy,
              courseId: req.params.id
            });
          }
        });
    } else {
      res.redirect('/user');
    }
  }
};

exports.listAll = function(req, res) {
  Course.find(null, function(err, courses) {
    console.log("Getting all courses");
    res.render('course-list-page', {
      courses: courses
    });
  });
};

exports.createdByUser = function(req, res) {
  console.log("Getting user courses created");
  if(req.params.userid) {
    Course.findByUserID(req.params.userid, function(err, courses) {
      if(!err) {
        console.log(courses);
        res.json(courses);
      } else {
        console.log(err);
        res.json({"status":"error", "error":"Error finding courses"});
      }
    });
  } else {
    console.log("No user id supplied");
    res.json({"status":"error", "error":"No user id supplied"})
  }
};

exports.enrolledInByUser = function(req, res) {
  console.log("Getting user courses enrolled in");
  if(req.params.userid) {
    Course.findByUserID(req.params.userid, function(err, courses) {
      if(!err) {
        console.log(courses);
        res.json(courses);
      } else {
        console.log(err);
        res.json({"status":"error", "error":"Error finding courses"});
      }
    });
  } else {
    console.log("No user id supplied");
    res.json({"status":"error", "error":"No user id supplied"})
  }
};
