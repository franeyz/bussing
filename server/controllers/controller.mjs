import '../db.mjs';
import mongoose from 'mongoose';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
const User = mongoose.model('User');
const Schedule = mongoose.model('Schedule');
import {hashPassword, comparePassword} from '../auth.mjs';

const domain = 'https://www.nyu.edu'; // use to fetch schedules

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
        let schedule = await Schedule.findOne({route:selectedRoute});
        // if first time running, need to fetch schedules
        if (!schedule) {
            await fetchFromNYU();
            schedule = await Schedule.findOne({route:selectedRoute});
            if (!schedule) {
                return res.status(404).json({error: 'Schedule not found for the selected route.'});
            }
        }
        const stopsLink = schedule.stops;
        res.json({selectedRoute, stopsLink});
    } catch (error) {
        console.error('Error retrieving stops link:', error);
        res.status(500).send('Internal Server Error');
    }
};

async function getStops(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);
        //console.log($.html());
        const route = $('#main-title').text().trim();
        const sheetsLink = $('a:contains("' + route + ' Schedule")')
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

async function fetchFromNYU() {
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
            await getStops(routeLink);
        }
    } catch (err) {  
        console.log('Failed to fetch page: ', err);  
    }
};

export {registerUser,loginUser, getSchedules};