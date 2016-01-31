(function () {
    'use strict';

    angular
        .module('blocks.socket')
        .factory('socketservice', socketservice);

    /* @ngInject */
    function socketservice($q, logger, ObservableSocket, CHAT_NAMESPACE) {

        var service = {
            getObservableSocket: getObservableSocket,
        };

        var sockets = [];

        initialize();

        return service;

        function initialize() {
            sockets[CHAT_NAMESPACE] = new ObservableSocket(CHAT_NAMESPACE, ['message']);
            logger.info('Socket Service Initialized');
        }

        /*
         * Exported Functions
         */

        function getObservableSocket(namespace) {
            return getSocketById(namespace);
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

    }

})();
