import './config.mjs';
import './db.mjs';
import express from 'express'
import path from 'path'
import session from 'express-session';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import passport from './auth.mjs';

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
app.use(passport.initialize());
app.use(passport.session());

import mongoose from 'mongoose';
const User = mongoose.model('User');
const Schedule = mongoose.model('Schedule');

const domain = 'https://www.nyu.edu';

async function getSchedules(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);
        // TODO - change schedule based on current day of the week
        //console.log($.html());
        const route = $('#main-title').text().trim();
        const sheetsLink = $('a:contains("' + route + ' Schedule")')//.filter((index, element) => {
            //return $(element).text().includes('Monday through Thursday');
            
        //});
        const href = $(sheetsLink[0]).attr('href');
        //console.log("FOUND HREF=", href);
        // TODO - convert google drive sheets link to data that i can use, for now, just add the link
        const schedule = new Schedule({
            route: route,
            stops: href
        });
        await schedule.save();
    } catch (error) {
        console.error('Failed to make schedules', error);
    }
}

async function main() {
    try {
        const response = await fetch(domain + '/life/travel-and-transportation/university-transportation/routes-and-schedules.html');
        const html = await response.text();
        const $ = cheerio.load(html);
        let routeLinks = [];
        
        // get links to websites with routes
        $('a.promo.cq-dd-image').each((index, element) => {
            const promoTitle = $(element).find('.promo-title').text().trim();
            if (promoTitle.startsWith('Route')) {
                let href = $(element).attr('href');
                if (href.startsWith('http://')) { // error on website? should be https
                    href = href.replace("http://", "https://");
                }
                else {
                    href = domain + href; // add domain to relative url
                }
                //console.log(href);
                routeLinks.push(href);
            }
        });
        
        for (const routeLink of routeLinks) {
            await getSchedules(routeLink);
        }
    } catch (err) {  
        console.log('Failed to fetch page: ', err);  
    }
};

main();

app.get('/', (req, res) => {
    res.render('layout');
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

app.get('/schedules', async (req, res) => {
    try {
        const selectedRoute = req.query.route;
        const schedule = await Schedule.findOne({route:selectedRoute});
        if (!schedule) {
            return res.status(404).send('Schedule not found for the selected route.');
        }
        const stopsLink = schedule.stops;
        res.render('layout', {
            selectedRoute: selectedRoute,
            stopsLink: stopsLink
        });
    } catch (error) {
        console.error('Error retrieving stops link:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new user
        const user = new User({ username, password: hashedPassword });
        // Save the user to the database
        await user.save();
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).send('Registration failed.');
    }
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true // Optional: to display error messages if login fails
}));

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/login');
    });
});

app.post('/trip', (req, res) => {
    // TODO: get user's trip info, find and display trip
})

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login'); // Redirect unauthenticated users to the login page
}

app.listen(process.env.PORT || 3000);
