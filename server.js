var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text({ type: 'text/plain' }));
app.use(bodyParser.json());

app.use('/', express.static(__dirname + '/www'));

app.use('/user', require('./models/User.js'));

var server = http.Server(app);

server.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Cherry app listening at http://%s:%s', host, port);
});