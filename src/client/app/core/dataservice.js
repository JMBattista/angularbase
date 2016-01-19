(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('dataservice', dataservice);

    /* @ngInject */
    function dataservice($http, $q, falcor, logger) {
        var service = {
            getPeople: getPeople,
            getMessageCount: getMessageCount,
            getNews: getNews
        };

        return service;

        function getMessageCount() { return $q.when(72); }

        function getPeople() {
            return $http.get('/api/people')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                var msg = 'query for people failed. ' + error.data.description;
                logger.error(msg);
                return $q.reject(msg);
            }
        }

        function getNews() {
            var model = new falcor.Model({source: new falcor.HttpDataSource('/model.json')});

            return model.get('news')
                .then(response => ({
                    title: 'News',
                    description: response.json.news
                }));
        }
    }
})();
