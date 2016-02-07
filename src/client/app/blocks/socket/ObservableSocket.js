(function () {
    'use strict';

    angular
        .module('blocks.socket')
        .service('ObservableSocket', constructor);

    /* @ngInject */
    function constructor($q, logger, io, Rx, SOCKET_DEFAULTS, SOCKET_SEND, SOCKET_STATUS) {

        init();

        return ObservableSocket;

        /*
         * Creates an ObservableSocket
         * @param {string} namespace the namespace to which to bind the ObservableSocket
         * @param {Array} contentTypes the socket events to watch for on this socket
         */
        function ObservableSocket(namespace, contentTypes) {
            var socket = createInternal(namespace);

            this.received = createObservable(socket, contentTypes);
            this.status = createObservable(socket, SOCKET_STATUS.ALL);
            this.sent = new Rx.Subject();

            this.send = function (type, data, reqAck, timeout) {
                return send(socket, type, data, reqAck, timeout);
            }
        }

        function init() {
            ObservableSocket.prototype.addInput = addInput;
        }
        
        /**
         * Watches the provided observable and sends anything received on that observable through the socket as directed
         * @param {Rx.Observable} input the observable from which to send socket data
         * @param {string} type the socket event on which to send the data
         * @param {boolean} reqAck whether to request acknowledgement of receipt or assume receipt if no error produced
         * @param {Number} timeout the time to wait for acknowledgement before a deemed failure
         * @returns {Rx.Observable} an observable providing {data, status} objects for each sent message where data is
         * the sent data and status is an observable of its current status
         */
        function addInput(input, type, reqAck = SOCKET_DEFAULTS.REQUIRE_ACKNOWLEDGEMENT, timeout = SOCKET_DEFAULTS.TIMEOUT_MS) {
            var self = this;

            return input
                .map(function (data) {
                    return { type: type, data: data, status: Rx.Observable.fromPromise(self.send(type, data, reqAck, timeout)) };
                })
                .do(message => self.sent.onNext(message));
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