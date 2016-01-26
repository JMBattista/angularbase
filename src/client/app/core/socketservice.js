(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('socketservice', socketservice);

    /* @ngInject */
    function socketservice($q, logger, io) {

        var service = {
            getChatSocketId: getChatSocketId,
            send: send,
            listen: listen,
            unlisten: unlisten
        };

        const CHAT_SOCKET = 'chat_socket';
        var sockets = [];

        initialize();

        return service;

        function initialize() {
            sockets[CHAT_SOCKET] = createInternal('/chat');
            addServiceListeners(CHAT_SOCKET);
            logger.info('Socket Service Initialized');
        }

        /*
         * Exported Functions
         */

        function getChatSocketId() {
            return CHAT_SOCKET;
        }

        /**
         * Sends a socket message to the server
         * @param {string} socketId the unique identifier of the socket
         * @param {string} type the message type
         * @param {string} data the data to send
         * @param {boolean} reqAck whether to wait for acknowledgment from the server
         * @return If acknowledgment required, resolves with any acknowledge data.  Rejected on error.
         *         If acknowledgment not required, resolves with ''. Rejected on error.
         */
        function send(socketId, type, data, reqAck = true) {
            var deferred = $q.defer();

            try {
                var socket = getSocketById(socketId);

                if (reqAck)
                {
                    sendInternal(socket, type, data, function (ackData) {
                        console.log('resolving');
                        deferred.resolve(ackData);
                    });
                }
                else {
                    sendInternal(socket, type, data);
                    deferred.resolve('');
                }
            }
            catch (error) {
                logger.error('Socket send error: ' + error);
                deferred.reject(error);
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

        function addServiceListeners(socketId) {
            try {
                var socket = sockets[socketId];
                listenInternal(socket, 'connect', function () {
                    logger.info(socketId + ' connected');
                });
                listenInternal(socket, 'error', function (error) {
                    logger.error(socketId + ' error ' + error);
                });
                listenInternal(socket, 'disconnect', function () {
                    logger.warning(socketId + 'disconnected');
                });
                listenInternal(socket, 'reconnect', function (attempt) {
                    logger.info(socketId + ' reconnected after ' + attempt + ' attempts');
                });
                listenInternal(socket, 'reconnect_attempt', function (attempt) {
                    logger.info(socketId + ' attempting reconnection try ' + attempt);
                });
                listenInternal(socket, 'reconnect_error', function (error) {
                    logger.info(socketId + ' reconnection error ' + error);
                });
                listenInternal(socket, 'reconnect_failed', function () {
                    logger.info(socketId + ' reconnection failed');
                });
            }
            catch (error) {
                logger.error('addServiceListeners ' + error);
            }
        }

        function getSocketById(socketId) {
            if (socketId in sockets) {
                return sockets[socketId];
            }
            else {
                throw Error('Invalid Socket');
            }
        }

    }

})();
