(function () {
    'use strict';

    angular
        .module('app.hotels')
        .controller('HotelsController', HotelsController);

    /* @ngInject */
    function HotelsController($q, dataservice, logger) {
        var vm = this;
        vm.messageCount = 0;
        vm.people = [];
        vm.list = [];
        vm.title = 'Hotels';

        activate();

        function activate() {

            var promises = [getHotelCategories(), getHotels()];
            return $q.all(promises).then(function() {
                logger.info('Activated Hotels View');
            });
        }

        function getHotelCategories() {
            dataservice.getHotelCategories({from: 0, to:3})
                .then(categories => vm.categories = categories);
        }

        function getHotels() {
            dataservice.getHotels(['A', 'B', 'C'])
                .then(hotels => vm.list = hotels);
        }
    }
})();
