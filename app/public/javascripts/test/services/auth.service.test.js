describe('AuthenticationService', function () {

    var service;
    var mockData;
    var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
        '.eyJlbWFpbCI6ImRubG1ybHM5QGdtYWlsLmNvbSIsImZpcnN0TmFtZS' +
        'I6IkRhbmllbCIsImxhc3ROYW1lIjoiTW9yYWxlcyJ9.xndfr-qYSf9k' +
        'rWDScUc_KfI1S2bC3tv5L6cY6bUo43o';
    var $localStorage;
    var $window;

    beforeEach(module('app'));

    beforeEach(inject(function($injector, _$httpBackend_, _$window_) {
        $window =_$window_;
        mockData = {
            user: {
                email: 'dnlmrls9@gmail.com',
                firstName: 'Daniel',
                lastName: 'Morales'
            },
            token: 'xxx'
        };
        $injector.get('$rootScope').$emit('$locationChangeStartOFF');
        $httpBackend = _$httpBackend_;
        $localStorage = $injector.get('$localStorage');
        service = $injector.get('AuthenticationService');
    }));


    it('should login', function () {
        var data = {
            email: 'dnlmrls9@gmail.com',
            password: 's3cret'
        };
        $httpBackend.expectPOST('/auth/login', data).respond(mockData);

        var doesNothing = function(param){
            return param;
        };

        service.authenticate(data, doesNothing, doesNothing);
        $httpBackend.flush();
    });

    it('should register', function () {
        var data = {
            email: 'dnlmrls9@gmail.com',
            password: 's3cret',
            firstName: 'Daniel',
            lastName: 'Morales'
        };
        $httpBackend.expectPOST('/auth/register', data).respond(mockData);

        var doesNothing = function(param){
            return param;
        };

        service.register(data, doesNothing, doesNothing);
        $httpBackend.flush();
    });

    it('should set token', function () {
        service.setToken(token);
        expect($localStorage.get('token')).toEqual(token);
        service.logout();
    });

    it('should get current user', function () {
        service.setToken(token);
        var user = service.getCurrentUser();
        expect(user).toEqual(mockData.user);
        service.logout();
    });

    it('should logout', function () {
        service.setToken(token);
        service.logout();
        expect($localStorage.get('token')).toEqual(undefined);
        expect($localStorage.get('user')).toEqual(undefined);
        expect(service.getCurrentUser()).toEqual(undefined);
    });

    it('should verify', function() {
        service.setToken(token);
        service.verify();
        $httpBackend.expectGET('/verify', function (headers) {
            return headers['x-access-token'] === token;
        });
    })
});