const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');

const Joi = require('joi');
const { spotSchema , reviewSchema } = require('./schemas.js');

const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const Spot = require('./models/spot');
const Review = require('./models/reviews');

const spots = require('./routes/spots');
const reviews = require('./routes/reviews');

mongoose.connect('mongodb://127.0.0.1:27017/discover-rajkot', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const app = express();

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'viraj',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge: (1000 * 60 * 60 * 24 * 7)
    }
};
app.use(session(sessionConfig));

app.use('/spots', spots);
app.use('/spots/:id/reviews', reviews);

app.get('/', (req, res) => {
    res.render('home');
});

app.all("*", (req, res, next) => {
    res.send(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});