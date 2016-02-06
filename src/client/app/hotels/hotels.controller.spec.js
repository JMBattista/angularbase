/* jshint -W117, -W030 */
describe('HotelsController', function() {
    var controller;
    var people = mockData.getMockPeople();
    var categories = mockData.getMockCategories();

    beforeEach(function() {
        bard.appModule('app.hotels');
        bard.inject('$controller', '$log', '$q', '$rootScope', 'hotelService', 'Rx');
    });

    beforeEach(function () {
        sinon.stub(hotelService, 'getHotelCategories').returns(Rx.Observable.fromArray([categories]));
        controller = $controller('HotelsController');
        $rootScope.$apply();
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('Hotels controller', function() {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('after activate', function() {
            it('should have title of Hotels', function () {
                expect(controller.title).to.equal('Hotels');
            });

            it('should have logged "Activated"', function() {
                expect($log.info.logs).to.match(/Activated/);
            });

            it('should have categories', function () {
                expect(controller.categories).to.not.be.empty;
            });

            it('should have at least 1 category', function () {
                expect(Object.keys(controller.categories)).to.have.length.above(0);
            });

            it('should have category count of 4', function () {
                expect(Object.keys(controller.categories)).to.have.length(4);
            });
        });
    });
});
