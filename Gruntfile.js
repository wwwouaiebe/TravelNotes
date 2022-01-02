/*
Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/

This  program is free software;
you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation;
either version 3 of the License, or any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

/* eslint-disable no-magic-numbers */
/* eslint-disable no-undef */

module.exports = function ( grunt ) {

	// grunt config

	grunt.initConfig ( {
		pkg : grunt.file.readJSON ( 'package.json' ),
		eslint : require ( './grunt/EslintConfig.js' ),
		replace : require ( './grunt/ReplaceConfig.js' ),
		rollup : require ( './grunt/RollupConfig.js' ),
		essimpledoc : require ( './grunt/EssimpledocConfig.js' ),
		stylelint : require ( './grunt/StylelintConfig.js' ),
		cssmin : require ( './grunt/CssminConfig.js' ),
		terser : require ( './grunt/TerserConfig.js' ),
		copy : require ( './grunt/CopyConfig.js' ),
		clean : require ( './grunt/CleanConfig.js' ),
		buildnumber : require ( './grunt/BuildNumberConfig.js' )
	} );

	// Load tasks

	grunt.loadNpmTasks ( 'grunt-buildnumber' );
	grunt.loadNpmTasks ( 'grunt-eslint' );
	grunt.loadNpmTasks ( 'grunt-text-replace' );
	grunt.loadNpmTasks ( 'grunt-rollup' );
	grunt.loadNpmTasks ( 'grunt-stylelint' );
	grunt.loadNpmTasks ( 'grunt-contrib-cssmin' );
	grunt.loadNpmTasks ( 'grunt-terser' );
	grunt.loadNpmTasks ( 'grunt-contrib-copy' );
	grunt.loadNpmTasks ( 'grunt-contrib-clean' );
	grunt.loadNpmTasks ( 'grunt-essimpledoc' );

	// Register tasks

	grunt.registerTask (
		'default',
		[ 'eslint' ]
	);
	grunt.registerTask (
		'doc',
		[ 'essimpledoc:doc' ]
	);
	grunt.registerTask (
		'doclaunch',
		[ 'essimpledoc:doclaunch' ]
	);
	grunt.registerTask (
		'debug',
		[
			'buildnumber:start',
			'eslint',
			'stylelint',
			'clean:beforeDebug',
			'rollup:debug',
			'cssmin:debug',
			'copy:debug',
			'clean:afterDebug',
			'buildnumber:end'

			/* , 'essimpledoc:debug' */

		]
	);
	grunt.registerTask (
		'release',
		[
			'buildnumber:start',
			'eslint',
			'stylelint',
			'clean:beforeDebug',
			'rollup:debug',
			'cssmin:debug',
			'copy:debug',
			'clean:afterDebug',
			'clean:beforeRelease',
			'copy:beforeRelease',
			'replace:release',
			'rollup:release',
			'terser',
			'cssmin:release',
			'copy:release',
			'clean:afterRelease',
			'essimpledoc:release',
			'buildnumber:end'
		]
	);
};

// end of file