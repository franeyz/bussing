// 1ST DRAFT DATA MODEL
import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
mongoose.connect(process.env.DSN);

// users
// * our site requires authentication...
// * so users have a username and password
// * they also can have 0 or more saved routes
const User = new mongoose.Schema({
  // username provided by authentication plugin
  // password hash provided by authentication plugin
  routes:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Routes' }]
});

User.plugin(passportLocalMongoose);

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
    },
    days: [{type: String}] // TODO: Friday and weekends have different schedule
}, {
  _id: true
});

mongoose.model('User', User);
mongoose.model('Schedule', Schedule);

export default User;