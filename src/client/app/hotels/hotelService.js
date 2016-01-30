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
        };

        return service;

        function getHotelsForCategory(categoryIndex, hotelIndices) {
            return model.get(['categories', categoryIndex, 'hotels', hotelIndices, ['name', 'rating', 'cost', 'userRating']])
                .then(response => response.json.categories[categoryIndex].hotels);
        }

        function getHotelCategories(indexes) {
            return model.get(['categories', indexes, 'name'])
                .then(response => response.json.categories);
        }
    }
})();
