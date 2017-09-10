module.exports = function (app, passport) {
    app.get('/', function (req, res, next) {
        var products = require('./clothes.js');
        res.render('index', {title: 'FLVRE', products: products});
    });

    app.get('/login', isNotLoggedIn,function (req, res, next) {
        res.render('login', {title:'FLVRE: Login'});
    });
    app.get('/signup', isNotLoggedIn, function (req, res, next) {
        res.render('signup', {title:'FLVRE: Signup'});
    });
    app.get('/profile', isLoggedIn, function (req, res, next) {
        res.json(req.user);
    })

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

};

var needsGroup = function(group) {
    return [
        passport.authenticate('local-login'),
        function(req, res, next) {
            if (req.user && req.user.group === group)
                next();
            else
                res.send(401, 'Unauthorized');
        }
    ];
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    res.redirect('/login');
}

// route middleware to make sure a user is logged in
function isNotLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        res.redirect('/profile');
    else
        return next();
}