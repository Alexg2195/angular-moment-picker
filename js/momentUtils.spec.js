describe('momentUtils', function(){

    beforeEach(module('momentPicker'));

    var momentUtils;

    var momentPicker;

    var momentInput;

    beforeEach(inject(function(_momentUtils_){
        momentUtils = _momentUtils_;
    }));

    it('should create an utc moment', function(){
        var momentInstance = momentUtils.createMoment(null, false);
        expect(momentInstance.utcOffset()).toBe(0);
    });

    it('should create a local moment', function(){
        var momentInstance = momentUtils.createMoment(null, true);
        expect(momentInstance.utcOffset()).not.toBe(0);
    });

});