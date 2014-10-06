var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.index = function(req, res) {
  if(req.session.loggedIn === true) {
    res.render('user-page', {
      title: req.session.user.name,
      name: req.session.user.name,
      email: req.session.user.email,
      userID: req.session.user._id
    });
  } else {
    res.redirect('/login');
  }
};

exports.create = function(req, res) {
  res.render('user-form', {
    title: 'Create user',
    name: '',
    email: '',
    buttonText: 'Join!'
  });
};

exports.doCreate = function(req, res) {
  User.create({
    name: req.body.FullName,
    email: req.body.Email,
    modifiedOn: Date.now(),
    lastLogin: Date.now()
  }, function(err, user) {
    if(err) {
      console.log(err);
      if(err.code === 11000) {
        res.redirect('/user/new?exists=true');
      } else {
        res.redirect('/?error=true');
      }
    } else {
      console.log("User created and saved: " + user);
      req.session.user = { "name" : user.name, "email": user.email, "_id": user._id };
      req.session.loggedIn = true;
      res.redirect('/user');
    }
  });
};

exports.edit = function(req, res) {
  if(req.session.loggedIn !== true) {
    res.redirect('/login');
  } else {
    res.render('user-form', {
      title: 'Edit profile',
      _id: req.session.user._id,
      name: req.session.user.name,
      email: req.session.user.email,
      buttonText: "Save"
    })
  }
};

exports.doEdit = function(req, res) {
  if(req.session.user._id) {
    User.findById(req.session.user._id, function(err, user) {
      if(err) {
        console.log(err);
        res.redirect('/user?error=finding');
      } else {
        user.name = req.body.FullName;
        user.email = req.body.Email;
        user.modifiedOn = Date.now();
        user.save(function(err) {
          if(!err) {
            console.log('User updated: ' + req.body.FullName);
            req.session.user.name = req.body.FullName;
            req.session.user.email = req.body.Email;
            res.redirect('/user');
          }
        });
      }
    });
  }
};

exports.confirmDelete = function(req, res) {
  res.render('user-delete-form', {
    title: 'Delete account',
    _id: req.session.user._id,
    name: req.session.user.name,
    email: req.session.user.email
  });
};

exports.doDelete = function(req, res) {
  if(req.body._id) {
    User.findByIdAndRemove(req.body._id, function(err, user) {
      if(err) {
        console.log(err);
        return res.redirect('/user?error=deleting');
      }
      console.log("User deleted:", user);
      clearSession(req.session, function() {
        res.redirect('/');
      });
    });
  }
};

var clearSession = function(session, callback) {
  session.destroy();
  callback();
};

exports.login = function(req, res) {
  res.render('login-form', { title: 'Log in' });
};

exports.doLogin = function(req, res) {
  if(req.body.Email) {
    User.findOne(
    { 'email': req.body.Email },
    '_id name email',
    function(err, user) {
      if(!err) {
        if(!user) {
          res.redirect('/login?404=user');
        } else {
          req.session.user = {
            "name" : user.name,
            "email": user.email,
            "_id": user._id
          };
          req.session.loggedIn = true;
          console.log('Logged in user: ' + user);
          // Update the lastLogin property
          User.update(
            {_id:user._id},
            {$set: {lastLogin: Date.now()} },
            function() {
              res.redirect('/user');
            }
          );
        }
      } else {
        res.redirect('/login?404-error');
      }
    });
  } else {
    res.redirect('/login?404=error');
  }
};