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
	debug : {
		options : {
			src : './src',
			dest : './docs/techDoc'
		}
	},
	doc : {
		options : {
			src : './src',
			dest : './docs/techDoc',
			validate : true
		}
	},
	doclaunch : {
		options : {
			src : './src',
			dest : './docs/techDoc',
			validate : true,
			launch : true
		}
	},
	release : {
		options : {
			src : './src',
			dest : './docs/techDoc',
			validate : true,
			launch : true
		}
	}
};

/* --- End of file --------------------------------------------------------------------------------------------------------- */