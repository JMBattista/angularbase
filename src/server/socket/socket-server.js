'use strict';

/*
 * Module dependencies
 */

var socketio = require('socket.io');
var fs = require('fs')

/**
 * Module Exports
 */
module.exports = SocketServer; 

/**
 * SocketServer constructor
 * @param {http.Server} http Server 
 */
function SocketServer(server) {
    if (!(this instanceof SocketServer)) return new SocketServer(server);
    console.log('Websocket Server Initializing');
    this.io = socketio(server);
}

/**
 * 
 * @param {String} the namespace to add to the socket 
 * @param {Array[String]} path(s) to where the apis for the given namespace may be found
 */
SocketServer.prototype.addNamespace = function (namespace, apiDirectories) {

    console.log('Adding socket handling for namespace ' + namespace + " from " + apiDirectories);

    var namespaceSocket = this.io.of(namespace);

    apiDirectories.forEach(function (directory) {
        fs.readdirSync(directory).forEach(function (module) {
            if (module.endsWith('.js') && !module.endsWith('spec.js'))
                require(directory + module)(namespaceSocket);
        })
    });
}