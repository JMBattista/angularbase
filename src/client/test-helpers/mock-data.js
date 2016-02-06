/* jshint -W079 */
var mockData = (function() {
    return {
        getMockPeople: getMockPeople,
        getMockStates: getMockStates,
        getMockNews: getMockNews,
        getMockCategories: getMockCategories,
        getMockHotels: getMockHotels
    };

    function getMockStates() {
        return [
            {
                state: 'dashboard',
                config: {
                    url: '/',
                    templateUrl: '/app/dashboard/dashboard.html',
                    title: 'dashboard',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Dashboard'
                    }
                }
            }
        ];
    }

    function getMockPeople() {
        return [
            {firstName: 'John', lastName: 'Papa', age: 25, location: 'Florida'},
            {firstName: 'Ward', lastName: 'Bell', age: 31, location: 'California'},
            {firstName: 'Colleen', lastName: 'Jones', age: 21, location: 'New York'},
            {firstName: 'Madelyn', lastName: 'Green', age: 18, location: 'North Dakota'},
            {firstName: 'Ella', lastName: 'Jobs', age: 18, location: 'South Dakota'},
            {firstName: 'Landon', lastName: 'Gates', age: 11, location: 'South Carolina'},
            {firstName: 'Haley', lastName: 'Guthrie', age: 35, location: 'Wyoming'}
        ];
    }

    function getMockNews() {
        return {
            title: 'News',
            description: 'This is news!'
        }
    }

    function getMockCategories() {
        return {
            "0": {
                name: "Popular"
            },
            "1": {
                name: 'Beach Front'
            },
            "2": {
                name: 'On Sale'
            },
            "3": {
                name: 'All Inclusive'
            }
        }
    }

    function getMockHotels() {
        return {
                "A": {
                    "id": "A",
                    "name": "Hotel A",
                    "cost": "$$",
                    "rating": 4,
                    "userRating": null,
                    "categories": ["Popular", "Beach Front", "On Sale", "All Inclusive"]
                },
                "B": {
                    "id": "B",
                    "name": "Hotel B",
                    "cost": "$$",
                    "rating": 4,
                    "userRating": null,
                    "categories": ["Popular", "All Inclusive"]
                },
                "C": {
                    "id": "C",
                    "name": "Hotel C",
                    "cost": "$$",
                    "rating": 4,
                    "userRating": null,
                    "categories": ["Popular", "On Sale"]
                },
                "D": {
                    "id": "D",
                    "name": "Hotel D",
                    "cost": "$$",
                    "rating": 4,
                    "userRating": null,
                    "categories": ["On Sale", "Beach Front"]
                },
                "E": {
                    "id": "E",
                    "name": "Hotel E",
                    "cost": "$$",
                    "rating": 4,
                    "userRating": null,
                    "categories": ["On Sale", "Beach Front"]
                },
        }
    }
})();
