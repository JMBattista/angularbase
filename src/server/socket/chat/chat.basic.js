'use strict';

/**
 * Module Exports
 */

module.exports = Attach;

/**
 * Attaches the basic socket behaviour to the provided namespace
 * @param {socket.io.Namespace} the namespace
 */
function Attach(namespace)
{
    namespace.on('connection', function (socket) {

        console.log('socket ' + socket.id + ' connected');

        socket.on('error', function (err) {
            console.log('socket ' + socket.id + " error: " + err);
        });

        socket.on('disconnect', function () {
            console.log('socket ' + socket.id + " disconnected");
        });

        socket.on('message', function (data, fn) {
            console.log('socket ' + socket.id + " broadcast: " + data);
            socket.broadcast.emit('message', 'Socket' + socket.id + ' sends ' + data);
            
            if (typeof(fn) === 'function')
                fn('');
        });
    });
}