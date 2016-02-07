(function () {
    'use strict';

    angular
        .module('blocks.socket')
        .service('ObservableSocket', constructor);

    /* @ngInject */
    function constructor($q, logger, io, Rx, SOCKET_DEFAULTS, SOCKET_STATUS) {

        return ObservableSocket;

        /*
         * Creates an ObservableSocket
         * @param {string} namespace the namespace to which to bind the ObservableSocket
         * @param {Array} contentTypes the socket events to watch for on this socket
         */
        function ObservableSocket(namespace, contentTypes) {
            let socket = createInternal(namespace),
                sent = new Rx.Subject();

            this.received = createObservable(socket, contentTypes);
            this.status = createObservable(socket, SOCKET_STATUS.ALL);
            this.sent = sent;

            this.watchAndSend = function (source, type, reqAck, timeout) {
                return watchAndSend(socket, sent, source, type, reqAck, timeout);
            }
        }
        
        /**
         * Watches the provided observable and sends anything received on that observable through the socket as directed
         * @param {IO.Socket} the socket on which to send the data
         * @param {Rx.Subject} sent a observable on which to emit any data sent
         * @param {Rx.Observable} source the observable to watch for new data to send
         * @param {string} type the socket event on which to send the data
         * @param {boolean} reqAck whether to request acknowledgement of receipt or assume receipt if no error produced
         * @param {Number} timeout the time to wait for acknowledgement before a deemed failure
         * @returns {Rx.Observable} an observable providing {type, data, status} objects for each sent message where type
         * is the socket event used to send it, data is the message content, and status is an observable which will resolve
         * with the acknowledgement data (or null if no acknowledgement required) if successful and an error otherwise.
         */
        function watchAndSend(socket, sent, source, type, reqAck = SOCKET_DEFAULTS.REQUIRE_ACKNOWLEDGEMENT, timeout = SOCKET_DEFAULTS.TIMEOUT_MS) {
            let output = source
                .map(data => {
                    return { type: type, data: data, status: Rx.Observable.fromPromise(send(socket, type, data, reqAck, timeout)) };
                });

            output.subscribe(message => sent.onNext(message));

            return output;
        }
        
        /**
         * Creates an observable from the socket that produces objects whenever there is a socket
         * event in the provided list.  The object produced is of the form {type, data} where type
         * is the type of the socket event received and data is any additional received data 
         * @param {IO.Socket} socket the socket to observe
         * @param {Array} types an array of socket events to wrap
         * @returns {Rx.Observable} the created observable
         */
        function createObservable(socket, types) {
            return Rx.Observable.fromArray(types)
                .map(type => Rx.Observable.fromEventPattern(
                    function add(h) { listenInternal(socket, type, h); },
                    function remove(h) { unlistenInternal(socket, type, h); },
                    function select(data) { return { type: type, data: data } })
                    )
                .mergeAll();
        }
        
        /**
         * Sends the provided data over the socket
         * @param {IO.Socket} socket the socket on which to transmit the data
         * @param {string} type the socket event to use for the transmission
         * @param {Object} data the data to transmit over the socket
         * @param {boolean} reqAck whether to request acknowledgement of receipt or assume receipt if no error produced
         * @param {Number} timeout the time to wait for acknowledgement before a deemed failure
         * @returns a promise that will be resolved when the transmission has succeed or failed
         */
        function send(socket, type, data, reqAck, timeout) {
            var deferred = $q.defer();
            var resolved = false;

            try {
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
                                logger.warn('Socket send timeout');
                                deferred.reject('timeout');
                            }
                        }, timeout);
                    }
                }
                else {
                    sendInternal(socket, type, data);

                    if (!resolved) {
                        resolved = true;
                        deferred.resolve(null);
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