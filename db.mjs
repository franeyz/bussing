// 1ST DRAFT DATA MODEL
const mongoose = require('mongoose');

// users
// * our site requires authentication...
// * so users have a username and password
// * they also can have 0 or more saved routes
const User = new mongoose.Schema({
  // username provided by authentication plugin
  // password hash provided by authentication plugin
  routes:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Routes' }]
});

// a schedule for each bus route
// * includes addresses where the bus stops, indexes align with times
// * days are when this route should be displayed
const Schedule = new mongoose.Schema({
    route: 'A',
    stops: ['715 Broadway', 'Broadway & Broome St', '80 Lafayette'],
    times: [['-','7:30','7:40'],['-','8:00','8:10'],['9:00','9:10','9:20']], // - means the bus does not stop there on this trip
    days: [Monday, Tuesday, Wednesday, Thursday] // Friday and weekends have different schedule
}, {
  _id: true
});

mongoose.model('User', User);
mongoose.model('Schedule', Schedule);


