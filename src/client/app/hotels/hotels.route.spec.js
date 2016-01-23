/* jshint -W117, -W030 */
describe('hotels routes', function () {
    describe('state', function () {
        var controller;
        var view = '/app/hotels/hotels.html';

        beforeEach(function() {
            module('app.hotels', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache');
        });

        beforeEach(function() {
            $templateCache.put(view, '');
        });

        bard.verifyNoOutstandingHttpRequests();

        it('should map state hotels to url / ', function() {
            expect($state.href('hotels', {})).to.equal('/');
        });

        it('should map /hotels route to hotels View template', function () {
            expect($state.get('hotels').templateUrl).to.equal(view);
        });

        it('of hotels should work with $state.go', function () {
            $state.go('hotels');
            $rootScope.$apply();
            expect($state.is('hotels'));
        });
    });
});
