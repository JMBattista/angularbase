(function () {
    'use strict';

    angular
        .module('app.chat')
        .controller('ChatController', ChatController);

    /* @ngInject */
    function ChatController($rootScope, $q, logger, Rx, socketservice, CHAT_NAMESPACE) {

        let chatSocket,
            messagesOut,
            vm = this;
        vm.message = '';
        vm.output = '';
        vm.sendMessage = sendMessage;

        initialize();

        function initialize() {
            chatSocket = socketservice.getObservableSocket(CHAT_NAMESPACE);

            chatSocket.received
                .do(x => console.log(`Recieved ${x.type} with ${x.data}`))
                .subscribe(data => handleReceivedMessage(data.data));

            chatSocket.status
                .subscribe(status => console.log(JSON.stringify(status, null, 4)));

            chatSocket.sent.subscribe(
                message => {
                    console.log(`Sending '${message.data}'`);
                    message.status.subscribe(
                        ackData => console.log(`Got acknowledgment of ${ackData} for message '${message.data}'`),
                        err => console.log(`Got error for message '${message.data}'`),
                        () => console.log(`Got complete for message '${message.data}'`)
                        )
                }
                );

            messagesOut = new Rx.Subject();
            chatSocket.watchAndSend(messagesOut, 'message');

            logger.info('ChatController Initialized');
        }

        /*
         * Exported Function
         */

        function sendMessage() {
            console.log(`Trying to send ${vm.message}`);
            messagesOut.onNext(vm.message);
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
