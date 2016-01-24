(function() {
    'use strict';

    angular
        .module('app.widgets')
        .directive('htHotelList', htHotelList);

    /* @ngInject */
    function htHotelList() {
        //Usage:
        //<div ht-hotel-list title="Popular" hotels="vm.hotels"></div>
        // Creates:
        // A list of hotels w/ the given titel
        var directive = {
            scope: {
                'title': '@',
                'hotels': '='
            },
            templateUrl: '/app/widgets/ht-hotel-list.html',
            restrict: 'E',
            controllerAs: 'hotels',
            bindToController: true,
            controller: function() {
                this.foo = 'bar';
            }
        };
        return directive;
    }
})();
