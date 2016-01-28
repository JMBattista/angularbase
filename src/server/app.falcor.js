/*jshint node:true*/
'use strict';

var jsong = require('falcor-json-graph');
var FalcorRouter = require('falcor-router');
var db = require('./db.js');
var Promise = require('promise');

module.exports = new FalcorRouter([
    {
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
    },
    {
        route:'hotelCategories[{integers:categories}].name',
        get: function(pathSet) {
            let hotelCategories = db.categories.findAll();

            let result = pathSet.categories.map(category => {
                return {
                    path: ['hotelCategories', category, 'name'],
                    value: hotelCategories[category].name
                }
            });

            console.log('result', result);
            return result; 
        }
    },
    // {
    //     route:'hotelCategories[{integers:categories}].hotels[{integers:hotels}]',
    //     get: function(pathSet) {
    //         let hotelCategories = db.categories.findAll();

    //         console.log('------------');
    //         console.log('categories', pathSet.categories);
    //         console.log('hotelIndex', pathSet.hotels);

    //         let result = pathSet.categories.map(key => {
    //             console.log('...', key);
    //             console.log('....', hotelCategories[key].name);
    //             return {
    //                 path: ['hotelCategories', key, 'name'],
    //                 value: hotelCategories[key].name
    //             }
    //         });

    //         console.log('result', result);
    //         return result; 
    //     }
    // },
    {
        route: 'hotelsById[{keys:ids}].[{keys:props}]',
        get: function(pathSet) {
            let paths = pathSet.ids.map(id =>
                pathSet.props.map(prop => ({
                    path: ['hotelsById', id, prop],
                    value: db.hotels.findById(id)[prop]
                })))
                .reduce((acc, value) => acc.concat(value), []);

            return paths;
            // return {"jsonGraph":{"hotels":{"A":{"cost":"$$","name":"Hotel A","userRating":4},"B":{"cost":"$$","name":"Hotel B"},"C":{"cost":"$$","name":"Hotel C"}}}}
        }
    }

]);

