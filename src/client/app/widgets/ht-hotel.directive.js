(function() {
    'use strict';

    angular
        .module('app.widgets')
        .directive('htHotel', htHotel);

    /* @ngInject */
    function htHotel() {
        //Usage:
        //<div ht-hotel hotels="vm.hotel"></div>
        // Creates:
        // A hotel box
        var directive = {
            scope: {
                'title': '@',
                'hotels': '='
            },
            templateUrl: '/app/widgets/ht-hotel.html',
            restrict: 'E',
            controllerAs: 'hotels',
            bindToController: true,
            controller: function() {
            }
        };
        return directive;
    }
})();
