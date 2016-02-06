/* global toastr:false, moment:false, falcor:false, Rx:false */
(function() {
    'use strict';

    angular
        .module('app.core')
        .constant('falcor', falcor)
        .constant('moment', moment)
        .constant('toastr', toastr)
        .constant('Rx', Rx);
})();
