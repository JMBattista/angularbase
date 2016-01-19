/* jshint -W117, -W030 */
var chai       = require('chai');
var expect     = chai.expect;
var sinon      = require('sinon');

chai.use(require('sinon-chai'));

describe('server app', function () {
    describe('sample test', function () {

        it('should succeed ', function() {
            expect(true).to.equal(true);
        });

        // Uncomment this test if you wish to see a test fail

        it('should fail', function () {
            expect(true).to.equal(false);
        });
    });
});
