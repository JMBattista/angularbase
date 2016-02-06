(function() {
    'use strict';

    angular
        .module('app.widgets')
        .directive('htHotelsList', htHotelsList);

    /* @ngInject */
    function htHotelsList() {
        //Usage:
        //<ht-hotels-list title="Popular" hotels="vm.hotels"></ht-hotels-list>
        // Creates:
        // A list of hotels w/ the given titel
        var directive = {
            scope: {
                'title': '@',
                'category': '@'
            },
            templateUrl: '/app/widgets/ht-hotels-list.html',
            restrict: 'E',
            controllerAs: 'hotels',
            bindToController: true,
            controller: controller
        };
        return directive;
    }

    /* @ngIngject */
    function controller(hotelService) {
        let vm = this;
        vm.list = [];

        /*
         * We retrieve the first 10 hotels for the category
         * in a real application we'd want to use paging here to fetch more data
         */
        hotelService.getHotelsForCategory(vm.category, {from: 0, to: 10})
            .subscribe(hotels => vm.list = hotels);
    }
})();
