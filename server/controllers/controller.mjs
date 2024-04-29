import '../db.mjs';
import mongoose from 'mongoose';
import {hashPassword} from '../auth.mjs';
import passport from 'passport';

const User = mongoose.model('User');
const Schedule = mongoose.model('Schedule');

const registerUser = async (req,res) => {
    try {
        // validate username and password
        const {username, password} = req.body;
        // check if username is unique
        const exist = await User.findOne({username});
        if(exist) {
            return res.status(409).json({error: 'Username already exists'});
        }
        // hash password and create new user
        const hashedPassword = await hashPassword(password);
        const user = new User({ username, password: hashedPassword, MyRoutes:[]});
        await user.save();
        res.status(200).json({error: ''});
        console.log('USER SAVED');
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
}

const loginUser = (req, res, next) => {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err) {
            return res.status(500).json({ error: info.error });
        }
        
        if (!user) {
            return res.status(401).json({ error: info.error });
        }

        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            // generate a JWT token for the user
            const token = user.generateJWT();
            return res.status(200).json({ username: user.username, token, error:''});
        });
    })(req, res, next);
};

const getSchedules = async (req, res) => {
    try {
        const selectedRoute = req.query.route;
        let schedule = await Schedule.findOne({route:selectedRoute});
        // if first time running, need to fetch schedules
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

const getMyRoutes = async (req, res) => {
    // Get the user payload from the request
    const user = req.payload;

    // Check if the user is authenticated
    if (!user) {
        return res.status(401).json({ error: 'Please log in first.' });
    }

    try {
        // Fetch the user's data from the database
        const currentUser = await User.findById(user.id).populate('MyRoutes');

        // Check if the user was found
        if (!currentUser) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Return the user as a response
        res.status(200).json({currentUser, error:''});
    } catch (error) {
        console.error('Error fetching user routes:', error);
        res.status(500).json({ error: 'An unexpected error occurred while fetching saved routes.' });
    }
};

const selectMyRoutes = async (req, res) => {
    // Get the user payload from the request
    const user = req.payload;

    // Check if the user is authenticated
    if (!user) {
        return res.status(401).json({ error: 'Please log in first.' });
    }

    try {
        // Fetch the user's data from the database
        const currentUser = await User.findById(user.id).populate('MyRoutes');

        // Check if the user was found
        if (!currentUser) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const allSchedules = await Schedule.find({});
        if (!allSchedules) {
            return res.status(404).json({ error: 'Problem getting schedules' });
        }

        // Return the user routes and schedules as a response
        res.status(200).json({ currentUser, allSchedules });
    } catch (error) {
        console.error('Error updating user routes:', error);
        res.status(500).json({ error: 'An unexpected error occurred while updating saved routes.' });
    }
};

const updateRoutes = async (req, res) => {
    // Get the user payload from the request
    const user = req.payload;
    const selectedRoutes = req.body.selectedRoutes;

    // Check if the user is authenticated
    if (!user) {
        return res.status(401).json({ error: 'Please log in first.' });
    }
    if (!selectedRoutes) {
        return res.status(404).json({ error: 'Problem getting selected schedules' });
    }

    try {
        // Fetch the user's data from the database
        let updatedUser = await User.findById(user.id).populate('MyRoutes');
        updatedUser.updateRoutes(selectedRoutes);
        // Return the user with updated schedules
        res.status(200).json({ updatedUser });
    } catch (error) {
        console.error('Error updating user routes:', error);
        res.status(500).json({ error: 'An unexpected error occurred while updating saved routes.' });
    }
};

export {registerUser,loginUser, getSchedules, getMyRoutes, selectMyRoutes, updateRoutes};