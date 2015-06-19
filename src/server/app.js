/*jshint node:true*/
'use strict';

var koa = require('koa');
var fs = require('fs');

var app = koa();

var port = process.env.PORT || 8001;
var four0four = require('./utils/404')();

var environment = process.env.NODE_ENV;

app.use(require('koa-static')(".dist", {}));

app.use('/api', require('./routes'));
app.use(require('koa-router')(app));

app.use(function *() {
     "use strict";
     this.body = "Page not found!";
});

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);
       

app.listen(port, function() {
    console.log('Express server listening on port ' + port);
    console.log('env = ' + app.get('env') +
        '\n__dirname = ' + __dirname  +
        '\nprocess.cwd = ' + process.cwd());
});
