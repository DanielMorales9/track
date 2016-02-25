angular.module('app')

    .factory('ErrorService', function () {
        var service = {};

        service.data = {};

        var _wrapError = function(response) {
            service.data.message = response.data.message;
            if (response.status >= 400)
                service.data.status = response.status;

        };

        var _getError = function() {
            return service.data;
        }

        service.wrapError = _wrapError;

        service.getError =  _getError;

        return service;
    });
