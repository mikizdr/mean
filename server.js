// BASE SETUP
// ==========================================

var express     = require('express');       // call ecpress
var app         = express();                // define our app using express
var bodyParser  = require('body-parser');   // get body-parser
var morgan      = require('morgan');        // use to see request in the console
var mongoose    = require('mongoose');      // for working with database
var port        = process.env.PORT || 8080; // set the port for our app
var jwt         = require('jsonwebtoken');  // grab jsonwebtoken package in our server

// super secret for creating tokens
var superSecret = 'ilovescotchscotchyscotchscotch';

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
mongoose.Promise = global.Promise;
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

// route to authenticate a user
// accessed at POST http://localhost:8080/api/authenticate
apiRouter.post('/authenticate', function(req, res) {

    // find the user
    // select the name, username and password explicitly
    User.findOne({
        username: req.body.username
    }).select('name username password').exec(function(err, user) {

        if (err) throw err;

        // no user with that username was found
        if (!user) {
            res.json({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        } else if (user) {
            
            //check if password matches
            var validPassword = user.comparePassword(req.body.password);
            if (!validPassword) {
                res.json({
                    success: false,
                    message: 'Authentication failed. Wrong password.'
                });
            } else {

                // if user is found and password is right
                // create token
                var token = jwt.sign({
                    name: user.name,
                    username: user.username
                }, superSecret, {
                    expiresIn: '24h' // expires in 24 h
                });

                // return the information including token as json
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }
        }
    });

});

// midleware to use for all requests
// this is where we will authenticate users
apiRouter.use(function(req, res, next) {

    // do logging
    console.log('Somebody just came to our app!');


    
    next(); // used to be here but it have moved to be in if/else statement so that
    // our users will only continue forward if they have a valid token and it verified correctly
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

// on routes that end in /users/:user_id
//-----------------------------------------
apiRouter.route('/users/:user_id')

    // get the user with this id
    // (accessed at GET http://localhost:8080/api/users/:user_id)
    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err) res.send(err);

            // return that user
            res.json(user);
        });
    })

    // update the user with this id
    // (accessed at PUT http://localhost:8080/api/users/:user_id)
    .put(function(req, res) {

        // use our user model to find the user we want
        User.findById(req.params.user_id, function(err, user) {

            if (err) res.send(err);

            // update the user info only if its new
            if (req.body.name) user.name = req.body.name;
            if (req.body.username) user.username = req.body.username;
            if (req.body.password) user.password = req.body.password;

            // save the user
            user.save(function(err) {
                if (err) res.send(err);

                // return the message
                res.json({ message: 'User updated!'});
            });

        });
    })

    // delete the user with thi id
    // (accessed at DELETE http://localhost:8080/api/users/:user_id)
    .delete(function(req, res) {
        User.remove({
            _id: req.params.user_id
        }, function(err, user) {
            if (err) return res.send(err);

            res.json({ message: 'Successfully deleted!'});
        });
    });

// REGISTER OUR ROUTES --------------------
// all of our routes will be prefixed with /api
app.use('/api', apiRouter);

// STATR THE SERVER
app.listen(port, function() {
    console.log('Magic happens on port ' + port);
});