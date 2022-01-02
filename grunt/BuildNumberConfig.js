/* eslint-disable no-magic-numbers */
// eslint-disable-next-line no-undef
module.exports = {
	options : {
		file : 'buildNumber.json'
	},
	start : {
		action : 'read',
		values : [
			{
				name : 'build',
				initialValue : 0,
				transform : ( value, grunt ) => {
					console.error ( '-'.repeat ( 128 ) );
					console.error (
						'\n' +
                        grunt.config.data.pkg.name + ' - ' +
                        grunt.config.data.pkg.version + ' - build: ' +
                        String ( value ).padStart ( 5, '0' ) + ' - ' +
                        grunt.template.today ( 'isoDateTime' ) +
                        ' start\n'
					);
					console.error ( '-'.repeat ( 128 ) );
					return String ( value ).padStart ( 5, '0' );
				}
			}
		]
	},
	end : {
		action : 'write',
		values : [
			{
				name : 'build',
				initialValue : 0,
				transform : ( value, grunt ) => {
					console.error ( '-'.repeat ( 128 ) );
					console.error (
						'\n' +
                        grunt.config.data.pkg.name + ' - ' +
                        grunt.config.data.pkg.version + ' - build: ' +
                        grunt.config.data.build + ' - ' +
                        grunt.template.today ( 'isoDateTime' ) +
                        ' done\n'
					);
					console.error ( '-'.repeat ( 128 ) );
					return value + 1;
				}
			}
		]
	}
};