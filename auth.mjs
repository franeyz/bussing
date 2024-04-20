import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { User } from './db.mjs'; // Import your user model

// Passport.js configuration for Local Strategy
passport.use(new LocalStrategy(
  async (username, password, done) => {
      try {
          // Find user by username
          const user = await User.findOne({ username });
          if (!user) {
              return done(null, false, { message: 'Incorrect username' });
          }

          // Compare the provided password with the stored password hash
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
              return done(null, false, { message: 'Incorrect password' });
          }

          // If credentials are correct, authenticate the user
          return done(null, user);
      } catch (err) {
          return done(err);
      }
  }
));

// Serialize and deserialize user sessions
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Export the configured passport instance
export default passport;