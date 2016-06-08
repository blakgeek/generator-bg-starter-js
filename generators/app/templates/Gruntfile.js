module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        concurrent: {
            example: {
                tasks: ['serve', 'watch:dev', 'open:example'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        open: {
            example: {
                url: 'http://localhost:9099/example/index.html'
            }
        },
        copy: {
            dist: {
                expand: true,
                cwd: 'src',
                dest: 'dist',
                src: ['images/**/*']
            },
            dev: {
                expand: true,
                cwd: 'src',
                dest: 'dev',
                src: ['images/**/*']
            }
        },<% if(features.ng) { %>
        ngtemplates: {
            all: {
                options: {
                    module: '<%= ngModule %>',
                    prefix: '/',
                    htmlmin: {
                        collapseWhitespace: true,
                        keepClosingSlash: true
                    }
                },
                cwd: 'src',
                src: '**/*.html',
                dest: '.tmp/<%= appname %>.templates.js'
            }
        },
        <% } %>
        clean: {
            dist: ['.tmp', 'dist'],
            dev: ['.tmp', 'dev']
        },
        concat: {
            dist: {
                src: ['src/module.js', 'src/**/*.js', '.tmp/**/*.js'],
                dest: 'dist/<%= appname %>.js'
            },
            dev: {
                src: ['src/module.js', 'src/**/*.js', '.tmp/**/*.js'],
                dest: 'dev/<%= appname %>.js'
            }
        },
        uglify: {
            dist: {
                files: {
                    'dist/<%= appname %>.min.js': ['dist/<%= appname %>.js']
                }
            }
        },
        sass: {
            options: {
                style: 'compressed',
                sourcemap: 'none'
            },
            dist: {
                expand: true,
                cwd: 'src/sass',
                src: ['**/*.scss'],
                dest: 'dist',
                ext: '.css'
            },
            dev: {
                expand: true,
                cwd: 'src/sass',
                src: ['**/*.scss'],
                dest: 'dev',
                ext: '.css'
            }
        },
        watch: {
            dev: {
                files: ['src/**/*', 'example/**/*'],
                tasks: 'dev',
                options: {
                    livereload: false
                }
            }
        },
        serve: {
            options: {
                port: 9099
            }
        },
        bump: {
            options: {
                push: false,
                pushTo: 'origin',
                commitFiles: ['-a'],
                updateConfigs: ['pkg']
            }
        }
    });

    grunt.registerTask('build', [
        'clean:dist',
        'copy:dist',<% if(features.ng) { %>
        'ngtemplates',
        <% } %>
        'concat:dist',
        'uglify',
        'sass:dist'
    ]);

    grunt.registerTask('dev', [
        'clean:dev',
        'copy:dev',<% if(features.ng) { %>
        'ngtemplates',<% } %>
        'concat:dev',
        'sass:dev'
    ]);

    grunt.registerTask('example', [
        'clean:dev',
        'copy:dev',<% if(features.ng) { %>
        'ngtemplates',<% } %>
        'concat:dev',
        'sass:dev',
        'concurrent:example'
    ]);

    grunt.registerTask('release', function (type) {

        type = type ? ':' + type : '';

        grunt.task.run([
            'build',
            'bump' + type
        ])
    });
};



