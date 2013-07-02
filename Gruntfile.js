'use strict';

module.exports = function(grunt) {

	// load all grunt tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		config: grunt.file.readJSON('config.json'),
		compass: {
			options: {
				cssDir: 'build/www/css',
				sassDir: 'sass'
			},
			dev: {
				options: {
					outputStyle: 'expanded',
					debugInfo: true
				}
			},
			prod: {
				options: {
					outputStyle: 'compressed'
				}
			}
		},
		connect: {
			dev: {
				options: {
					port: 7000,
					middleware: function(connect, options) {
						return [
							// serve files in /dist as if they were in the root.
							connect.static(__dirname + '/build/www'),
							// but serve everything else from the root
							connect.static(__dirname)
						];
					}
				}
			},
			prod: {
				options: {
					base: 'build/www',
					keepalive: true,
				}
			}
		},
		watch: {
			options: {
				livereload: '<%= config.livereload %>' || 35729
			},
			css: {
				files: ['sass/**/*.scss'],
				tasks: ['compass:dev']
			},
			contents: {
				files: ['contents/**/*.{json,md}'],
				tasks: ['import_contents']
			},
			templates: {
				files: ['templates/**/*.{hbs,html}'],
				tasks: ['handlebars_html:dev']
			}
		},
		handlebars_html: {
			options : {
				partialDir : 'templates/partials',
				helperDir : 'templates/helpers'
			},
			dev: {
				src: 'templates/*.hbs',
				dest: 'build/www',
				data: 'build/data.json',
			},
			prod: '<%= handlebars_html.dev %>'
		},
		import_contents: {
			options : {
				baseDir: 'contents',
				config : 'config.json',
				markdown: {
					breaks: true,
					smartLists: true,
					smartypants: true,
					langPrefix: 'language-'
				}
			},
			all: {
				src: 'contents/**/*.{json,md}',
				dest: 'build/data.json'
			}
		},
		'gh-pages': {
			src: [
				'build/www/**/*'
			]
		}
	});

	// load local tasks
	grunt.loadTasks('tasks');

	grunt.registerTask('dev', [
		'import_contents',
		'handlebars_html:dev',
		'compass:dev',
		'connect:dev',
		'watch'
	]);

	grunt.registerTask('build', [
		'import_contents',
		'handlebars_html:prod',
		'compass:prod'
	]);

	grunt.registerTask('deploy', 'Deploy site via gh-pages.', [
		'build',
		'gh-pages'
	])

	grunt.registerTask('prod', [

	]);

	grunt.registerTask('default', ['dev']);
}