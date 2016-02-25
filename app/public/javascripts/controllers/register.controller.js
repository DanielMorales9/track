angular
    .module('app')
    .controller('RegistrationController', function ($scope, $location, AuthenticationService, ErrorService) {
        var ctrl = this;

        ctrl.user = {};

        this.submitted = false;

        $scope.errorMessage = "";

        var _successCallback = function(response) {
            if(response.data.success) {
                ctrl.user = response.data.user;
                var token = response.data.token;
                ctrl.submitted = true;
                $location.path('/home');
                AuthenticationService.setToken(token);
            }
            else {
                switch (response.data.message) {
                    case "User already exists!":
                        ctrl.errorMessage = response.data.message + " Please Login."
                        break;
                    default:
                        ErrorService.wrapError(response);
                        $location.path('/error');
                        break;
                }
            }
        };

        var _errorCallback = function(response) {
            ErrorService.wrapError(response);
            $location.path('/error');
        };

        var _register = function () {
            AuthenticationService.register(ctrl.user, _successCallback, _errorCallback);
        };

        this.register = _register;
    });