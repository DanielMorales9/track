angular
    .module('app')
    .factory('NotificationHelper', function ($rootScope) {
        var service = {};

        var _notifyAuthentication = function(user) {
            $rootScope.$broadcast('user-auth-event', user);

        };

        var _notifyLogout = function () {
            $rootScope.$broadcast('user-logout-event');
        };

        service.notifyAuthentication = _notifyAuthentication;

        service.notifyLogout = _notifyLogout;

        return service;

    });