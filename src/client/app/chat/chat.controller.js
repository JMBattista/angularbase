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

            chatSocket.content
                .do(x => console.log(`Recieved ${x.type} with ${x.data}`))
                .subscribe(data => handleReceivedMessage(data.data));

            chatSocket.status
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
