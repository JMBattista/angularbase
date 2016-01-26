/* jshint -W117, -W030 */
describe('socketservice', function () {
    var service;
    var emitSpy, onSpy, removeListenerSpy;

    beforeEach(function () {
        bard.appModule('app.core');
        bard.inject('$log', '$q', 'io');
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('socketservice', function () {
        describe('with working server', function () {

            beforeEach(function () {
                emitSpy = sinon.spy(function (type, data, ack) {
                    if (typeof (ack) === 'function') {
                        console.log('acking');
                        ack('ack');
                    }
                    else
                        console.log('type is ' + typeof (ack));
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

            describe('using valid socket', function () {

                let socketId;

                beforeEach(function () {
                    socketId = service.getChatSocketId();
                });

                it('should fail', function () {
                    return $q.reject("error msg");
                });

                it('should pass', function () { return $q.resolve("pass"); })

                it('should pass with done', function (done) {
                    return $q.resolve("pass")
                        .then(function () { done(); });
                });            
                
                it ('should pass with chai with promises', function() {
                   return $q.resolve('pass').should.eventually.equal('pass'); 
                });

                    /* it('should send successfully with chai as promised', function () {
                         return service.send(socketId, 'message', 'test message').should.eventually.equal('ack');
                     });
     
                     it('should send successfully with done', function (done) {
                         return service.send(socketId, 'message', 'test message')
                             .then(function (x) { expect(x).to.equal('ack'); done(); })
                             .catch(function (x) { assert(false, 'error'); done(); });
                     });
     
                     it('should send successfully with no done', function () {
                            return service.send(socketId, 'message', 'test message')
                                .then(function (x) { expect(x).to.equal('ack'); })
                                .catch(function (x) { assert(false, 'error'); });
                     });*/
                });

            });
        });
    });
