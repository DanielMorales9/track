angular
    .module('app')
    .controller('ErrorController', function ($scope, ErrorService) {
        var ctrl = this;
        
        var _handleError = function () {
            var data = ErrorService.getError();
            ctrl.message = data.message;
            ctrl.status = data.status;
        }

        _handleError();
    });