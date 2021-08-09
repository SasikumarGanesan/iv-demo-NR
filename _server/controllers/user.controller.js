const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
const responseHelper = require('../helpers/response.helper');
const User = mongoose.model('User');

module.exports.register = (req, res, next) => {
  var user = new User();
  const { body: {name, email, password } } = req;
  user.name = name;
  user.email = email;
  user.password = password;
  user.save().then(user => {
    responseHelper.successResponse(res, null, 'User registered successfully.', user);
  }).catch(err => {
    if (err.code == 11000)
      responseHelper.errorResponse(res, null, 'Duplicate email adrress found.', null);
    else next(err);
  });
};

module.exports.authenticate = (req, res, next) => {
  // call for passport authentication
  passport.authenticate('local', (err, user, info) => {
    // error from passport middleware
    if (err) responseHelper.errorResponse(res, null, 'Authentication failed.', err);
    // registered user
    else if (user) responseHelper.successResponse(res, null, 'User authenticated successfully', {
      token: user.generateJwt()
    });
    // unknown user or wrong password
    else responseHelper.errorResponse(res, null, 'Authentication issue.', info);
  })(req, res);
};

module.exports.logout = (req, res, next) => {
  let token;
  if ('authorization' in req.headers){
    const { headers : { authorization }} = req;
    const [ , tokenD ]  = authorization.split(' ');
    token = tokenD;
  }

  if (!token) {
    responseHelper.errorResponse(res, 403, 'No token provided.', null);
  } else {
    req.logout();
    responseHelper.successResponse(res, null, 'User logged out successfully.', _.pick(user, ['token']));
  }
};


module.exports.userProfile = (req, res, next) => {
  User.findOne({
    _id: req._id
  }).exec().then(user => {
    responseHelper.successResponse(res, null, 'User details found.', _.pick(user, ['name', 'email']));
  }).catch(err => {
    responseHelper.errorResponse(res, false, 'User details not found.', null);
  });
};
