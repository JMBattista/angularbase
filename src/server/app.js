/*jshint node:true*/
'use strict';

var koa = require('koa');
var bodyParser = require('koa-bodyparser');
var gzip     = require('koa-gzip');
var fs = require('fs');
var path = require('path');
var extname = path.extname;

var app = koa();

var port = process.env.PORT || 8001;

var environment = process.env.NODE_ENV;

app.use(gzip());

// Set the
app.use(function *pageNotFound(next){
  yield next;

  if (404 != this.status) return;

  // we need to explicitly set 404 here
  // so that koa doesn't assign 200 on body=
  this.status = 404;

  switch (this.accepts('html', 'json')) {
    case 'html':
      this.type = 'html';
      this.body = '<p>Page Not Found</p>';
      break;
    case 'json':
      this.body = {
        message: 'Page Not Found'
      };
      break;
    default:
      this.type = 'text';
      this.body = 'Page Not Found';
  }
});

app.use(require('koa-static')('.dist', {}));

// Grab the router configuration and hook it up
var router = require('./app.router.js');
app
  .use(router.routes())
  .use(router.allowedMethods());

// For website paths return the index page and let client side router handle it.
app.use(function *() {
    var index = '.dist/index.html';
    var fstat = yield stat(index);

    if (fstat.isFile()) {
      this.type = extname(index);
      this.body = fs.createReadStream(index);
    }
});

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);


app.listen(port, function() {
    console.log('Koa server listening on port ' + port);
    console.log('\n__dirname = ' + __dirname  +
        '\nprocess.cwd = ' + process.cwd());
});

function stat(file) {
  return function (done) {
    fs.stat(file, done);
  };
}