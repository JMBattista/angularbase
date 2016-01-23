(function() {
    'use strict';

    angular
        .module('app.hotel')
        .run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'hotel',
                config: {
                    url: '/',
                    templateUrl: '/app/hotel/hotel.html',
                    controller: 'HotelController',
                    controllerAs: 'vm',
                    title: 'Hotel',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-bed"></i> Hotel'
                    }
                }
            }
        ];
    }
})();
