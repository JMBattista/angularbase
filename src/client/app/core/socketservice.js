(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('socketservice', socketservice);

    /* @ngInject */
    function socketservice($q, logger, io, CHAT_NAMESPACE) {

        var service = {
            getObservableSocket: getObservableSocket,
            getChatSocketId: getChatSocketId,
            send: send,
            listen: listen,
            unlisten: unlisten
        };

        var sockets = [];

        initialize();

        // Move return back to here once ObservableSocket is defined in a different file
        // return service;

        function initialize() {
            sockets[CHAT_NAMESPACE] = new ObservableSocket(CHAT_NAMESPACE, ['message']);
            logger.info('Socket Service Initialized');
        }

        /*
         * Observable Socket
         */

        function ObservableSocket(namespace, contentTypes) {
            let self = this
            this.socket = createInternal(namespace);

            this.contentObservable = Rx.Observable.fromArray(contentTypes)
                .map(type => Rx.Observable.fromEventPattern(
                    function add(h) { listenInternal(self.socket, type, h); },
                    function remove(h) { unlistenInternal(self.socket, type, h); },
                    function select(detail) { return { type: type, detail: detail } })
                    )
                .mergeAll();

            let statusEvents = ['connect', 'error', 'disconnect', 'reconnect', 'reconnect_attempt', 'reconnect_error', 'reconnect_failed'];
            this.statusObservable = Rx.Observable.fromArray(statusEvents)
                .map(type => Rx.Observable.fromEventPattern(
                    function add(h) { listenInternal(self.socket, type, h); },
                    function remove(h) { unlistenInternal(self.socket, type, h); },
                    function select(detail) { return { type: type, detail: detail } })
                    )
                .mergeAll();
        }

        /*
         * Retrieves an observable for the content received on the socket
         */
        ObservableSocket.prototype.getContent = function getContent() {
            return this.contentObservable;
        }

        ObservableSocket.prototype.getStatus = function getStatus() {
            return this.statusObservable;
        }

        ObservableSocket.prototype.send = function sendTemp(type, data, reqAck = true, timeout = 0) {
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
         * Exported Functions
         */

        function getObservableSocket(namespace) {
            return getSocketById(namespace);
        }

        function getChatSocketId() {
            return CHAT_SOCKET;
        }

        /**
         * Sends a socket message to the server
         * @param {string} socketId the unique identifier of the socket
         * @param {string} type the message type
         * @param {string} data the data to send
         * @param {boolean} reqAck whether to wait for acknowledgment from the server
         * @param {number} timeout how long to wait (in ms) before rejecting  (0 means never)
         * @return If acknowledgment required, resolves with any acknowledge data.  Rejected on error.
         *         If acknowledgment not required, resolves with ''. Rejected on error.
         */
        function send(socketId, type, data, reqAck = true, timeout = 0) {
            var deferred = $q.defer();
            var resolved = false;

            try {
                var socket = getSocketById(socketId);

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

        /**
         * Listens for a type of message on the socket
         * @param {string} socketId the unique identifier of the socket
         * @param {string} type the message type
         * @param {Function} func the callback (expects the message data as the first parameter)
         * @return If successful, resolves with true.  Otherwise, rejected.
         */
        function listen(socketId, type, func) {
            var deferred = $q.defer();

            try {
                var socket = getSocketById(socketId);
                listenInternal(socket, type, func);
                deferred.resolve(true);
            }
            catch (error) {
                logger.error('Socket listen error: ' + error);
                deferred.reject(error);
            }

            return deferred.promise;
        }

        /**
         * Stops listening for a type of message on the socket
         * @param {string} socketId the unique identifier of the socket
         * @param {string} type the the message type
         * @param {Function} func the previous registered callback
         * @return If successful, resolves with true.  Otherwise, rejected.
         */
        function unlisten(socketId, type, func) {
            var deferred = $q.defer();

            try {
                var socket = getSocketById(socketId);
                unlistenInternal(socket, type, func);
                deferred.resolve(true);
            }
            catch (error) {
                logger.error('Socket unlisten error: ' + error);
                deferred.reject(error);
            }

            return deferred.promise;
        }

        /*
         * Websocket Library Wrapper Functions
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

        /*
         * Private functions
         */

        function getSocketById(socketId) {
            if (socketId in sockets) {
                return sockets[socketId];
            }
            else {
                throw Error('Invalid Socket');
            }
        }

        return service;

    }

})();
