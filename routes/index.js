var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var exec = require('child_process').exec,child;
var url = require('url');
var fs = require('fs');

router.use(bodyParser.json()); // for parsing application/json

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('indexnew', { title: 'Express' });
});

module.exports = router;
