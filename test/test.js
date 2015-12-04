var assert = require('assert');
var superagent = require('superagent');
var server = require('../server');

describe('/user', function() {
    var app;

    before(function() {
        app = server(3000);
    });

    after(function() {
        app.close();
    });

    it('returns username if name param is a valid user', function(done) {
        superagent.get('http://localhost:3000').end(function(err, res) {
            assert.ifError(err);
            var result = JSON.parse(res.text);
            assert.deepEqual({ user: 'test' }, result);
            done();
        });
    });

    //it('returns 404 if user named `params.name` not found', function(done) {
    //    superagent.get('http://localhost:3000/user/notfound').end(function(err, res) {
    //        assert.ifError(err);
    //        var result = JSON.parse(res.text);
    //        assert.deepEqual({ error: 'Not Found' }, result);
    //        done();
    //    });
    //});
});