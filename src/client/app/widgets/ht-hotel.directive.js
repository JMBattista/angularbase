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
            controller: controller
        };
        return directive;
    }

    /* @ngInject */
    function controller($scope, hotelService) {
        let vm = this;
        $scope.$watch(
            () => vm.info.userRating,
            (newVal, oldVal) => {
                // Truthy values ok here since 0/null/nan all show as 0 stars.
                if (newVal != oldVal) {
                    hotelService.setUserRating(vm.info.id, newVal)
                }
            }
        );
    }
})();
