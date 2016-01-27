/* jshint -W117, -W030 */
describe('socketservice', function () {
    var service;
    var emitSpy, onSpy, removeListenerSpy;

    beforeEach(function () {
        bard.appModule('app.core');
        bard.inject('$log', '$q', '$rootScope', 'io');
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('with working server connection', function () {

        beforeEach(function () {
            emitSpy = sinon.spy(function (type, data, ack) {
                if (typeof (ack) === 'function')
                    ack('ack');
            });
            onSpy = sinon.spy();
            removeListenerSpy = sinon.spy();

            sinon.stub(io, 'connect').returns({
                emit: emitSpy,
                on: onSpy,
                removeListener: removeListenerSpy
            });
        });

        beforeEach(function () {
            bard.inject('socketservice');
            service = socketservice;
        });

        afterEach(function () {
            io.connect.restore();
        });

        it('should be created successfully', function () {
            expect(service).to.be.defined;
        });

        it('should provide a chat socket id', function () {
            expect(service.getChatSocketId()).to.be.defined;
        });

        describe('using valid socket id', function () {

            let socketId;

            beforeEach(function () {
                socketId = service.getChatSocketId();
            });

            it('should send successfully', function (done) {
                service.send(socketId, 'message', 'test message')
                    .then(function (data) {
                        expect(data).to.equal('ack');
                        expect(emitSpy.calledOnce).to.be.true;
                        done();
                    })
                    .catch(function (err) { done(err); });
                $rootScope.$apply();
            });

            it('should send successfully without acknowledgement', function (done) {
                service.send(socketId, 'message', 'test message', false)
                    .then(function (data) {
                        expect(data).to.equal('');
                        expect(emitSpy.calledOnce).to.be.true;
                        done();
                    })
                    .catch(function (err) { done(err); });
                $rootScope.$apply();
            });

            it('should add a listener', function (done) {
                onSpy.reset();
                service.listen(socketId, 'message', function () { })
                    .then(function (data) {
                        expect(data).to.be.true;
                        expect(onSpy.calledOnce).to.be.true;
                        done();
                    })
                    .catch(function (err) { done(err); });
                $rootScope.$apply();
            });

            it('should remove a listener', function (done) {
                service.unlisten(socketId, 'message', function () { })
                    .then(function (data) {
                        expect(data).to.be.true;
                        expect(removeListenerSpy.calledOnce).to.be.true;
                        done();
                    })
                    .catch(function (err) { done(err); });
                $rootScope.$apply();
            });
        });

        describe('using invalid socket id', function () {

            let socketId;

            beforeEach(function () {
                socketId = 'not a socket id';
            });

            it('should fail to send', function (done) {
                service.send(socketId, 'message', 'test message')
                    .then(function (data) { done('send did not fail'); })
                    .catch(function (err) { done(); });
                $rootScope.$apply();
            });

            it('should fail to send without acknowledgement', function (done) {
                service.send(socketId, 'message', 'test message', false)
                    .then(function (data) { done('send did not fail'); })
                    .catch(function (err) { done(); });
                $rootScope.$apply();
            });

            it('should fail to add a listener', function (done) {
                service.listen(socketId, 'message', function () { })
                    .then(function (data) { done('send did not fail'); })
                    .catch(function (err) { done(); });
                $rootScope.$apply();
            });

            it('should fail to remove a listener', function (done) {
                service.unlisten(socketId, 'message', function () { })
                    .then(function (data) { done('send did not fail'); })
                    .catch(function (err) { done(); });
                $rootScope.$apply();
            });
        });

    });

    describe('with failing server connection', function () {

        beforeEach(function () {
            emitSpy = sinon.spy();
            onSpy = sinon.spy();
            removeListenerSpy = sinon.spy();

            sinon.stub(io, 'connect').returns({
                emit: emitSpy,
                on: onSpy,
                removeListener: removeListenerSpy
            });
        });

        beforeEach(function () {
            bard.inject('socketservice');
            service = socketservice;
        });

        afterEach(function () {
            io.connect.restore();
        });

        describe('using valid socket id', function () {

            let socketId;

            beforeEach(function () {
                socketId = service.getChatSocketId();
            });

            it('send should timeout waiting for acknowledgement', function (done) {
                service.send(socketId, 'message', 'test message', true, 100)
                    .then(function (data) { done('send did not timeout'); })
                    .catch(function (err) { done(); });

                setTimeout($rootScope.$apply, 200);
            });

            it('should send successfully without acknowledgement', function (done) {
                service.send(socketId, 'message', 'test message', false)
                    .then(function (data) {
                        expect(data).to.equal('');
                        expect(emitSpy.calledOnce).to.be.true;
                        done();
                    })
                    .catch(function (err) { done(err); });
                $rootScope.$apply();
            });
        });
    });
});
