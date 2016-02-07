(function () {
    'use strict';

    angular
        .module('app.chat')
        .controller('ChatController', ChatController);

    /* @ngInject */
    function ChatController($rootScope, $q, logger, Rx, socketservice, CHAT_NAMESPACE) {

        let chatSocket,
            messagesOut,
            messagesOutStatus,
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

            messagesOut = new Rx.Subject();
            messagesOutStatus = chatSocket.addInput(messagesOut, 'message');

            messagesOutStatus.subscribe(
                message => {
                    console.log(`Observing ${message.data} for status of send`);
                    message.status.subscribe(
                        statusUpdate => console.log(`Got status of ${statusUpdate.state} from message ${message.data}`),
                        err => { },
                        () => console.log(`Got complete for message ${message.data}`)
                        )
                }
                );

            logger.info('ChatController Initialized');
        }

        /*
         * Exported Function
         */

        function sendMessage() {
            console.log(`trying to send ${vm.message}`);
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
