#!/usr/bin/env node
var debug = require('debug')('expressapp');
var app = require('./app');

console.log("Starting Node Server");

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});

console.log("Node Server Running on " + server.address().port);
