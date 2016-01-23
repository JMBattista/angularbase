/* jshint -W117, -W030 */
describe('hotel routes', function () {
    describe('state', function () {
        var controller;
        var view = '/app/hotel/hotel.html';

        beforeEach(function() {
            module('app.hotel', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache');
        });

        beforeEach(function() {
            $templateCache.put(view, '');
        });

        bard.verifyNoOutstandingHttpRequests();

        it('should map state hotel to url / ', function() {
            expect($state.href('hotel', {})).to.equal('/');
        });

        it('should map /hotel route to hotel View template', function () {
            expect($state.get('hotel').templateUrl).to.equal(view);
        });

        it('of hotel should work with $state.go', function () {
            $state.go('hotel');
            $rootScope.$apply();
            expect($state.is('hotel'));
        });
    });
});
