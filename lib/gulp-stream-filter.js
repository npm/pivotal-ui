const minimatch = require('minimatch');
const through = require('through2').obj;

module.exports = function(pattern) {
    const filter = minimatch.filter(pattern, {matchBase: true})
    return through(function (ent, _, done) {
        if (filter(ent.path)) this.push(ent);
        done();
    });
}
