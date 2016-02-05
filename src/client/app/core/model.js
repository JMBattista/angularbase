(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('model', dataservice);

    /* @ngInject */
    function dataservice(falcor, logger) {
        const $ref = falcor.Model.ref;
        const $atom = falcor.Model.atom;
        const $error = falcor.Model.error;

        // Comment out the remote model for now
        // const model = new falcor.Model({source: new falcor.HttpDataSource('/model.json')})
        //     .batch();
        const model = new falcor.Model({
            cache: {
                categories: getCategories(),
                hotelsById: getHotelsById(),
            }
        })


        return model;

        function getCategories() {
            let categories = [
                {
                    name: "Popular",
                },
                {
                    name: "Beach Front",
                },
                {
                    name: 'On Sale',
                },
                {
                    name: 'All Inclusive'
                }
            ]

            let hotels = getHotelsById();
            let hotelIds = Object.keys(hotels);

            categories.forEach(category => {
                category.hotels = hotelIds
                    .filter(id => hotels[id].categories.indexOf(category.name) != -1)
                    .map(id => $ref(['hotelsById', id]));
            })

            return categories;
        }

        function getHotelsById() {
            return {
                    'A': {
                        "id": "A",
                        "name": "Hotel A",
                        "cost": "$$",
                        "rating": 4,
                        "userRating": null,
                        "categories": ["Popular", "Beach Front", "On Sale", "All Inclusive"]
                    },
                    'B': {
                        "id": "B",
                        "name": "Hotel B",
                        "cost": "$$",
                        "rating": 4,
                        "userRating": null,
                        "categories": ["Popular", "All Inclusive"]
                    },
                    'C': {
                        "id": "C",
                        "name": "Hotel C",
                        "cost": "$$",
                        "rating": 4,
                        "userRating": null,
                        "categories": ["Popular", "On Sale"]
                    },
                    'D': {
                        "id": "D",
                        "name": "Hotel D",
                        "cost": "$$",
                        "rating": 4,
                        "userRating": null,
                        "categories": ["On Sale", "Beach Front"]
                    },
                    'E': {
                        "id": "E",
                        "name": "Hotel E",
                        "cost": "$$",
                        "rating": 4,
                        "userRating": null,
                        "categories": ["On Sale", "Beach Front"]
                    },
                    'F': {
                        "id": "F",
                        "name": "Hotel F",
                        "cost": "$$",
                        "rating": 4,
                        "userRating": null,
                        "categories": ["On Sale", "All Inclusive"]
                    },
                    'G': {
                        "id": "G",
                        "name": "Hotel G",
                        "cost": "$$",
                        "rating": 4,
                        "userRating": null,
                        "categories": ["Beach Front", "All Inclusive"]
                    },
                    'H': {
                        "id": "H",
                        "name": "Hotel H",
                        "cost": "$$",
                        "rating": 4,
                        "userRating": null,
                        "categories": ["Beach Front", "All Inclusive"]
                    },
                    'I': {
                        "id": "I",
                        "name": "Hotel I",
                        "cost": "$$",
                        "rating": 4,
                        "userRating": null,
                        "categories": ["Beach Front", "All Inclusive", "Popular"]
                    },
                    'J': {
                        "id": "J",
                        "name": "Hotel J",
                        "cost": "$$",
                        "rating": 4,
                        "userRating": null,
                        "categories": ["Beach Front", "All Inclusive"]
                    },
                    'K': {
                        "id": "K",
                        "name": "Hotel K",
                        "cost": "$$",
                        "rating": 4,
                        "userRating": null,
                        "categories": ["Beach Front", "All Inclusive", "Popular"]
                    },
                    'L': {
                        "id": "L",
                        "name": "Hotel L",
                        "cost": "$$",
                        "rating": 4,
                        "userRating": null,
                        "categories": ["Beach Front", "All Inclusive", "Popular"]
                    },
                    'M': {
                        "id": "M",
                        "name": "Hotel M",
                        "cost": "$$",
                        "rating": 4,
                        "userRating": null,
                        "categories": ["Beach Front", "On Sale", "Popular"]
                    },
                    'N': {
                        "id": "N",
                        "name": "Hotel N",
                        "cost": "$$",
                        "rating": 4,
                        "userRating": null,
                        "categories": ["Beach Front", "Popular"]
                    }
                }
        }
    }
})();
