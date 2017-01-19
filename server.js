var express     = require('express');       // call ecpress
var app         = express();                // define our app using express
var bodyParser  = require('body-parser');   // get body-parser
var morgan      = require('morgan');        // use to see request in the console
var mongoose    = require('mongoose');      // for working with database
var port        = process.env.PORT || 8080; // set the port for our app

// Cross Origin Request Settings
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
mongoose.connect('mongodb://user:kikiriki07@ds111798.mlab.com:11798/contact_list', function(err, db) {
    if(!err) {
        console.log('We are connected to mongo!');
    }
});

// ROUTES FOR OUR API ----------------------
// =========================================

// basic route ofr the home page
app.get('/', function(req, res) {
    res.send('Welcome to the home page!');
});

// get an instance of the express router
var apiRouter = express.Router();

// test to make sure everything is wokring
// accesse at GET http://localhost:8080/api
apiRouter.get('/', function(req, res) {
    res.json({ message: 'Hooray! Welcome to our api!'});
});

// more routes for our API will happen here

// REGISTER OUR ROUTES --------------------
// all of our routes will be prefixed with /api
app.use('/api', apiRouter);

// STATR THE SERVER
app.listen(port, function() {
    console.log('Magic happens on port ' + port);
});