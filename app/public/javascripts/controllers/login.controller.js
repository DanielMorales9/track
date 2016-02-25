angular
    .module('app')
    .controller('LoginController', function ($scope, $location, AuthenticationService, ErrorService) {
        var ctrl = this;

        this.user = {};

        this.submitted = false;

        var _successCallback = function(response) {
            if(response.data.success) {
                ctrl.user = response.data.user;
                var token = response.data.token;
                ctrl.submitted = true;

                $location.path('/home');
                AuthenticationService.setToken(token);
            }
            else {
                console.log(response.data.message);
                switch (response.data.message) {
                    case "Incorrect email/password":
                        ctrl.errorMessage = response.data.message;
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

        var _login = function () {
            AuthenticationService.authenticate(ctrl.user, _successCallback, _errorCallback);
        }

        this.login = _login;
    });