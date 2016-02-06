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
    function controller($element, hotelService) {
        let vm = this;
        vm.list = [];
        let observer = hotelService.getHotelsForCategory(vm.category, {from: 0, to: 3})
            .subscribe(hotels => {
                console.log('updated hotels', hotels);
                vm.list = hotels;
            });

        // The inner directives haven't been compiled yet. We need to wait until the current op is done.
        setTimeout(hookUpOwl, 0);

        function hookUpOwl() {
            /*jshint -W117 */
            $($element).find('.owl-carousel').owlCarousel({
                items: 12,
                itemsCustom: [[2500, 11], [2300, 10], [2100, 9], [1900, 8],
                    [1700, 7], [1500, 6], [1300, 5], [1100, 4],
                    [1000, 3], [600, 2]],
                itemsTablet: [600, 2],
                itemsMobile: false
            });
        }
    }
})();
