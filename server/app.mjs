import './config.mjs';
import './db.mjs';
import './auth.mjs';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import mongoose from 'mongoose';
import passport from 'passport';
import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import routes from './routes/routes.mjs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, '../client/dist');
app.use(express.static(distPath));

app.use(session({
    secret: 'bussing_key',
    resave: false,
    saveUninitialized: false,
}));


app.use('/api', routes);
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

const domain = 'https://www.nyu.edu'; // use to fetch schedules
const Schedule = mongoose.model('Schedule');
const checkSchedule = await Schedule.findOne({});
// if first time running, need to fetch schedules
if (!checkSchedule) {
    try {
        await fetchFromNYU(); // fetch schedules from nyu website first time running
    }
    catch (e) {
        console.log(e);
    }
}

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

app.listen(process.env.PORT ?? 8000);
console.log(`Server listening on ${process.env.PORT ?? 8000}`);