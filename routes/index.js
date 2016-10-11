var express =  require('express');
var router = express.Router();

router.get('/', function(req, res) {

    // ejs render automatically looks in the views folder
    res.render('index');
});

router.get('/versions', function(req, res) {
	res.render('version');
});

router.get('/pipeline', function(req, res) {
	res.render('pipeline');
});

module.exports = router;