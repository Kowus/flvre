var express = require('express');
var router = express.Router();
var products = require('./clothes.json');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'FLVRE', products: products });
});

module.exports = router;