(function() {
    'use strict';

    angular
        .module('app.hotels')
        .run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'hotels',
                config: {
                    url: '/',
                    templateUrl: '/app/hotels/hotels.html',
                    controller: 'HotelsController',
                    controllerAs: 'vm',
                    title: 'Hotel',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-bed"></i> Hotels'
                    }
                }
            }
        ];
    }
})();
