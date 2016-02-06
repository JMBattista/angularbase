(function () {
    'use strict';

    angular
        .module('blocks.socket')
        .service('ObservableSocket', constructor);

    /* @ngInject */
    function constructor($q, logger, io, Rx, SOCKET_EVENT) {

        init();

        return ObservableSocket;

        /*
         * Observable Socket
         */

        function ObservableSocket(namespace, contentTypes) {
            let self = this
            this.socket = createInternal(namespace);

            this.content = Rx.Observable.fromArray(contentTypes)
                .map(type => Rx.Observable.fromEventPattern(
                    function add(h) { listenInternal(self.socket, type, h); },
                    function remove(h) { unlistenInternal(self.socket, type, h); },
                    function select(data) { return { type: type, data: data } })
                    )
                .mergeAll();

            this.status = Rx.Observable.fromArray(SOCKET_EVENT.ALL)
                .map(type => Rx.Observable.fromEventPattern(
                    function add(h) { listenInternal(self.socket, type, h); },
                    function remove(h) { unlistenInternal(self.socket, type, h); },
                    function select(data) { return { type: type, data: data } })
                    )
                .mergeAll();
        }

        function init() {
            ObservableSocket.prototype.send = send;
        }

        function send(type, data, reqAck = true, timeout = 0) {
            var deferred = $q.defer();
            var resolved = false;

            try {
                var socket = this.socket;

                if (reqAck) {
                    sendInternal(socket, type, data, function (ackData) {
                        if (!resolved) {
                            resolved = true;
                            deferred.resolve(ackData);
                        }
                    });

                    if (typeof (timeout) === 'number' && !isNaN(timeout)) {
                        setTimeout(function () {
                            if (!resolved) {
                                resolved = true;
                                deferred.reject('timeout');
                            }
                        }, timeout);
                    }
                }
                else {
                    sendInternal(socket, type, data);

                    if (!resolved) {
                        resolved = true;
                        deferred.resolve('');
                    }
                }
            }
            catch (error) {
                logger.error('Socket send error: ' + error);
                if (!resolved) {
                    resolved = true;
                    deferred.reject(error);
                }
            }

            return deferred.promise;
        }

        /*
         * Websocket Library Wrapper Functions
         * This is a very thin wrapper around the socket.io library so that, should we want to replace it,
         * we need only modify these functions and not deal with the complicated logic of send or similar
         * functions.
         */

        function createInternal(namespace) {
            return io.connect(namespace);
        }

        function sendInternal(socket, type, data, ack) {
            socket.emit(type, data, ack);
        }

        function listenInternal(socket, type, func) {
            socket.on(type, func);
        }

        function unlistenInternal(socket, type, func) {
            socket.removeListener(type, func);
        }
    }
})();