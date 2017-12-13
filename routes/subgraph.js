var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var exec = require('child_process').exec,child;
var url = require('url');
var fs = require('fs');

router.post('/', function(req, res, next) {
    console.log(req.body);
    // child = exec('java -jar /home/node-v8.1.3-linux-x64/bin/graph_client.jar ' + JSON.stringify(JSON.stringify(req.body)), {maxBuffer: 5000 * 1024},
    //     function (error, java_response, stderr) {
    //         //console.log('response: ' + java_response);
    //         console.log('stderr: ' + stderr);
    //         if (error !== null) {
    //             console.log('exec error: ' + error);
    //         }
    //         res.contentType('application/json');
    //         res.send(java_response);
    //     });
    res.end(fs.readFileSync('public/data/lujing3.json'));
});

module.exports = router;
