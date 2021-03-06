var express = require('express');
var router = express.Router();
var Products = require('../models/products.model');
var User = require('../models/users.model');

router.get('/', function (req, res, next) {
    var productCount = [];
    var tags = [];
    var show = Number(req.query.show) || 12;
    var page = req.query.page || 1;
    var reqSort = req.query.sort || "dateAdded_-1";
    reqSort = reqSort.split("_");
    var sort = {};
    sort[reqSort[0]] = Number(reqSort[1]);
    Products.aggregate([
        {$sort: sort},
        {$skip: show * (page - 1)},
        {$limit: show}
    ], function (err, products) {
        if (err) {
            return res.send("Error Occured." + err)
        }
        Products.count({}, function (err, count) {
            if (err) return console.error(err);
            if (count <= show) productCount.push(1);
            else {
                var myDP = count % show;
                for (var i = 1; i <= count / show; i++) {
                    productCount.push(i)
                }
                if (myDP !== 0) {
                    productCount.push(productCount[productCount.length - 1] + 1);
                }
            }
            products.forEach(function (product) {
                product.tags.forEach(function (tag) {
                    if (!tags.includes(tag)) {
                        tags.push(tag);
                    }
                });
            });
            if (!productCount.includes(Number(page))) {
                res.redirect('/products?page=' + productCount[productCount.length - 1] + "&show=" + show);
            } else {
                res.render('products', {products: products, count: productCount, currPage: page, tags: tags, limit: show, title: "Shop All Products",sort:req.query.sort});
            }
        });

    });
});
router.get('/id/:id', function (req, res, next) {
    Products.findOne({_id: req.params.id}, function (err, product) {
        if (err) {
            return res.send("Error Occured.")
        }
        Products.find({tags: {$in: product.tags}, _id: {$ne: product._id}}, function (err, related) {
            if (err) {
                console.error(err);
            }
            res.render('single', {product: product, related: related, title: "Shop " + product.name});
        });

    });
});

router.get('/tags/:tag', function (req, res, next) {
    var productCount = [];
    var tags = [];
    var show = Number(req.query.show) || 12;
    var page = req.query.page || 1;
    var reqSort = req.query.sort || "dateAdded_-1";
    reqSort = reqSort.split("_");
    var sort = {};
    sort[reqSort[0]] = Number(reqSort[1]);
    Products.aggregate([
        {$match: {tags: req.params.tag}},
        {$sort: sort},
        {$skip: show * (page - 1)},
        {$limit: show}
    ], function (err, products) {
        if (err) {
            return res.send("Error Occured." + err)
        }
        var count = products.length;
        Products.count({tags: req.params.tag}, function (err, count) {
            if (err) return console.error(err);
            if (count <= show) productCount.push(1);
            else {
                var myDP = count % show;
                for (var i = 1; i <= count / show; i++) {
                    productCount.push(i)
                }
                if (myDP !== 0) {
                    productCount.push(productCount[productCount.length - 1] + 1);
                }
            }
            products.forEach(function (product) {
                product.tags.forEach(function (tag) {
                    if (!tags.includes(tag)) {
                        tags.push(tag);
                    }
                });
            });
            if (!productCount.includes(Number(page))) {
                res.redirect('/products?page=' + productCount[productCount.length - 1] + "&show=" + show);
            } else {
                res.render('products', {products: products, count: productCount, currPage: page, tags: tags, limit: show, title: "Shop all " + req.param("tag"), sort:req.query.sort});
            }
        });

    });
});


module.exports = router;