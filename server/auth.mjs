import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import jwt from 'jsonwebtoken';
import './db.mjs';
import mongoose from 'mongoose';

const User = mongoose.model('User');

const secret = 'bussing_key';

const hashPassword = async (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (e, salt) => {
      if(e) {
        reject(e);
      }
      bcrypt.hash(password, salt, (e, hash) => {
        if(e) {
          reject(e);
        }
        resolve(hash);
      })
    })
  })
}

const comparePassword = async (password, hashed) => {
  return bcrypt.compare(password, hashed);
}

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
}, async (username, password, done) => {
  try {
    // find user by username
    const user = await User.findOne({username});
    // check if username exists
    if (!user) {
      return done(null, false, { error: 'Username does not exist' });
    }
    // use comparePassword to validate the password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return done(null, false, { error: 'Incorrect password' });
    }
    // if password matches username, return user
    return done(null, user);
  } catch (error) {
    return done(error, false, {error: 'error occured'});
  }
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

const getTokenFromHeaders = (req) => {
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader) {
        const token = authorizationHeader.split(' ')[1];
        return token;
    }
    return null;
};

const auth = {
    required: (req, res, next) => {
        const token = getTokenFromHeaders(req);
        if (!token) {
            //console.log('no token');
            return res.status(401).json({ error: 'Please login first' });
        }

        jwt.verify(token, secret, (err, payload) => {
            if (err) {
                //console.log('invalid token');
                return res.status(401).json({ error: 'Problem authenticating' });
            }
            req.payload = payload;
            next();
        });
    },
    optional: (req, res, next) => {
        const token = getTokenFromHeaders(req);
        if (token) {
            jwt.verify(token, secret, (err, payload) => {
                if (!err) {
                    req.payload = payload;
                }
            });
        }
        next();
    },
};


export {hashPassword, auth};