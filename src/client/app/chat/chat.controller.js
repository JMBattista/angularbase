(function () {
    'use strict';

    angular
        .module('app.chat')
        .controller('ChatController', ChatController);

    /* @ngInject */
    function ChatController($rootScope, $q, logger, socketservice) {

        var chatSocketId,
            vm = this;
        vm.message = '';
        vm.output = '';
        vm.sendMessage = sendMessage;

        initialize();

        function initialize() {
            chatSocketId = socketservice.getChatSocketId();
            socketservice.listen(chatSocketId, 'message', handleReceivedMessage);
            logger.info('ChatController Initialized');
        }

        /*
         * Exported Function
         */

        function sendMessage() {
            socketservice.send(chatSocketId, 'message', vm.message)
                .then(function (ackData) {

                })
                .catch(function (error) {

                });

            addChatMessage(vm.message);
            vm.message = '';
        }

        /*
         * Private Functions
         */
        
        function handleReceivedMessage(data) {
            $rootScope.$apply(function () {
                addChatMessage(data);
            });
        }

        function addChatMessage(message) {
            vm.output += ' ' + message;
        }

    }
})();
