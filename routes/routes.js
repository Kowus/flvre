var Products = require('../models/products.model');
module.exports = function (app, passport) {
    app.get('/', function (req, res, next) {
        Products.aggregate([
            {$sort: {"dateAdded": -1}},
            {$limit: 12}
        ], function (err, products) {
            if (err) {
                return res.send("Error Occured." + err)
            }
            Products.find({featured: true}, function (err, featured) {
                if (err) {
                    return res.send("Error Occured." + err);
                }
                res.render('index', {title: 'FLVRE', products: products, featured: featured});
            });
        });
    });

    app.get('/login', isNotLoggedIn, function (req, res, next) {
        res.render('login', {title: 'FLVRE: Login', message: req.flash('loginMessage')});
    });
    app.get('/signup', isNotLoggedIn, function (req, res, next) {
        res.render('signup', {title: 'FLVRE: Signup'});
    });
    app.get('/profile', isLoggedIn, function (req, res, next) {
        res.json(req.user);
    });
    app.use('/products', require('./products'));



    app.get('/search_member', function (req, res) {
        var regex = new RegExp(req.query["term"], 'i');
        var query = Products.find({name: regex}).sort({"dateAdded": -1});

        query.exec(function (err, users) {
            if (!err) {
                // Method to construct the json result set
                var result = buildResultSet(users);
                res.send(result, {
                    'Content-Type': 'application/json'
                }, 200);
            } else {
                res.send(JSON.stringify(err), {
                    'Content-Type': 'application/json'
                }, 404);
            }
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

var needsGroup = function (group) {
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

    res.redirect('/login');
}

// route middleware to make sure a user is logged in
function isNotLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        res.redirect('/profile');
    else
        return next();
}

var buildResultSet = function (docs) {
    var result = [];
    for (var object in docs) {
        result.push(docs[object]);
    }
    return result;
}