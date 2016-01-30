(function () {
    'use strict';

    angular
        .module('app.hotels')
        .controller('HotelsController', HotelsController);

    /* @ngInject */
    function HotelsController($q, hotelService, logger) {
        var vm = this;
        vm.messageCount = 0;
        vm.people = [];
        vm.title = 'Hotels';
        vm.categories = [];

        activate();

        function activate() {
            var promises = [
                getHotelCategories({from: 0, to:3}),
                getHotelsForCategory(0),
                getHotelsForCategory(1),
                getHotelsForCategory(2),
                getHotelsForCategory(3)
            ];

            return $q.all(promises).then(function() {
                logger.info('Activated Hotels View');
            });
        }

        function getHotelCategories(indices) {
            return hotelService.getHotelCategories(indices)
                .then(categories => {
                    vm.categories = categories
                    return vm.categories
                });
        }

        function getHotelsForCategory(index) {
            return hotelService.getHotelsForCategory(index, {from: 0, to: 3})
                .then(hotels => {
                    vm.categories[index].hotels = hotels;
                    return vm.categories;
                });
        }
    }
})();
