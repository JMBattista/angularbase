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
                'list': '=hotels'
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
    function controller($element) {
        var vm = this;
        $($element).find('.owl-carousel').owlCarousel();
    }
})();
