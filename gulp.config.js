var filter = require('gulp-filter')
var browserSync = require('browser-sync').create();

module.exports = function() {
    var client = './src/client/';
    var server = './src/server/';
    var clientApp = client + 'app/';
    var serverApp = server;
    var report = './report/';
    var reportClient = report + 'client/';
    var reportServer = report + 'server/';
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
      clientSource: [
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
      styles: [client + "/styles/**/*.css", client + "/styles/**/*.less"],
      icon: client + "/assets/favicon.ico",
      assets: [client + "/assets/**/*.*", '!' + client + "/assets/favicon.ico"],

      // Filters
      filter: {
          ts: function () { return filter('**/*.ts', { restore: true }) },
          js: function () { return filter('**/*.js', { restore: true }) },
          less: function() { return filter('**/*.less', { restore: true}) },
          css: function() { return filter('**/*.css', { restore: true}) }
      },

      // Client Test
      specHelpers: [client + 'test-helpers/*.js'],
      clientSpecs: [clientApp + '**/*.spec.js'],

      // Vendor sources
      fonts: [bower.directory + 'font-awesome/fonts/**/*.*', bower.directory + 'bootstrap/fonts/**/*.*'],
      bower: bower,
      packages: [
        './package.json',
        './bower.json'
      ],

      // Destination
      dest: dest,

      // Server
      server: server,
      serverSource: [
            serverApp + '**/*.ts',
            serverApp + '**/*.js',
            '!' + serverApp + '**/*.spec.ts',
            '!' + serverApp + '**/*.spec.js'
      ],

      // Server Tests
      serverSpecs: [serverApp + '**/*.spec.js'],

      // Browser Sync
      browserSync: browserSync
    }

    config.wiredep = getWiredepOptions;

    config.karma = getKarmaOptions();

    config.mocha = getMochaOptions();

    config.istanbul = getIstanbulOptions();

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
                './bower_components/falcor/dist/falcor.browser.js',
                './bower_components/socket.io-client/socket.io.js',
                config.specHelpers,
                clientApp + '**/*.module.js',
                clientApp + '**/*.js',
                dest + 'js/' + config.templateCache.file
            ),
            exclude: [],
            coverage: {
                dir: reportClient + 'coverage',
                reporters: [
                    // reporters not supporting the `file` property
                    {type: 'html', subdir: 'report-html'},
                    {type: 'lcov', subdir: 'report-lcov'},
                    {type: 'text-summary'} //, subdir: '.', file: 'text-summary.txt'}
                ]
            },
            preprocessors: {
                'src/**/*.js': ["babel"]
            }
        };
        options.preprocessors[clientApp + '**/!(*.spec)+(.js)'] = ['coverage'];

        return options;
    }

    function getMochaOptions() {
        var options = {
            reporter: 'progress',
            ui: 'bdd',
            require: ['chai', 'sinon', 'sinon-chai']
        };

        return options;
    }

    function getIstanbulOptions() {
        var options = {
            start: { includeUntested: true },
            report: {
                reporters: ['lcov', 'html', 'text-summary'],
                reportOpts: {
                    html: {dir: reportServer + 'coverage/report-html'},
                    lcov: {dir: reportServer + 'coverage/report-lcov'},
                }
            }
        };

        return options;
    }
};
