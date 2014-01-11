'use strict';


module.exports = function (grunt) {

    grunt.initConfig({
        jshint: {
            files: ['controllers/**/*.js', 'lib/**/*.js', 'models/**/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        requirejs: {
            build: {
                options: {
                    baseUrl: 'public/js',
                    mainConfigFile: 'public/js/config.js',
                    dir: '.build/js',
                    optimize: 'uglify',
                    modules: [{name: 'app'}]
                }
            }
        },
        compass: {
          options: {
            require: 'susy',
            bundleExec: true,
            sassDir: 'public/sass',
            cssDir: 'public/css',
            imagesDir: 'public/img',
            javascriptsDir: 'public/js',
            relativeAssets: false,
            httpImagesPath: 'public/img',
            httpGeneratedImagesPath: 'public/img/generated',
            environment: 'production'
          },
          dist: {
            options: {
              generatedImagesDir: 'public/img/generated'
            }
          },
          server: {
            options: {
              debugInfo: false,
              generatedImagesDir: 'public/img/generated'
            }
          }
        },
        autoprefixer: {
          options: {
            browsers: ['last 2 versions']
          },
          dist: {
            files: [{
              expand: true,
              cwd: '<%= yeoman.dist %>/css',
              src: '**/*.css',
              dest: '<%= yeoman.dist %>/css'
            }]
          },
          server: {
            files: [{
              expand: true,
              cwd: 'public/css',
              src: '**/*.css',
              dest: 'public/css'
            }]
          }
        },
        makara: {
            files: ['public/templates/**/*.dust'],
            options: {
                contentPath: ['locales/**/*.properties']
            }
        },
        dustjs: {
            build: {
                files: [
                    {
                        expand: true,
                        cwd: 'tmp/',
                        src: '**/*.dust',
                        dest: '.build/templates',
                        ext: '.js'
                    }
                ],
                options: {
                    fullname: function (filepath) {
                        var path = require('path'),
                            name = path.basename(filepath, '.dust'),
                            parts = filepath.split(path.sep),
                            fullname = parts.slice(3, -1).concat(name);

                        return fullname.join(path.sep);
                    }
                }
            }
        },
        copyto: {
            build: {
                files: [
                    { cwd: 'public', src: ['**/*'], dest: '.build/' }
                ],
                options: {
                    ignore: [
                        'public/css/**/*',
                        'public/js/**/*',
                        'public/templates/**/*'
                    ]
                }
            }
        },
        clean: {
            'tmp': 'tmp',
            'build': '.build/templates'
        },
        mochacli: {
            src: ['test/*.js'],
            options: {
                globals: ['chai'],
                timeout: 6000,
                ignoreLeaks: false,
                ui: 'bdd',
                reporter: 'spec'
            }
        }
    });

    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-cli');
    grunt.loadNpmTasks('grunt-dustjs');
    grunt.loadNpmTasks('grunt-copy-to');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadTasks('./node_modules/makara/tasks/');

    grunt.registerTask('i18n', ['clean', 'makara', 'dustjs', 'clean:tmp']);
    grunt.registerTask('build', ['jshint', 'requirejs', 'copyto', 'i18n']);
    grunt.registerTask('test', ['jshint', 'mochacli']);

};
