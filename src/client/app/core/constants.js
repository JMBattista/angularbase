/* global toastr:false, moment:false, falcor:false, io:false */
(function() {
    'use strict';

    angular
        .module('app.core')
        .constant('falcor', falcor)
        .constant('io', io)
        .constant('moment', moment)
        .constant('toastr', toastr);
})();
