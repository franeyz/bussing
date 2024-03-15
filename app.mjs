import express from 'express'
import path from 'path'
import session from 'express-session';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'hbs');
app.use(express.urlencoded({extended: false}));
const sessionOptions = { 
	secret: 'secret for signing session id', 
	saveUninitialized: false, 
	resave: false 
};
app.use(session(sessionOptions));

import mongoose from 'mongoose';
const User = mongoose.model('User');
const Schedule = mongoose.model('Schedule');

app.get('/schedules', async (req, res) => {
    try {
        // TODO: retrieve schedule requested by user
        const Schedule = await Schedule.find();
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/myroutes/login', (req, res) => {
    
});

app.get('/myroutes', async (req, res) => {
    try {
        // TODO: retrieve user's saved schedules
        const Schedule = await Schedule.find();
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/trip', (req, res) => {
    // TODO: get user's trip info, find and display trip
})

app.listen(process.env.PORT || 3000);
