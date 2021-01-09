const {Router} = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
resolve = require('path').resolve;

const router = Router();
router.use(bodyParser.json());



router.get('/', function(req, res) {
    fs.readFile('../ttsaasjet/client/index.html', function (err, data) {
        res.writeHead(200, {'Content-Type': 'text/html', 'Content-Length': data.length});
        res.write(data);
        res.end();
    });
});




module.exports = router;