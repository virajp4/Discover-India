const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { spotSchema } = require('../schemas.js');
const { isLoggedIn } = require('../middleware');

const Spot = require('../models/spot');

const validateSpot = (req, res, next) => {
    const result = spotSchema.validate(req.body);
    if (result.error) {
        const msg = result.error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

router.get('/', catchAsync(async (req, res) => {
    const spots = await Spot.find({});
    res.render('spots/index', { spots });
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('spots/new');
});

router.post('/', isLoggedIn, validateSpot, catchAsync(async (req, res, next) => {
    const spot = new Spot(req.body.spot);
    await spot.save();
    req.flash('success', 'Successfully made a new spot!');
    res.redirect(`/spots/${spot._id}`);
}));

router.get('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const spot = await Spot.findById(id).populate('reviews').populate('author');
    if (!spot) {
        req.flash('error', 'Cannot find that spot!');
        return res.redirect('/spots');
    }
    res.render('spots/show', { spot });
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const spot = await Spot.findById(id);
    res.render('spots/edit', { spot });
}));

router.put('/:id', validateSpot, catchAsync(async (req, res) => {
    const { id } = req.params;
    const spot = await Spot.findByIdAndUpdate(id, { ...req.body.spot });
    res.redirect(`/spots/${spot._id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Spot.findByIdAndDelete(id);
    res.redirect('/spots');
}));

module.exports = router;