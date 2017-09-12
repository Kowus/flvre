var Products = require('../models/products.model');
module.exports = function (app, passport) {
    app.get('/', function (req, res, next) {
        Products.find({}, function (err, products) {
            if (err) {
                return res.send("Error Occured.")
            }
            Products.find({featured: true}, function (err, featured) {
                if (err) {
                    return res.send("Error Occured.")
                }
                res.render('index', {title: 'FLVRE', products: products, featured: featured});
            });
        });
    });

    app.get('/login', isNotLoggedIn, function (req, res, next) {
        res.render('login', {title: 'FLVRE: Login', message:req.flash('loginMessage')});
    });
    app.get('/signup', isNotLoggedIn, function (req, res, next) {
        res.render('signup', {title: 'FLVRE: Signup'});
    });
    app.get('/profile', isLoggedIn, function (req, res, next) {
        res.json(req.user);
    });


    app.get('/products', function (req, res, next) {
        Products.find({}, function (err, products) {
            if (err) {
                return res.send("Error Occured.")
            }
            res.render('products',{products:products});
        });
    });
    app.get('/products/id/:id', function (req, res, next) {
        Products.findOne({_id: req.params.id}, function (err, product) {
            if (err) {
                return res.send("Error Occured.")
            }
            res.render('single',{product:product});
        });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
};

var needsGroup = function(group) {
    return function(req, res, next) {
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

    res.redirect('/login');
}

// route middleware to make sure a user is logged in
function isNotLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        res.redirect('/profile');
    else
        return next();
}