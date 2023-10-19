const express = require('express');
const passport = require('passport');

const catchAsync = require('../utils/catchAsync');
const { storeReturnTo } = require('../middleware');

const user = require('../controllers/users');

const router = express.Router();

router.route('/register')
    .get(user.renderRegister)
    .post(catchAsync(user.register));

router.route('/login')
    .get(user.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.login);

router.get('/logout', user.logout);

module.exports = router;