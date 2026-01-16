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

import { ZERO, ONE } from '../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A simple class used to detect if the device have a touch screen
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class Device {

	/**
	 * The type of the pointer device used ( mouse or touch )
	 * @type {String}
	 */

	static #pointerType = '';

	/**
	 * Set the type of device used
	 * @param {Event} event
	 */

	setPointerType ( event ) {
		if ( ! event.isPrimary ) {
			return;
		}
		Device.#pointerType = event.pointerType ? event.pointerType : '';
	}

	/**
	A pointerenter event listener on the document
	@param {Event} event The event to manage
	*/

	static #pointerEnterEL ( event ) {
		Device.#pointerType = event.pointerType;
		document.removeEventListener ( 'pointerenter', Device.#pointerEnterEL, true );
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		Device.#pointerType = '';
		document.addEventListener ( 'pointerenter', Device.#pointerEnterEL, true );
	}

	/**
	 * The type of the pointer device used ( mouse or touch )
	 * @type {String}
	 */

	get pointerType ( ) { return Device.#pointerType; };

	/**
	get the width and height avaiable for menus and dialogs
	@type {Object} a read only object with width and height properties
	*/

	get screenAvailable ( ) {

		const testHTMLElement = document.createElement ( 'div' );
		testHTMLElement.style.position = 'absolute';
		testHTMLElement.style.bottom = ZERO;
		testHTMLElement.style.right = ZERO;
		testHTMLElement.style.height = ONE;
		testHTMLElement.style.width = ONE;
		document.body.appendChild ( testHTMLElement );
		const boundingClientRect = testHTMLElement.getBoundingClientRect ( );
		const screenAvailableHeight = boundingClientRect.bottom;
		const screenAvailableWidth = boundingClientRect.right;
		document.body.removeChild ( testHTMLElement );

		return Object.freeze (
			{
				height : screenAvailableHeight,
				width : screenAvailableWidth
			}
		);
	}
}

/**
The one and only one instance of Device class
*/

const theDevice = new Device ( );

export default theDevice;

/* --- End of file --------------------------------------------------------------------------------------------------------- */