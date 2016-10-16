var express =  require('express');
var router = express.Router();

router.get('/', function(req, res) {

    // ejs render automatically looks in the views folder
    res.render('index');
});

router.get('*', function(req, res) {

    // ejs render automatically looks in the views folder
    res.render('index');
});


module.exports = router;