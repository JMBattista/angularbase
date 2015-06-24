(function () {
    'use strict';
    angular.module('templates', []);
    angular.module('app', [
        'templates',
        'app.core',
        'app.widgets',
        'app.admin',
        'app.dashboard',
        'app.layout'
    ]);
})();
