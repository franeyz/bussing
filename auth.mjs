// https://github.com/passport/todos-express-password/blob/master/routes/auth.js
import express from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import './db.mjs';


passport.use(new LocalStrategy(function verify(username, password, cb) {
  // TODO add local strategy
}));

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login/password', passport.authenticate('local', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/login',
  failureMessage: true
}));

router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.post('/register', function(req, res, next) {
  // TODO figure this out
});

module.exports = router;