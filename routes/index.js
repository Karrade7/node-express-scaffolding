// requirements for the entire app
'use strict';
const config = require('config');
const logger = require('winston'); // Logger being used
const path = require('path'); // module to read paths on the server
const errorHandler = require(path.join(ABSOLUTE_PATH, 'util/errorHandler.js')); // load error routines

// Requirements for this script
const express = require('express'); // Common Web application development for NodeJS
const passport = require('passport');
const router = express.Router();
const { check, validationResult } = require('express-validator'); // used to validate inputs to routes
const isAuthenticated = require(path.join(ABSOLUTE_PATH, 'util/authentication.js'));


// GET home page.
router.get('/', isAuthenticated, function (req, res, next) {
  logger.info("Home page route");
  res.render('index', { title: 'Home'});
});

// GET login page.
router.get('/login', function (req, res, next) {
  logger.info("Login Page - Get");
  res.render('login', { title: 'Home'});
});

// POST login page.
router.post('/login',
  [
    check('username').isLength({min: 1}).withMessage('Username is required').trim(),
    check('password').isLength({min: 1}).withMessage ('Password is required').trim(),
  ],
 passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login', })
)

router.use('/logout', function(req, res){
  req.logout();
  res.clearCookie('connect.sid');
  res.redirect('/');
});

router.get('/oauth2', passport.authenticate('oauth2'))

router.get('/oauth/cognito', passport.authenticate('oauth2', { scope: ['email', 'openid', 'aws.cognito.signin.user.admin', 'profile'], failureRedirect: '/failure' }), function (req, res) {
  // Successful authentication, redirect home.
  res.redirect('/')
})

module.exports = router;

