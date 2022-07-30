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

/*
Changes:
	- v4.0.0:
		- created
Doc reviewed ...
Tests ...
*/
/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A simple container with data shared between a dialog or a float window and the touch event listeners
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

import { ZERO } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A simple container with data shared between a dialog or a float window and the touch event listeners
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TouchData {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.seal ( this );
	}

	/**
	The X screen coordinate of the touchstart event
	@type {Number}
	*/

	touchStartX = ZERO;

	/**
    The Y screen coordinate of touchstart event
	@type {Number}
	*/

	touchStartY = ZERO;

	/**
	The X screen coordinate of the upper left corner of the dialog before touch operations
	@type {Number}
	*/

	dialogX = ZERO;

	/**
	The Y screen coordinate of the upper left corner of the dialog before touch operations
	@type {Number}
	*/

	dialogY = ZERO;

	/**
    Reset the TouchData object to it's initial state
    */

	reset ( ) {
		this.touchStartX = ZERO;
		this.touchStartY = ZERO;
	}
}

export default TouchData;

/* --- End of file --------------------------------------------------------------------------------------------------------- */