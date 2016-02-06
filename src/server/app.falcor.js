/*jshint node:true*/
'use strict';

var domain = require('domain');
var d = domain.create();

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
        route:'categories[{integers:categories}].name',
        get: function(pathSet) {
            let categories = db.categories.findAll();

            return pathSet.categories.map(category => {
                return {
                    path: ['categories', category, 'name'],
                    value: categories[category].name
                }
            });

        }
    },
    {
        route:'categories[{integers:categories}].hotels[{integers:hotels}]',
        get: function(pathSet) {
            let categories = db.categories.findAll();

            let result = pathSet.categories.map(categoryIndex => {
                let category = categories[categoryIndex].name;

                let hotels = db.hotels
                    .findAll()
                    .filter(hotel => hotel.categories.indexOf(category) != -1)
                    .map(hotel => hotel.id);

                let indexedHotels = pathSet.hotels
                        .map(index => hotels.splice(index, 1))
                        .reduce((acc, value) => acc.concat(value), []);

                console.log('indexedHotels', indexedHotels);

                let results = pathSet.hotels.map(index => ({
                        path: ['categories', categoryIndex, 'hotels', index],
                        value: jsong.ref(['hotelsById', indexedHotels[index]])
                    }));

                return results;

            })
            .reduce((acc, value) => acc.concat(value), []);

            return result;
        }
    },
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
        },
    },
    {
        route:'hotelsById[{keys:ids}].userRating',
        set: function(jsonGraph) {
            console.log('called');
        }
    }

]);

