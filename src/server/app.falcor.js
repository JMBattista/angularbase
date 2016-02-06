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
        /*
         * Get the category names.
         * Normally you'd want a better logic than the order they are stored in db.
         * ie - a per user top category list that
         */
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
        /*
         * Get the list of hotels in a given category.
         * Again we are simply using the order of simple DB to control the ordering.
         * In a real application we'd want to use more advanced methods to select our orderings.
         */
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
        /*
         * Get property information for some Hotel
         */
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
        /*
         * Update the user rating of the hotel
         * In this example the hotel is rated by only one user, but in a real application we'd want
         * to have an aggregate rating as well as each users personal rating.
         */
        route:'hotelsById[{keys:ids}].userRating',
        set: function(jsonGraph) {
            let hotels = jsonGraph.hotelsById;
            let ids = Object.keys(hotels);

            ids.forEach(id => {
                let hotel = db.hotels.findById(id);
                hotel.userRating = hotels[id].userRating = coerce(hotels[id].userRating);
            });

            // Return the post-coercion envelope
            return jsonGraph;

            function coerce(rating) {
                if (rating > 5)
                    return 5;
                if (rating < 1)
                    return 1;
                return rating;
            }
        }
    }

]);

