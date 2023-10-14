const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const engine = require('ejs-mate');

const Joi = require('joi')
const { spotSchema , reviewSchema } = require('./schemas.js');

const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const Spot = require('./models/spot');
const Review = require('./models/reviews');

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

const validateSpot = (req, res, next) => {
    const result = spotSchema.validate(req.body);
    if (result.error) {
        const msg = result.error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

const validateReview = (req, res, next) => {
    const result = reviewSchema.validate(req.body);
    if (result.error) {
        const msg = result.error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/spots', catchAsync(async (req, res) => {
    const spots = await Spot.find({});
    res.render('spots/index', { spots });
}));

app.get('/spots/new', (req, res) => {
    res.render('spots/new');
});

app.post('/spots', validateSpot, catchAsync(async (req, res, next) => {
    const spot = new Spot(req.body.spot);
    await spot.save();
    res.redirect(`/spots/${spot._id}`);
}));

app.get('/spots/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const spot = await Spot.findById(id).populate('reviews');
    res.render('spots/show', { spot });
}));

app.get('/spots/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const spot = await Spot.findById(id);
    res.render('spots/edit', { spot });
}));

app.put('/spots/:id', validateSpot, catchAsync(async (req, res) => {
    const { id } = req.params;
    const spot = await Spot.findByIdAndUpdate(id, { ...req.body.spot });
    res.redirect(`/spots/${spot._id}`);
}));

app.delete('/spots/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Spot.findByIdAndDelete(id);
    res.redirect('/spots');
}));

app.post('/spots/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const spot = await Spot.findById(req.params.id);
    const review = new Review(req.body.review);
    spot.reviews.push(review);
    await review.save();
    await spot.save();
    res.redirect(`/spots/${spot._id}`);
}));

app.delete('/spots/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    await Spot.findByIdAndUpdate(req.params.id, { $pull: { reviews: req.params.reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    res.redirect(`/spots/${req.params.id}`);
}));

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