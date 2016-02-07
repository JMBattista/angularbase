(function() {
    'use strict';

    angular
        .module('blocks.socket')
        .constant('SOCKET_DEFAULTS', (function () {
            return {
                TIMEOUT_MS: 20000,
                REQUIRE_ACKNOWLEDGEMENT: true
            }
        })())
        .constant('SOCKET_STATUS', (function () {
            let CONNECT = 'connect',
                ERROR = 'error',
                DISCONNECT = 'disconnect',
                RECONNECT = 'reconnect',
                RECONNECT_ATTEMPT = 'reconnect_attempt',
                RECONNECT_ERROR = 'reconnect_error',
                RECONNECT_FAILED = 'reconnect_failed';

            return {
                CONNECT: CONNECT,
                ERROR: ERROR,
                DISCONNECT: DISCONNECT,
                RECONNECT: RECONNECT,
                RECONNECT_ATTEMPT: RECONNECT_ATTEMPT,
                RECONNECT_ERROR: RECONNECT_ERROR,
                RECONNECT_FAILED: RECONNECT_FAILED,
                ALL: [CONNECT, ERROR, DISCONNECT, RECONNECT, RECONNECT_ATTEMPT, RECONNECT_ERROR, RECONNECT_FAILED]
            }
        })())
})();
