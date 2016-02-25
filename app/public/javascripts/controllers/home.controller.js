angular
    .module('app')
    .controller('HomeController', function ($scope, AuthenticationService) {

        function main() {
            $scope.user = AuthenticationService.getCurrentUser();
        }

        main();

        $scope.$on('user-auth-event', function(event, data) {
            $scope.user = data;
        });

        $scope.$on('user-logout-event', function() {
            $scope.user = undefined;
        });
    });