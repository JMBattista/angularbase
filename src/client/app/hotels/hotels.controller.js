(function () {
    'use strict';

    angular
        .module('app.hotels')
        .controller('HotelsController', HotelsController);

    /* @ngInject */
    function HotelsController($q, dataservice, logger) {
        var vm = this;
        vm.messageCount = 0;
        vm.people = [];
        vm.list = [];
        vm.title = 'Hotels';

        activate();

        function activate() {
            var promises = [getMessageCount(), getPeople(), getNews(), getHotels()];
            return $q.all(promises).then(function() {
                logger.info('Activated Hotels View');
            });
        }

        function getMessageCount() {
            return dataservice.getMessageCount().then(function (data) {
                vm.messageCount = data;
                return vm.messageCount;
            });
        }

        function getPeople() {
            return dataservice.getPeople().then(function (data) {
                vm.people = data;
                return vm.people;
            });
        }

        function getHotels() {
            vm.list = [
                {
                    name: 'Hotel A',
                    cost: '$$',
                    rating: 4,
                    userRating: null
                },
                {
                    name: 'Hotel B',
                    cost: '$$',
                    rating: 4,
                    userRating: null
                },
                {
                    name: 'Hotel C',
                    cost: '$$',
                    rating: 4,
                    userRating: null
                },
                {
                    name: 'Hotel D',
                    cost: '$$',
                    rating: 4,
                    userRating: null
                },
                {
                    name: 'Hotel E',
                    cost: '$$',
                    rating: 4,
                    userRating: null
                },
                {
                    name: 'Hotel F',
                    cost: '$$',
                    rating: 4,
                    userRating: null
                },
                {
                    name: 'Hotel G',
                    cost: '$$',
                    rating: 4,
                    userRating: null
                },
                {
                    name: 'Hotel H',
                    cost: '$$',
                    rating: 4,
                    userRating: null
                },
                {
                    name: 'Hotel I',
                    cost: '$$',
                    rating: 4,
                    userRating: null
                },
                {
                    name: 'Hotel J',
                    cost: '$$',
                    rating: 4,
                    userRating: null
                },
                {
                    name: 'Hotel K',
                    cost: '$$',
                    rating: 4,
                    userRating: null
                },
                {
                    name: 'Hotel L',
                    cost: '$$',
                    rating: 4,
                    userRating: null
                },
                {
                    name: 'Hotel M',
                    cost: '$$',
                    rating: 4,
                    userRating: null
                },
                {
                    name: 'Hotel N',
                    cost: '$$',
                    rating: 4,
                    userRating: null
                },
            ];

            return $q.resolve();
        }

        function getNews() {
            return dataservice.getNews().then(function (data) {
                vm.news = data;
                return vm.news;
            });
        }
    }
})();
