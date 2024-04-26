import '../db.mjs';
import mongoose from 'mongoose';
const User = mongoose.model('User');
const Schedule = mongoose.model('Schedule');
import {hashPassword, comparePassword} from '../auth.mjs';

const test = (req,res) => {
    res.json('test is working');
}

const registerUser = async (req,res) => {
    try {
        // validate username and password
        const {username, password} = req.body;
        if (!username || username.length < 8) {
            return res.json({
                error: 'Username at least 8 characters required'
            })
        }
        if (!password || password.length < 8) {
            return res.json({
                error: 'Password at least 8 characters required'
            })
        }
        // check if username is unique
        const exist = await User.findOne({username});
        if(exist) {
            return res.json({
                error: 'Username is taken already'
            })
        }
        // hash password and create new user
        const hashedPassword = await hashPassword(password);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        console.log('USER SAVED');
    } catch (error) {
        console.log('problem with register', error);
    }
}

const loginUser = async (req, res) => {
    try {
        const {username, password} = req.body;
        // check if user exists
        const user = await User.findOne({username});
        if (!user) {
            return res.json({
                error: 'Username does not exist'
            })
        }
        // check if password matches
        console.log('passward check:', password, user.password);
        const match = await comparePassword(password, user.password);
        if(match) {
            // use cookie to track this user
            res.json('passwords match!')
        }
    } catch (error) {
        console.log(error);
    }
}

const getSchedules = async (req, res) => {
    try {
        const selectedRoute = req.query.route;
        const schedule = await Schedule.findOne({route:selectedRoute});
        if (!schedule) {
            return res.status(404).json({error: 'Schedule not found for the selected route.'});
        }
        const stopsLink = schedule.stops;
        res.json({selectedRoute, stopsLink});
    } catch (error) {
        console.error('Error retrieving stops link:', error);
        res.status(500).send('Internal Server Error');
    }
};

export {test,registerUser,loginUser, getSchedules};