module.exports = function(grunt) {
    "use strict";

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bumpup: 'package.json',
        tagrelease: 'package.json',
        jshint: {
            all: ["Gruntfile.js", "lib/simple.http.utilities.js", "test/simple.http.utilities.Unit.Tests.js"]
        },
        mochaTest: {
            test: {
                options: {
                    reporter: "tap"
                },
                src: ["test/**/*.js"]
            }
        },
        'gh-pages': {
            options: {
                base: 'docs'
            },
            src: ["**/*"]
        },
        jsduck: {
            main: {
                // source paths with your code
                src: [
                    "lib/simple.http.utilities.js"
                ],

                // docs output dir
                dest: "docs",

                // extra options
                options: {
                    categories: "jsduckCategories.json",
                    'warnings': ["-link","-no_doc","-link_ambiguous"]
                }
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-jsduck');
    grunt.loadNpmTasks('grunt-git-describe');
    grunt.loadNpmTasks('grunt-bumpup');
    grunt.loadNpmTasks('grunt-tagrelease');

    // Register task(s).
    grunt.registerTask('default', ['jshint','mochaTest','jsduck','gh-pages']);
    grunt.registerTask('travisCI', ['mochaTest']);
    grunt.registerTask('docs', ['jsduck','gh-pages']);
    grunt.registerTask('hint', ['jshint']);
    grunt.registerTask('test', ['mochaTest']);
    grunt.registerTask('ghPages', ['gh-pages']);
    grunt.registerTask('jsDuck', ['jsduck']);

    // Release alias task
    grunt.registerTask('bump', function (type) {
        type = type ? type : 'patch';
        grunt.task.run('bumpup:' + type); // Bump up the package version
        // still need to push the commit up
    });

    // Release alias task
    grunt.registerTask('release', function (type) {
        grunt.task.run('jshint');
        grunt.task.run('mochaTest');
        grunt.task.run('jsduck');
        grunt.task.run('gh-pages');
        grunt.task.run('tagrelease');
        // still need to push the commit up
    });

};
