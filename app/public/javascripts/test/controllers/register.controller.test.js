describe('RegistrationController', function () {

    var ctrl;
    var mockData;
    var $httpBackend;
    var $location;
    var scope;
    var service;

    beforeEach(module('app'));

    beforeEach(inject(function($controller, _$httpBackend_, _$location_, _$rootScope_, ErrorService) {
        mockData = {
            success: true,
            user: {
                email: 'dnlmrls9@gmail.com',
                firstName: 'Daniel',
                lastName: 'Morales',
            },
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
            '.eyJlbWFpbCI6ImRubG1ybHM5QGdtYWlsLmNvbSIsImZpcnN0TmFtZS' +
            'I6IkRhbmllbCIsImxhc3ROYW1lIjoiTW9yYWxlcyJ9.xndfr-qYSf9k' +
            'rWDScUc_KfI1S2bC3tv5L6cY6bUo43o'
        };
        _$rootScope_.$emit('$locationChangeStartOFF');
        $location = _$location_;
        $httpBackend = _$httpBackend_;
        scope = _$rootScope_.$new();
        service = ErrorService;
        ctrl = $controller('RegistrationController', {
            $scope: scope
        });
    }));

    it('should have submitted variable to false', function () {
        expect(ctrl.submitted).toBe(false);
    });

    it('should have user variable to empty', function () {
        expect(ctrl.user).toEqual({});
    });

    it('should set variables', function () {
        var _user = {
            email: 'dnlmrls9@gmail.com',
            password: 's3cret'
        };
        ctrl.user = _user;

        expect(ctrl.user).toEqual(_user);
    });

    it('should register', function () {
        var _user = {
            email: 'dnlmrls9@gmail.com',
            password: 's3cret',
            firstName: 'Daniel',
            lastName: 'Morales'
        };
        ctrl.user = _user;
        expect($location.path()).toBe('');
        expect(ctrl.user).toEqual(_user);
        $httpBackend
            .when('POST', '/auth/register')
            .respond(200, mockData);

        $httpBackend.expectPOST('/auth/register', _user);
        ctrl.register();
        $httpBackend.flush();
        var thatObj = {
            email: 'dnlmrls9@gmail.com',
            firstName: 'Daniel',
            lastName: 'Morales'
        };
        expect($location.path()).toBe('/home');
        expect(ctrl.user).toEqual(thatObj);
        expect(ctrl.user.token).toEqual(undefined);
    });

    it('should redirect to error page', function () {
        var _user = {
            email: 'dnlmrls9@gmail.com',
            password: 's3cret',
            firstName: 'Daniel',
            lastName: 'Morales'
        };

        ctrl.user = _user;
        expect($location.path()).toBe('');
        $httpBackend
            .when('POST', '/auth/register')
            .respond(500, {
                message: 'something get wrong'
            });
        $httpBackend.expectPOST('/auth/register', _user);
        ctrl.register();
        $httpBackend.flush();
        expect(service.getError()).toEqual({
            status: 500,
            message: 'something get wrong'
        });

        expect($location.path()).toBe('/error');
    });
})