angular
    .module('app')
    .factory('AuthenticationService', function($http, $localStorage, NotificationHelper) {
        /**
         * AuthenticationService variables
         */
        var service = {};
        var _baseURL = '/auth';
        service.currentUser = undefined;

        /**
         * Private Methods
         */
        var _urlBase64Decode = function(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output);
        };

        var _getUserFromToken = function() {
            var user = $localStorage.getObject('user');
            if (Object.keys(user).length == 0) {
                var token = $localStorage.get('token');

                if (typeof token !== 'undefined') {
                    var encoded = token.split('.')[1];
                    var base64 = _urlBase64Decode(encoded);
                    user = JSON.parse(base64);
                    $localStorage.setObject('user', user);
                }
                else {
                    user = undefined;
                }
            }
            return user;
        };

        var _setToken = function (token) {
            $localStorage.set('token', token);
            NotificationHelper.notifyAuthentication(_getCurrentUser());
        };

        var _getCurrentUser = function () {
            if(typeof service.currentUser === 'undefined') {
                service.currentUser = _getUserFromToken();
            }
            return service.currentUser;
        };

        var _authenticate = function (data, successCb, errorCb) {
            $http.post(_baseURL + '/login', data).then(successCb, errorCb);
        };

        var _register = function (data, successCb, errorCb) {
            $http.post(_baseURL + '/register', data).then(successCb, errorCb);
        };

        var _logout = function () {
            service.currentUser = undefined;
            $localStorage.delete('user');
            $localStorage.delete('token');
            NotificationHelper.notifyLogout();
        };
        
        var _verify = function (successCb, errorCb) {
            $http.get(_baseURL + '/verify').then(successCb, errorCb);
        };

        /**
         * Public Methods
         */
        service.getCurrentUser = _getCurrentUser;

        service.setToken = _setToken;

        service.authenticate = _authenticate;

        service.register = _register;

        service.logout = _logout;

        service.verify = _verify;

        return service;
    });