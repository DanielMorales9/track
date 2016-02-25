describe('HomeController', function () {

    var ctrl;
    var nh;
    var user= {
        email: 'dnlmrls9@gmail.com',
        firstName: 'Daniel',
        lastName: 'Morales',
    }

    beforeEach(module('app'));

    beforeEach(inject(function($controller, _$rootScope_, _$injector_) {
        nh = _$injector_.get('NotificationHelper');
        scope = _$rootScope_.$new();
        ctrl = $controller('HomeController', {
            $scope : scope
        });
    }));

    it('should get user from event', function () {
        nh.notifyAuthentication(user);
        expect(scope.user).toEqual(user);
    });

    it('should user from event', function () {
        nh.notifyLogout();
        expect(scope.user).toBe(undefined);
    });

})