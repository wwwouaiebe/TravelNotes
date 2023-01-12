/*
Copyright - 2017 2023 - wwwouaiebe - Contact: https://www.ouaie.be/

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
/*
Changes:
	- v4.0.0:
		- created from v3.6.0
Doc reviewed 202208
 */

import theConfig from '../../../data/Config.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
mouseenter event listener for the notes bullet
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class NoteBulletMouseEnterEL {

	/**
	Event listener method
	@param {Event} mouseEnterEvent The event to handle
	*/

	static handleEvent ( mouseEnterEvent ) {
		mouseEnterEvent.originalEvent.target.style.opacity = theConfig.note.grip.moveOpacity;
	}
}

export default NoteBulletMouseEnterEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */