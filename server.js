// BASE SETUP
// ==========================================

var express     = require('express');       // call ecpress
var app         = express();                // define our app using express
var bodyParser  = require('body-parser');   // get body-parser
var morgan      = require('morgan');        // use to see request in the console
var mongoose    = require('mongoose');      // for working with database
var jwt         = require('jsonwebtoken');  // grab jsonwebtoken package in our server
var path        = require('path');

var config      = require('./config');

// Cross Origin Reseources Sharing
var cors        = require('./services/cors');

// pull in user mode from app/models/user
var User        = require('./app/models/user');

// APP CONFIGUTATION ---------------------
// use body parser so we can grab indormtion from POST request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MIIDLEWARE
// configure our app to handle CORS requests
app.use(cors);

// log all requests to the console
app.use(morgan('dev'));

// connect to our database (hosted on mlab)
mongoose.Promise = global.Promise;
mongoose.connect(config.database, function(err, db) {
    if(!err) {
        console.log('We are connected to mongo!');
    }
});

// set static file location
// used for requests that our frontend will make
app.use(express.static(__dirname + '/public/app'));

// ROUTES FOR OUR API ----------------------
// =========================================

// API ROUTES
// REGISTER OUR ROUTES ---------------------
// all of our routes will be prefixed with /api
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

// MAIN CATCHALL TOUTE ---------------------
// SEND USERS TO FRONTEND ------------------
// has to be registered after API ROUTES
// Using the * will match all routes.It is important to 
// put this route after the API routes since we only
// want it to catch routes not handled by Node. 
// If this were placed above the API routes, 
// then our user would always be sent the index.html 
// file and never even get to the API routes.
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// STATR THE SERVER
app.listen(config.port, function() {
    console.log('Magic happens on port ' + config.port);
});