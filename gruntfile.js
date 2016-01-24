module.exports = function(grunt) {

    grunt.initConfig({
        jshint: {
            files: ['gruntfile.js', paths.from.scripts],
            options: {
                globals: {
                    jquery: true
                }
            }
        },

        watch: {
            scripts: {
                files: [paths.from.scripts],
                tasks: ['jshint', 'concat', 'uglify'],
                options: {
                    spawn: false
                }
            },
            templates: {
                files: [paths.from.templates],
                tasks: ['jshint', 'jade'],
                options: {
                    spawn: false
                }
            },
            styles: {
                files: [paths.from.styles],
                tasks: ['jshint','cssmin'],
                options: {
                    spawn: false
                    }
            },
            modules: {
                files: [paths.from.modules],
                tasks: ['jshint', 'uglify'],
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
            //options: {
            //    compress: {
            //        drop_console: true
            //    }
            //},
            my_target: {
                files: {
                    './public/scripts/angular_app.min.js': ['./public/scripts/app.js'],
                    './public/scripts/myFunctions.min.js': ['./development/modules/myFunctions.js']
                }
            }
        },

        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: './development/styles/',
                    src: '*.css',
                    dest: paths.to.styles,
                    ext: '.min.css'
                }]
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jade');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['jade', 'jshint', 'concat', 'uglify']);
};

var paths = {
    from: {scripts: './development/scripts/*.js', templates: './development/templates/*.jade', styles: './development/styles/*.css', images: './development/images/*.*', modules: './development/modules/*.js'},
    to: {scripts: './public/scripts/angular_app.js', templates: './public/views/', styles: './public/stylesheets/', images: './public/images/'}
};
