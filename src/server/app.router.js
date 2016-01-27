/*jshint node:true*/
'use strict';

var router = require('koa-router')();
var falcorKoa = require('falcor-koa');
var fs = require('fs');
var db = require('./db.js');

// Import the Falcor configuration and use it for requests to model.json
router.all('/model.json', falcorKoa.dataSourceRoute(require('./app.falcor.js')));


router.get('/api/people', function*() {
    this.body = db['people'];
})

// Handle references to app (bad template)
router.all('/app/*', function *() {
    this.status = 404;
});

// Handle references to missing api functions
router.all('/api/*', function *() {
    this.status = 404;
});

var readFileThunk = function(src) {
  return new Promise(function (resolve, reject) {
    fs.readFile(src, {'encoding': 'utf8'}, function (err, data) {
      if(err) return reject(err);
      resolve(data);
    });
  });
}

module.exports = router;