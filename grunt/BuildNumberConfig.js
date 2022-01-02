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
				transform : value => String ( value ).padStart ( 5, '0' )
			}
		]
	},
	end : {
		action : 'write',
		values : [
			{
				name : 'build',
				initialValue : 0,
				transform : value => value + 1
			}
		]
	}
};

/* --- End of file --------------------------------------------------------------------------------------------------------- */