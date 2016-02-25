describe('SessionInjector', function () {

    var token = 'xxx';
    var $httpBackend;
    var $http;
    var $location;
    var $localStorage;

    beforeEach(module('app'));

    beforeEach(inject(function($injector) {

        var _$rootScope_ = $injector.get('$rootScope');
        _$rootScope_.$emit('$locationChangeStartOFF');
        $httpBackend = $injector.get('$httpBackend');
        $http = $injector.get('$http');
        $localStorage = $injector.get('$localStorage');
        $location = $injector.get('$location');
    }));

    it('should inject authentication  header', function () {
        $localStorage.set('token', token);
        $http({
            method: 'GET',
            url: '/me'
        });
        $httpBackend
            .when('GET','/me')
            .respond(200);
        $httpBackend.expectGET('/me', function(header) {
            return header['x-session-token'] == 'Session xxx';
        });
        $httpBackend.flush();
        $localStorage.delete('token');
    });

    it('should change path when forbidden is returned', function () {
        $http({
            method: 'GET',
            url: '/me'
        });
        $httpBackend
            .when('GET','/me')
            .respond(401);
        $httpBackend.expectGET('/me',
            function(header) {
                return header['x-session-token'] !== 'Session xxx';
            });
        $httpBackend.flush();
        expect($location.path()).toBe('/login');
    });

    it('should change path when una is returned', function () {
        $http({
            method: 'GET',
            url: '/me'
        });
        $httpBackend
            .when('GET','/me')
            .respond(401);
        $httpBackend.expectGET('/me',
            function(header) {
                return header['x-session-token'] !== 'Session xxx';
            });
        $httpBackend.flush();
        expect($location.path()).toBe('/login');
    });

});