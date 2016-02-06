(function () {
    'use strict';

    angular
        .module('app.hotels')
        .factory('hotelService', hotelService);

    /* @ngInject */
    function hotelService(model, logger) {
        var service = {
            getHotelCategories: wrap(getHotelCategories),
            getHotelsForCategory: wrap(getHotelsForCategory),
            setUserRating: setUserRating
        };

        return service;

        function getHotelsForCategory(categoryIndex, hotelIndices) {
            return model.get(['categories', categoryIndex, 'hotels', hotelIndices, ['id', 'name', 'rating', 'cost', 'userRating']])
                .map(response => response.json.categories[categoryIndex].hotels);
        }

        function getHotelCategories(indexes) {
            return model.get(['categories', indexes, 'name'])
                .map(response => response.json.categories);
        }

        function setUserRating(hotelId, rating) {
            return model.setValue(['hotelsById', hotelId, 'userRating'], rating);
        }

        /*
         * Wrap the implementation to create a new persistant Observable
         * on top of the underlysing function to be executed when changes occur.
         */
        function wrap(func) {
            return function wrapper(...args) {
                return Rx.Observable.create((observer) => {
                    func(...args)
                        .subscribe((result) => observer.onNext(result));
                })
            }
        }
    }
})();
