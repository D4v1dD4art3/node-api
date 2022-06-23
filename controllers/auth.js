const { validationResult } = require('express-validator');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validator failed');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  bcryptjs
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email,
        password: hashedPassword,
        name,
      });
      return user.save();
    })
    .then(result => {
      res.status(201).json({ message: 'User Created!', userId: result._id });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ email })
    .then(user => {
      if (!user) {
        const error = new Error('This email could not be found');
        error.statusCode = 404;
        throw error;
      }
      loadedUser = user;
      return bcryptjs.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error('Wrong password!');
        error.statusCode = 401;
        throw error;
      }
      // generate a json web token
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        'somesupersecretsecret',
        {
          expiresIn: '1h',
        },
      );
      res.status(200).json({
        token,
        userId: loadedUser._id.toString(),
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getStatus = (req, res, next) => {
  User.findById(req.userId)
    .then(user => {
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ status: user.status });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateUserStatus = (req, res, next) => {
  const newStatus = req.body.status;
  User.findById(req.userId)
    .then(user => {
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }
      user.status = newStatus;
      return user.save();
    })
    .then(result => {
      res.status(201).json({ message: 'Status updated!' });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
