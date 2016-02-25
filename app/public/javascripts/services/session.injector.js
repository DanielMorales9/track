angular
    .module('app')
    .factory('SessionInjector', ['$q', '$location', '$localStorage',
        function($q, $location, $localStorage) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    var token = $localStorage.get('token');
                    if (token) {
                        config.headers['x-session-token'] = 'Session ' + token;
                    }
                    return config;
                },
                'responseError': function(response) {
                    if(response.status === 401 || response.status === 403) {
                        $location.path('/login');
                    }
                    return $q.reject(response);
                }
            };
        }]);