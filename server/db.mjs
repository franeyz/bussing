import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

mongoose.connect(process.env.DSN)
.then(() => console.log('database connected'))
.catch((e) => console.log('database problem', e))

const secret = 'bussing_key';

// users
// * our site requires authentication...
// * so users have a username and password
// * they also can have 0 or more saved routes
const User = new mongoose.Schema({
  username: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  favRoutes:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Routes' }]
});

// passport authentication
User.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60); // expires in 60 days

  return jwt.sign({
    username: this.username,
    id: this._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, secret);
}

User.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    username: this.username,
    token: this.generateJWT(),
  };
};

// a schedule for each bus route
// * includes addresses where the bus stops, indexes align with times
// * days are when this route should be displayed
const Schedule = new mongoose.Schema({
    route: {type: String, required: true},
    stops: {type: String, required: true},
    times: {
      type: Array,
      default: function() {
          return [[]];
      }
    }
}, {
  _id: true
});

mongoose.model('User', User);
mongoose.model('Schedule', Schedule);

export {User, Schedule};