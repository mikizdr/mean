var express = require('express');
var app     = express();
var path    = require('path');

var port    = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public/app'));

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(port, function() {
    console.log('Magic happens on port ' + port);
});