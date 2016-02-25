describe('$localStorage', function () {

    var service;
    var $window;

    beforeEach(module('app'));

    beforeEach(inject(function($injector, _$window_) {
        service = $injector.get('$localStorage');
        $window = _$window_;
    }));



    it('should set value', function () {
        service.set('token', 'xxx')
        expect($window.localStorage['token']).toEqual('xxx');
        delete $window.localStorage['token'];
    });

    it('should get value', function () {
        $window.localStorage['token'] = 'xxx';

        expect(service.get('token', 'abc')).toEqual('xxx');
        delete $window.localStorage['token'];
    });

    it('should get default value', function () {
        expect(service.get('token', 'abc')).toEqual('abc');
    });

    it('should set object', function () {
        var user = {
            email: 'mail@gmail.it',
            password: 's3cret'
        };
        service.setObject('user', user);
        expect(JSON.parse($window.localStorage['user'])).toEqual(user);
    });

    it('should get object', function () {
        var user = {
            email: 'mail@gmail.it',
            password: 's3cret'
        };
        $window.localStorage['user'] = JSON.stringify(user);
        expect(service.getObject('user')).toEqual(user);
    });

    it('should delete', function () {
        $window.localStorage['token'] = 'xxx';
        service.delete('token')
        expect(service.get('token', 'abc')).toEqual('abc');
    });
})