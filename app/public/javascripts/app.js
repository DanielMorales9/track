var routeManager = function($routeProvider) {
    $routeProvider
        .when('/home', {
            controller: 'HomeController',
            templateUrl: 'contents/main.html',
            controllerAs: 'home'
        })
        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'contents/login.html',
            controllerAs: 'login'
        })
        .when('/register', {
            controller: 'RegistrationController',
            templateUrl: 'contents/register.html',
            controllerAs: 'register'
        })
        .when('/error',{
            controller: 'ErrorController',
            templateUrl: 'contents/error.html',
            controllerAs: 'error'
        }).otherwise({redirectTo: '/login'});
};

var config = function($routeProvider, $httpProvider) {
    routeManager($routeProvider);
    $httpProvider.interceptors.push('SessionInjector');
}

var run = function ($rootScope, $location, AuthenticationService, ErrorService) {
    var callMeToUnRegister = $rootScope.$on('$locationChangeStart', function() {
        AuthenticationService.verify(
            function(response) {
                if(!response.data.success) {
                    var restrictedPage = $.inArray($location.path(), ['/login', '/register', '/error']) === -1;
                    if (restrictedPage) {
                        $location.path('/login');
                    }
                }
            },
            function (response) {
                ErrorService.wrapError(response);
                $location.path('/error');
            });
    });

    $rootScope.$on('$locationChangeStartOFF', callMeToUnRegister);
}


angular
    .module('app', ['ngRoute'])
    .config(config).run(run);