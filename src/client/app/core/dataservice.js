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
            getHotelsFromCategory: getHotelsFromCategory,
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

        function getHotelsFromCategory(categoryIndex, hotelIndexes) {
            let model = getModel();

            console.log('trying to get category list');

            return model.get(['hotelCategories', categoryIndex, 'hotels', hotelIndexes])
                .then(response => toArray(response.json.hotelCategories));
        }

        function getHotelCategories(indexes) {
            let model = getModel();

            // return model.get(['hotelCategories', indexes, 'name')
            return model.get(['hotelCategories', indexes, ['name','hotels'], indexes])
                .then(response => toArray(response.json.hotelCategories));
        }
    }

    function toArray(obj) {
        return Object.keys(obj)
            .map(key => obj[key]);
    }

    function getModel() {
        if (model == null)
            model = new falcor.Model({source: new falcor.HttpDataSource('/model.json')});

        return model;
    }
})();
