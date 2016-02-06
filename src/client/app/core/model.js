(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('model', modelFactory);

    /* @ngInject */
    function modelFactory($rootScope, falcor, logger) {

        const model = new falcor.Model({
            source: new falcor.HttpDataSource('/model.json'),
            comparator: comparator,
            onChange: onChange
        })
        .batch();

        return model;

        function comparator(oldVal, newVal) {
            return oldVal !== newVal;
        }

        function onChange() {
            $rootScope.$emit('falcorChange');
        }
    }
})();
