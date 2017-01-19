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

// basic route for the home page
app.get('/', function(req, res) {
    res.send('Welcome to the home page!');
});

// get an instance of the express router
var apiRouter = express.Router();

// midleware to use for all requests
apiRouter.use(function(req, res, next) {

    // do logging
    console.log('Somebody just came to our app!');

    // we`ll add more to the middleware later
    // this is where we will authenticate users
    
    // we go to the next routes and don`t stop here
    next();
});

// test route to make sure everything is working
// accessed at GET http://localhost:8080/api
apiRouter.get('/', function(req, res) {
    res.json({ message: 'Hooray! Welcome to our api!'});
});

// on routes that end in /users
// ----------------------------------------
apiRouter.route('/users')

    // create a user (accessed at POST http://localhost:8080/api/users)
    .post(function(req, res) {

        // create a new instance of the User model
        var user = new User();

        // set the users information (comes from request)
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;

        // save the user nad check for errors
        user.save(function(err) {
            if (err) {
                // ducplicate entry
                if (err.code == 11000)
                    return res.json({ success: false, message: 'A user with that username already exists.' });
                else
                    return res.send(err);
            }

            res.json({ message: 'User created!' });
        });
    })

    // get all the users (accessed at GET http://localhost:8080/api/users)
    .get(function(req, res) {
        User.find(function(err, users) {
            if (err) res.send(err);

            // return the users
            res.json(users);
        });
    });

// REGISTER OUR ROUTES --------------------
// all of our routes will be prefixed with /api
app.use('/api', apiRouter);

// STATR THE SERVER
app.listen(port, function() {
    console.log('Magic happens on port ' + port);
});