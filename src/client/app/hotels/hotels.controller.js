(function () {
    'use strict';

    angular
        .module('app.hotels')
        .controller('HotelsController', HotelsController);

    /* @ngInject */
    function HotelsController($q, hotelService, logger) {
        /*jshint validthis: true */
        var vm = this;
        vm.title = 'Hotels';
        vm.categories = [];

        activate();

        function activate() {
            var promises = [
                /*
                 * We get the first set of categories
                 * In a real application we would need to perform paging here
                 */
                getHotelCategories({from: 0, to:3}),
            ];

            return $q.all(promises).then(function() {
                logger.info('Activated Hotels View');
            });
        }

        function getHotelCategories(indices) {
            return hotelService.getHotelCategories(indices)
                .subscribe(categories => {
                    vm.categories = categories;
                    return vm.categories;
                });
        }
    }
})();
