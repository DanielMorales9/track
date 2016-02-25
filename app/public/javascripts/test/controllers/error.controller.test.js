describe('ErrorController', function () {

    var ctrl;
    var $rootScope;
    var $location;


    beforeEach(module('app'));

    beforeEach(inject(function($controller, _$rootScope_, _$location_, ErrorService) {
        $rootScope = _$rootScope_;
        scope = _$rootScope_.$new();

        $location = _$location_;
        $rootScope.$emit('$locationChangeStartOFF');

        ErrorService.wrapError({
            status: 500,
            data: {
                message: 'Internal Error'
            }
        });
        ctrl = $controller('ErrorController',{
            $scope: scope
        });
    }));

    it('should get Error', function () {
        $location.path('error');
        expect(ctrl.status).toBe(500);
        expect(ctrl.message).toBe('Internal Error');
    });

});