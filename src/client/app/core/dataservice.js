(function () {
    'use strict';

    var model = null;

    angular
        .module('app.core')
        .factory('dataservice', dataservice);

    /* @ngInject */
    function dataservice($http, $q, falcor, logger) {
        var service = {
            getPeople: getPeople,
            getMessageCount: getMessageCount,
            getNews: getNews,
            getHotelCategories: getHotelCategories,
            getHotels: getHotels
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
            let model = getModel();

            return model.get('news')
                .then(response => ({
                    title: 'News',
                    description: response.json.news
                }));
        }

        function getHotelCategories(indexes) {
            let model = getModel();

            return model.get(['hotelCategories', indexes, 'name'])
                .then(response => return toArray(response.json.hotelCategories));
        }

        function getHotels(indexes) {
            let model = getModel();

            return model.get(['hotelsById', indexes, ['name', 'cost', 'userRating', 'rating']])
                .then(response => toArray(response.json.hotelsById));
        }
    }

    function toArray(obj) {
        Object.keys(obj)
            .map(key => obj[key]);
    }

    function getModel() {
        if (model == null)
            model = new falcor.Model({source: new falcor.HttpDataSource('/model.json')});

        return model;
    }
})();
