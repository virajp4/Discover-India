const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res) => {
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
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    res.locals.returnTo = res.locals.returnTo == '/spots/:id/review' ? '/spots/' : res.locals.returnTo;
    const redirectUrl = res.locals.returnTo || '/spots';
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
   req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/spots');
    });
}