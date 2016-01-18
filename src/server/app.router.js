/*jshint node:true*/
'use strict';

var router = require('koa-router')();
var falcorKoa = require('falcor-koa');

// Import the Falcor configuration and use it for requests to model.json
router.all('/model.json', falcorKoa.dataSourceRoute(require('./app.falcor.js')));

// Handle references to app (bad template)
router.all('/app/*', function *() {
    this.status = 404;
});

// Handle references to missing api functions
router.all('/api/*', function *() {
    this.status = 404;
});

module.exports = router;