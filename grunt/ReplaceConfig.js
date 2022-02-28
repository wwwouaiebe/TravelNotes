/*
Copyright - 2017 2022 - wwwouaiebe - Contact: https://www.ouaie.be/

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

// eslint-disable-next-line no-undef
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

/* --- End of file --------------------------------------------------------------------------------------------------------- */