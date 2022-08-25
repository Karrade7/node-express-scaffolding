passport.authenticate('oauth2', { scope:'basic'})

Oauth Flow:
The user is first redirected to the service provider to authorize access.
After authorization has been granted, the user is redirected back to the application with a code that can be exchanged for an access token.
The application requesting access, known as a client, is identified by an ID and secret in order to get the token

Setting this up in Passport requires:

1. Require passport package and oauth addon
2. Configure Passort with an identifying name for the service provider (ex: cognito, or Auth0) a strategy of OAuth and the options needed to point to the Service PRovider, a call back to lookup the user in the local user database from the token
3. Add a route which calls passport.authenticat(cnfigured strategy). The oauth strategy will use the options from #1 to redirect the user to the Service Provider
4. Add a route that allows the service provider to tell the client to connect to and pass a code which can be exchanged for a token

5. Require passport package and oauth addon
   const passport = require("passport");
   const OAuth2Strategy = require("passport-oauth2").Strategy;

6. Configure OAuth to use a specific provider
   passport.use(new StrategyName({options}, Find User Callback - that determines the username and returns it))

Options - The provider's OAuth 2.0 endpoints, as well as the client identifer and secret, are specified as options.
Options should be:
_ - `authorizationURL` URL used to obtain an authorization grant
_ - `tokenURL` URL used to obtain an access token
_ - `clientID` identifies client to service provider
_ - `clientSecret` secret used to establish ownership of the client identifer
_ - `callbackURL` URL to which the service provider will redirect the user after obtaining authorization
_ - `passReqToCallback` when `true`, `req` is the first argument to the verify callback (default: `false`)

Callback - The strategy requires a verify callback, which receives an access token and profile, and calls cb providing a user.
signature is:
function(accessToken, refreshToken, profile, done) { ... }

The verify callback is responsible for finding or creating the user, and
invoking `done` with the following arguments:

     done(err, user, info);

     If user successfully found:
        set err to user, user to the username and an optional info argument typically used to display information message
        (what is the shape of user?)

passport.use(new OAuth2Strategy({
authorizationURL: 'https://www.example.com/oauth2/authorize',
tokenURL: 'https://www.example.com/oauth2/token',
clientID: EXAMPLE_CLIENT_ID,
clientSecret: EXAMPLE_CLIENT_SECRET,
callbackURL: "http://localhost:3000/auth/example/callback"
},
function(accessToken, refreshToken, profile, cb) {
User.findOrCreate({ exampleId: profile.id }, function (err, user) {
return cb(err, user);
});
}
));

3. Add a route which calls passport.authenticat(cnfigured strategy). The oauth strategy will use the options from #1 to redirect the user to the Service Provider

Use passport.authenticate(), specifying the 'oauth2' strategy, to authenticate requests.

app.get('/auth/example', passport.authenticate('oauth2'));

code:
function(req, options)

options.callbackURL
options.scope
options.scopeSeparator
options.state;
options.pkce
options.sessionKey
options.store - an object
options.proxy
options.passReqToCallback
options.skipUserProfile

app.get('/auth/iitbsso', passport.authenticate('oauth2', { scope:'basic'}));
app.get('/auth/iitbsso/callback', passport.authenticate('oauth2', {
successRedirect: '/',
failureRedirect: '/login'
}), (req, res) => {
res.redirect(req.session.returnTo || '/');
});

4. Add a route that allows the service provider to tell the client to connect to and pass a code which can be exchanged for a token
   takes the name of the strategy and options

name of the strategy: oauth2
options: - successRedirect - failureRedirect

app.get('/auth/example/callback',
passport.authenticate('oauth2', { successRedirect: '/', failureRedirect: '/login' })
