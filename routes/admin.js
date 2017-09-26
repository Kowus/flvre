var express = require('express');
var router = express.Router();
var passport = require('passport');
var Product = require('../models/products.model');
var multipart = require('connect-multiparty');
var uploader = require('express-fileuploader');
var S3Strategy = require('express-fileuploader-s3');

uploader.use(new S3Strategy({
    uploadPath: '/uploads',
    headers: {
        'x-amz-acl': 'public-read'
    },
    options: {
        key: process.env.S3_KEY_ID,
        secret: process.env.S3_SECRET_ACCESS_KEY,
        bucket: process.env.S3_BUCKET_NAME
    }
}));

router.use('/upload/image', multipart());
/* /!admin */
router.get('/login', isNotLoggedIn, function (req, res, next) {
    res.render('admin-login', {title: "Admin Login", admin: true});
});

router.get('/profile', needsGroup("admin"), function (req, res, next) {
    res.render('admin-console', {title: "Admin Login", admin: true});
});


router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/!admin/profile',
    failureRedirect: '/!admin/login',
    failureFlash: true
}));

router.post('/add_item', needsGroup('admin'), function (req, res, next) {
    console.log(req.body);
    var newProduct = new Product({
        description:req.body.description,
        featured:req.body.featured=='true',
        images:{thumb:req.body.image},
        name:req.body.name,
        price:req.body.price,
        shortdes:req.body.shortdes,
        specifications:{
            sizes:JSON.parse(req.body.sizes)
        },tags:req.body["tags[]"]
    });
    newProduct.save(function (err, result) {
        if (err) return res.json({status: 501, result: err});
        res.json(result);
    });
});

router.post('/upload/image', needsGroup('admin'), function(req, res, next) {
    console.log(req.files['images']);
    uploader.upload('s3', req.files['images'], function(err, files) {
        if (err) {
            return next(err);
        }
        res.json(files[0]);
    });
});



module.exports = router;


function needsGroup(group) {
    return function (req, res, next) {
        if (req.user && req.user.group === group)
            next();
        else
            res.status(401).send('Unauthorized');
    };
}

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