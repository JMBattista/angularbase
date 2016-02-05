(function () {
    'use strict';

    angular
        .module('app.hotels')
        .factory('hotelService', hotelService);

    /* @ngInject */
    function hotelService(model, logger) {
        var service = {
            getHotelCategories: getHotelCategories,
            getHotelsForCategory: getHotelsForCategory,
            setUserRating: setUserRating
        };

        return service;

        function getHotelsForCategory(categoryIndex, hotelIndices) {
            return model.get(['categories', categoryIndex, 'hotels', hotelIndices, ['id', 'name', 'rating', 'cost', 'userRating']])
                .then(response => response.json.categories[categoryIndex].hotels);
        }

        function getHotelCategories(indexes) {
            return model.get(['categories', indexes, 'name'])
                .then(response => response.json.categories);
        }

        function setUserRating(hotelId, rating) {
            return model.setValue(['hotelsById', hotelId, 'userRating'], rating);
        }
    }
})();
