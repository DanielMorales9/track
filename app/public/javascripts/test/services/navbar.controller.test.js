describe('NavbarController', function () {

    var ctrl, nh;
    var scope;

    beforeEach(module('app'));

    beforeEach(inject(function ($controller, _$rootScope_, $injector) {
        scope = _$rootScope_.$new();
        nh = $injector.get('NotificationHelper');
        ctrl = $controller('NavbarController', {$scope : scope});
    }));

    it('should login', function () {
        nh.notifyAuthentication({});
        expect(scope.isLoggedIn).toBe(true);
    });

    it('should be logout', function () {
        nh.notifyLogout();
        expect(scope.isLoggedIn).toBe(false);
    });

    it('should logout', function () {
        scope.logout();
        expect(scope.isLoggedIn).toBe(false);
    });

});