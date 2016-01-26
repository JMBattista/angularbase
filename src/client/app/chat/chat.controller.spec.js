/* jshint -W117, -W030 */
describe('ChatController', function() {
    var controller;

    beforeEach(function() {
        bard.appModule('app.chat');
        bard.inject('$controller', '$log', '$q', '$rootScope', 'socketservice');
    });

    beforeEach(function () {
        sinon.stub(socketservice, 'getChatSocketId').returns('chat_socket');
        controller = $controller('ChatController');
        $rootScope.$apply();
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('Chat controller', function() {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });
    });
});
