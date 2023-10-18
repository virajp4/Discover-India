const express = require('express');
const passport = require('passport');

const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const { storeReturnTo } = require('../middleware');

const router = express.Router();

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);

        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Discover Rajkot!');
            res.redirect('/spots');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), async (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/spots');
    });
});

module.exports = router;