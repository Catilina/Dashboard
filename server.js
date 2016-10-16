var throng = require('throng');

var WORKERS = process.env.WEB_CONCURRENCY || 1;

throng({
  workers: WORKERS,
  lifetime: Infinity,
  start: start
});


function start() {

var express = require('express');
var app = express();




var routes = require('./routes/index');
var api = require('./api/index');

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

app.use('/api', api);
app.use('/', routes);
app.use('*', routes);



app.listen(port, function() {
    //console.log('Our app is running on http://localhost:' + port);
});

}
