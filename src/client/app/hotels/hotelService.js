(function () {
    'use strict';

    angular
        .module('app.hotels')
        .factory('hotelService', hotelService);

    const observers = [];

    /* @ngInject */
    function hotelService($rootScope, model, logger) {
        var service = {
            getHotelCategories: getHotelCategories,
            getHotelsForCategory: wrap(getHotelsForCategory),
            setUserRating: setUserRating
        };

        $rootScope.$on('falcorChange', () => {
            observers.forEach((func) => func());
        });

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
            return model.setValue(['hotelsById', hotelId, 'userRating'], rating)
                .subscribe();
        }

        /*
         * Wrap the implementation to create a new persistant Observable
         * on top of the underlysing function to be executed when changes occur.
         */
        function wrap(func) {
            return function wrapper(...args) {
                let observable = Rx.Observable.create((observer) => {
                    observers.push(() => func(...args).subscribe((result) => observer.onNext(result)));
                    observers[observers.length-1]();
                });

                return observable;
            }
        }
    }
})();
