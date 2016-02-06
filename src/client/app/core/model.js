(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('model', modelFactory);

    /* @ngInject */
    function modelFactory($rootScope, falcor, logger) {

        const model = new falcor.Model({
            source: new falcor.HttpDataSource('/model.json'),
            onChange: onChange
        })
        //     .batch();

        return model;

        function onChange() {
            $rootScope.$emit('falcorChange');
        }
    }
})();
