/*jshint node:true*/
'use strict';

var FalcorRouter = require('falcor-router');

module.exports = new FalcorRouter([{
    route: 'greeting',
    get: function() {
        return {
        path: ['greeting'],
        value: 'Hello World!'
        }
    }
},
{
    route: 'news',
    get: function() {
        return {
            path: ['news'],
            value: 'Hot Towel Angular is a SPA template for Angular developers!'
        }
    }
}]);

