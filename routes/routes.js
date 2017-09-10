module.exports = function (app, passport) {
    app.get('/', function (req, res, next) {
        var products = require('./clothes.json');
        res.render('index', {title: 'FLVRE', products: products});
    });

    app.get('/login', function (req, res, next) {
        res.render('login', {title:'FLVRE: Login'});
    });
    app.get('/signup', function (req, res, next) {
        res.render('signup', {title:'FLVRE: Signup'});
    });

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