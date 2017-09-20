var express = require('express');
var router = express.Router();
var passport = require('passport');

/* /!admin */

router.get('/login', function (req, res, next) {
    res.render('admin-login', {title:"Admin Login", admin:true});
});

router.get('/profile', needsGroup("admin"), function (req, res, next) {
    res.render('admin-console', {title:"Admin Login", admin:true});
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/!admin/profile',
    failureRedirect: '/!admin/login',
    failureFlash: true
}));


module.exports = router;


function needsGroup(group) {
    return function (req, res, next) {
        if (req.user && req.user.group === group)
            next();
        else
            res.send(401, 'Unauthorized');
    };
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    res.redirect('/!admin/login');
}

// route middleware to make sure a user is logged in
function isNotLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        res.redirect('/!admin/profile');
    else
        return next();
}