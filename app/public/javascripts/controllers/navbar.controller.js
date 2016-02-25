angular
    .module('app')
    .controller('NavbarController', function ($scope, AuthenticationService) {

        function initNavbar() {
            if(AuthenticationService.getCurrentUser())
                $scope.isLoggedIn = true;
            else
                $scope.isLoggedIn = false;
        }

        initNavbar();

        $scope.$on('user-auth-event', function() {
            $scope.isLoggedIn = true;
        });

        $scope.$on('user-logout-event', function() {
            $scope.isLoggedIn = false;
        });

        $scope.logout = function() {
            AuthenticationService.logout();
        };

    })
    .directive('navbarApp', function() {
        return {
            templateUrl: 'contents/navbar.html'
        };
    });