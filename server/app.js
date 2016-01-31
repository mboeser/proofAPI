var express = require("express");
var app = express();
var path = require('path');
var port = process.env.PORT || 5000;

// send down static files
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "/public/views/index.html"));
});

// Listen //
app.listen(port);
console.log('The magic happens on port ' + port);
