module.exports = function() {
    var client = './src/client/';
    var server = './src/server/';
    var clientApp = client + 'app/';
    var report = './report/';
    var root = './';
    var specRunnerFile = 'specs.html';
    var dest = './.dist/';
    var wiredep = require('wiredep');
    var bowerFiles = wiredep({devDependencies: true})['js'];
    var bower = {
        json: require('./bower.json'),
        directory: './bower_components/',
        ignorePath: '../..'
    };
    var nodeModules = 'node_modules';

    var config = {
      // Client source
      client: client,
      clientApp: clientApp,
      source: [clientApp + "**/*.module.js", "!"+clientApp + "**/*.spec.js", clientApp + "**/*.js"],
      styles: client + "/styles/**/*.less",
      assets: client + "/assets/**/*.*",
      
      // Test
      specs: clientApp + "**/*.spec.js",
      
      // Destination
      dest: dest,
      
      // Server
      server: server,
    }
    
    return config;
};
