module.exports = function(grunt) {

    grunt.initConfig({
        jshint: {
            files: ['gruntfile.js', paths.from.scripts ],
            options: {
                globals: {
                    jquery: true
                }
            }
        },

        watch: {
            scripts: {
                files: [paths.from.scripts, paths.from.templates, paths.from.styles],
                tasks: ['jshint', 'jade', 'concat', 'uglify'],
                options: {
                    spawn: false
                }
            }
        },

        jade: {
            html: {
                files: {
                    './public/views/': [paths.from.templates]
                },
                options: {
                    client: false
                }
            }
        },

        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: paths.from.scripts, /*['./development/scripts/1_angular_app.js', './development/scripts/adminCtrl.js', './development/scripts/panelCtrl.js'],*/
                dest: paths.to.scripts
            }
        },

        uglify: {
            options: {
                compress: {
                    drop_console: true
                }
            },
            my_target: {
                files: {
                    './public/scripts/app.min.js': ['./public/scripts/app.js']
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jade');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['jade', 'jshint', 'concat', 'uglify']);
};

var paths = {
    from: {scripts: './development/scripts/*.js', templates: './development/templates/*.jade', styles: './development/styles/*.css', images: './development/images/*.*'},
    to: {scripts: './public/scripts/app.js', templates: './public/views/', styles: './public/styles/', images: './public/images/'}
};
