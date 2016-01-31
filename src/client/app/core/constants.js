/* global toastr:false, moment:false, falcor:false, io:false, Rx:false */
(function() {
    'use strict';

    angular
        .module('app.core')
        .constant('falcor', falcor)
        .constant('io', io)
        .constant('moment', moment)
        .constant('Rx', Rx)
        .constant('toastr', toastr)
        .constant('CHAT_NAMESPACE', '/chat');
})();
