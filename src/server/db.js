/*jshint node:true*/
'use strict';

/*
 * Simple in memory db for demonstrating Falcor
 * This db reads the contents of the ./data files in as JSON and stores that for each 'collection'
 */

var fs = require('fs');
var path = require('path');
var extname = path.extname;

var db = {};

fs.readdirSync(`${__dirname}/data`).forEach(function (flatFile) {
    fs.readFile(`${__dirname}/data/${flatFile}`, 'utf8', (err, data) => {
        if (err) return console.log(err);
        let key = path.basename(flatFile, extname(flatFile));
        db[key] = wrap(JSON.parse(data));
    });
});

function stat(file) {
  return function (done) {
    fs.stat(file, done);
  };
}

function wrap(list) {
	return {
		findAll: () => list,
		findById: (id) => {
			let results = list.filter(i => i.id === id);
			return results.length == 1 ? results[0] : null;
			}
	}
}


module.exports = db;