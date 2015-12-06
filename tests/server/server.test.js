var proxyquire, expressStub, configStub, mongooseStub, app,
    server = function() {
        proxyquire('../../server', {
            'express': expressStub,
            './server/configure': configStub,
            'mongoose': mongooseStub
        });
    };

describe('Server', function() {
    beforeEach(function(){
        proxyquire = require('proxyquire'),
            app = {
                set: sinon.spy(),
                use: sinon.spy(),
                get: sinon.stub().returns(3000),
                post: sinon.stub().returns(3000),
                put: sinon.stub().returns(3000),
                delete: sinon.stub().returns(3000),
                listen: sinon.spy()
            },
            expressStub = sinon.stub().returns(app),
            configStub = sinon.stub().returns(app),
            mongooseStub = {
                connect: sinon.spy(),
                connection: {
                    on: sinon.spy()
                }
            };

        delete process.env.PORT;
    });

    describe('Setup', function(){
        it('should create the app', function(){
            server();
            expect(expressStub).to.be.called;
        });
        it('should set the views', function(){
            server();
            expect(app.set.secondCall.args[1]).to.equal('./views');
        });
        it('should set the view engine', function(){
            server();
            expect(app.set.thirdCall.args[1]).to.equal('ejs');
        });
        it('should connect with mongoose', function(){
            server();
            expect(mongooseStub.connect).to.be.calledWith(sinon.match.string);
        });
        it('should launch the app', function(){
            server();
            expect(app.get).to.be.calledWith('port');
        });
    });

    describe('Port', function(){
        it('should be set', function() {
            server();
            expect(app.set.firstCall.args[0]).to.equal('port');
        });
        it('should default to 3000', function() {
            server();
            expect(app.set.firstCall.args[1]).to.equal(3000, sinon.match.func);
        });
    });
});