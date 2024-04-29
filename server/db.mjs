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
  MyRoutes:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' }]
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

// a schedule for each bus route
// * links to google sheets
const Schedule = new mongoose.Schema({
    route: {type: String, required: true},
    stops: {type: String, required: true}
}, {
  _id: true
});

mongoose.model('User', User);
mongoose.model('Schedule', Schedule);

export {User, Schedule};