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
                'info': '='
            },
            templateUrl: '/app/widgets/ht-hotel.html',
            restrict: 'E',
            controllerAs: 'hotel',
            bindToController: true,
            controller: function() {
            }
        };
        return directive;
    }
})();
