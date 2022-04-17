// requirements for the entire app
'use strict';
const config = require('config');
const logger = require('winston'); // Logger being used
const path = require('path'); // module to read paths on the server
const errorHandler = require(path.join(ABSOLUTE_PATH, 'util/errorHandler.js')); // load error routines

// Requirements for this script
const passport = require('passport');

/*
Authentication Middleware - PassportJS

Passport is middleware that is typically added to a route to ensure only authenticated users can go to the route
ex: app.post('/route', passport.authenticate('local'));

At a high level summary, passport works as follows:
- require passport
- add passport.initialize as middleware to every call to express
- if using sessions (i.e. have the client store the authentication state) add session middleware and passport.session middleware to express
- when using sessions, add a way to store the user as json string and retrieve the user as object from the session (known as serialize and deserialize)
- require passport "strategy" for the type of authentication you are using (ex: local, api-key, oauth2)
- configure the strategy, based on the strategies specific needs - (ex: apikey needs a function to verify the api key, oauth needs to provider endpoint to forward to)
- add a login route that calls passport.authenticate and passes the strategy to authenticate with and any paramters
- add a verification function to all routes you want to protect that checks if the user is logged in

passport.authenticate(strategy, [parameter object]) is middleware which will authenticate the request. 
By default, when authentication succeeds:
    - the req.user property is set to the authenticated user
    - a session is established
    - the next function in the stack is called
    - req.isAuthenticated() will return true

Defaults can be override by passing additional properties to the authenitcaiton function:
ex: passport.authenticate('local', { failureRedirect: '/login', failureMessage: true, session: false}),

Prior to employing a strategy to authenticate a request, the strategy must be installed and configured.
All strategies have a name which, by convention, corresponds to the package name according to the pattern passport-{name}. 
Each login stategy (in the above example named local because the moduile is passport-local) is added as a node module and configured with a callback function (called verify by convention) on app start:
  const passportStrategy = require(strategyModuleName)
  passport.use(new passportStrategy(verifyCallback(credentials, done)))


The verify callback will be called with credentials and a callback called done
Any example of credentials could be username, password, API key etc

done is expecting (error, username, message in case of error). 
  - set error to null if there is no unknown problem
  - set username to false and set a message if the user is not found
  - set error to null and put in a string as username if the user is authenticated


a simple example:
  const passportStrategy = require(strategyModuleName)
  passport.use(new passportStrategy(verifyCallback(password, done){
    if (password==correct) {done(null,user)} else {done(error, false, "not authenticated")}
  }))
*/


// by default local expects user, passowrd to exist or it will send Bad Request
const passportLocalStrategy = require('passport-local');
passport.use(new passportLocalStrategy(
  function verify(username, password, done) {
    logger.info("Authenticating via Local Username and Password");
    try {
      // temporarily using test username/password of hello/world
      if (username == "hello" && password == "world") { var authenticatedUser = "test"; }

      // if the authenticatedUser exists, then send it to done. Otherwise say username or password faled
      if (authenticatedUser) {
        logger.info(`Successful login: ${username}`);
        return done(null, username);
      } else {
          logger.info(`Failed login: ${username}`)
        return done(null, false, { message: 'Incorrect username or password.' });
      }
    } catch (error) {
      // Something went wrong, return the error
      return done(error);
    }
  }
));

//var OAuth2Strategy = require('passport-oauth2').Strategy

/*
passport.use(new OAuth2Strategy({
  //authorizationURL: `https://${configCognito.COGNITO_DOMAIN}/login`,
  //tokenURL: `https://${configCognito.COGNITO_DOMAIN}/oauth2/token`,
  //clientID: configCognito.COGNITO_APP_CLIENT_ID,
  //clientSecret: configCognito.COGNITO_APP_CLIENT_SECRET,
  //callbackURL: configCognito.COGNITO_APP_CLIENT_CALLBACK_URL
},
function (accessToken, refreshToken, profile, done) {
  //let jwk = JSON.parse(config.COGNITO_JWK)
  //let jwk=configCognito.COGNITO_JWK;
  //let pem = jwkToPem(jwk)
  //let payload = jwt.verify(accessToken, pem)
  //let groups = payload['cognito:groups'] || []

  done(null, { groups: groups, accessToken: accessToken }) // Keep accessToken for passing to API calls
}))
*/

const HeaderAPIKeyStrategy = require('passport-headerapikey').HeaderAPIKeyStrategy
// new HeaderAPIKeyStrategy(headerOptions, passReqToCallback, verify);

passport.use(new HeaderAPIKeyStrategy(
    { },
    false,
  function (apikey, done) {
    logger.info("Authenticating via API Key");
    logger.info(`apikey: ${apikey}`);

  try {
    if (apikey == "abc123") { 
      var authenticatedUser = "test";
    }
    // if the authenticatedUser exists, then send it to done. Otherwise say username or password failed
    if (authenticatedUser) {
      logger.info(`User successfulled logged in via APIKey: ${authenticatedUser}`); 
      return done(null, authenticatedUser);
    } else {
      logger.info(`User failed login in via APIKey: ${apikey}`); 
      return done(null, false, { message: 'Incorrect username or password.' });
    }
  } catch (error) {
    // Something went wrong, return the error
    return done(error);
  }
}));


passport.serializeUser(function(user, done) {
  process.nextTick(function() {
    done(null, { username: user.username });
  });
});

passport.deserializeUser(function(user, done) {
  process.nextTick(function() {
    return done(null, user);
  });
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login') // if not auth
}

module.exports = isAuthenticated;