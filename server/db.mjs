import mongoose from 'mongoose';
mongoose.connect(process.env.DSN)
.then(() => console.log('database connected'))
.catch((e) => console.log('database problem', e))

// users
// * our site requires authentication...
// * so users have a username and password
// * they also can have 0 or more saved routes
const User = new mongoose.Schema({
  username: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  favRoutes:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Routes' }]
});


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