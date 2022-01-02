
// replace config

module.exports = {

	// release mode

	release : {
		src : [ 'tmpRelease/src/**/*.js' ],
		overwrite : true,
		replacements : [

			// # are replaced with _private_ so the code can be executed by old browsers
			{
				from : '#',
				to : '_private_'
			},

			// Object.freeze in the constructors is removed
			{
				from : 'Object.freeze ( this );',
				to : '/* Object.freeze ( this ); */'
			},

			// and Object.seal in the constructors is removed
			{
				from : 'Object.seal ( this );',
				to : '/* Object.seal ( this ); */'
			}
		]
	}
};