var filter = require('gulp-filter')

module.exports = function() {
    var client = './src/client/';
    var server = './src/server/';
    var clientApp = client + 'app/';
    var report = './report/';
    var root = './';
    var index = client + 'index.html'
    var specRunnerFile = 'specs.html';
    var dest = './.dist/';
    var wiredep = require('wiredep');
    var bowerFiles = wiredep({devDependencies: true})['js'];
    var bower = {
        json: require('./bower.json'),
        directory: './bower_components/',
        source: './bower_components/**/*.js',
        style: './bower_components/**/*.css',
        ignorePath: '../..'
    };
    var nodeModules = 'node_modules';

    var config = {
      // Client source
      client: client,
      index: index,
      icon: client + "favicon.ico",
      source: [
            clientApp + '**/*.module.ts',
            clientApp + '**/*.module.js',
            clientApp + '**/*.ts',
            clientApp + '**/*.js',
            '!' + clientApp + '**/*.spec.ts',
            '!' + clientApp + '**/*.spec.js'
        ],
 
      // Html
      html: clientApp + '**/*.html',
      templateCache: {
            file: 'templates.js',
            options: {
                module: 'app.core',
                root: '/app/',
                standAlone: false
            }
      },
      styles: client + "/styles/**/*.less",
      assets: client + "/assets/**/*.*",
 
      // Filters
      filter: {
          ts: filter('**/*.ts', { restore: true }),
          js: filter('**/*.js', { restore: true }),
          less: filter('**/*.less', { restore: true}),
          css: filter('**/*.css', { restore: true})
      },
      
      // Test
      specHelpers: [client + 'test-helpers/*.js'],
      specs: [clientApp + '**/*.spec.js'],
  
      // Vendor sources
      fonts: bower.directory + 'font-awesome/fonts/**/*.*',
      bower: bower,
      packages: [
        './package.json',
        './bower.json'
      ],
      
      // Destination
      dest: dest,
      
      // Server
      server: server,
    }
    
    config.wiredep = getWiredepOptions;
    
    config.karma = getKarmaOptions();
    
    return config;
    
    ////////////////

    function getWiredepOptions() {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        return options;
    };
    
     function getKarmaOptions() {
        var options = {
            files: [].concat(
                bowerFiles,
                config.specHelpers,
                clientApp + '**/*.module.js',
                clientApp + '**/*.js',
                dest + 'js/' + config.templateCache.file
            ),
            exclude: [],
            coverage: {
                dir: report + 'coverage',
                reporters: [
                    // reporters not supporting the `file` property
                    {type: 'html', subdir: 'report-html'},
                    {type: 'lcov', subdir: 'report-lcov'},
                    {type: 'text-summary'} //, subdir: '.', file: 'text-summary.txt'}
                ]
            },
            preprocessors: {}
        };
        options.preprocessors[clientApp + '**/!(*.spec)+(.js)'] = ['coverage'];
        
        return options;
    }
};
