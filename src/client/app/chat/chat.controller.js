(function () {
    'use strict';

    angular
        .module('app.chat')
        .controller('ChatController', ChatController);

    /* @ngInject */
    function ChatController($rootScope, $q, logger, socketservice, CHAT_NAMESPACE) {

        let chatSocket,
            vm = this;
        vm.message = '';
        vm.output = '';
        vm.sendMessage = sendMessage;

        initialize();

        function initialize() {
            chatSocket = socketservice.getObservableSocket(CHAT_NAMESPACE);

            chatSocket.getContent()
                .do(x => console.log(`Recieved ${x.type} with ${x.detail}`))
                .subscribe(data => handleReceivedMessage(data.detail));

            chatSocket.getStatus()
                .subscribe(status => console.log(JSON.stringify(status, null, 4)));

            logger.info('ChatController Initialized');
        }

        /*
         * Exported Function
         */

        function sendMessage() {
            console.log(`trying to send ${vm.message}`);
            chatSocket.send('message', vm.message);

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
