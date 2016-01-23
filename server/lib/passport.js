import passport from 'passport';
import { Strategy } from 'passport-local';
import users from '../db/users';

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  console.log('deserializeUser', id);
  users.findById(id)
    .then((user) => done(null, user))
    .catch((err) => done(err, false));
});

passport.use(new Strategy((username, password, done) => {
  users.findOne({ username })
    .then((user) => {
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }

      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password' });
      }

      done(null, user);
    });
}));
