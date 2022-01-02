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
	- v3.1.0:
		- created
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20211102
Tests ...
*/

import { ZERO } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A simple container with data shared between a dialog or a float window and the drag event listeners
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class DragData {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.seal ( this );
	}

	/**
	The X screen coordinate of the mouse when dragging
	@type {Number}
	*/

	dragStartX = ZERO;

	/** The Y screen coordinate of the mouse when dragging
	@type {Number}
	*/

	dragStartY = ZERO;

	/**
	The X screen coordinate of the upper left corner of the dialog before drag operations
	@type {Number}
	*/

	dialogX = ZERO;

	/**
	The Y screen coordinate of the upper left corner of the dialog before drag operations
	@type {Number}
	*/

	dialogY = ZERO;
}

export default DragData;

/* --- End of file --------------------------------------------------------------------------------------------------------- */