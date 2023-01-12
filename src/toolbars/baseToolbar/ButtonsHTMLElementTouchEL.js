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
Touch event listener for the buttons container
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ButtonsHTMLElementTouchEL {

	/**
	The Y position of the previous touch event
	@type {Number}
	*/

	#touchContainerStartY;

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#touchContainerStartY = Number.MAX_VALUE;
	}

	/**
	Event listener method
	@param {Event} touchEvent The event to handle
	*/

	handleEvent ( touchEvent ) {
		switch ( touchEvent.type ) {
		case 'touchstart' :
			if ( ONE === touchEvent.changedTouches.length ) {
				const touch = touchEvent.changedTouches.item ( ZERO );
				this.#touchContainerStartY = touch.screenY;
			}
			break;
		case 'touchmove' :
		case 'touchend' :
			if ( ONE === touchEvent.changedTouches.length ) {
				const touch = touchEvent.changedTouches.item ( ZERO );
				const deltaY = this.#touchContainerStartY - touch.screenY;
				touchEvent.currentTarget.scrollTop += deltaY;
				this.#touchContainerStartY = touch.screenY;
			}
			break;
		default :
			this.#touchContainerStartY = Number.MAX_VALUE;
			break;
		}
		if ( 'touchend' === touchEvent.type ) {
			this.#touchContainerStartY = Number.MAX_VALUE;
		}
	}
}

export default ButtonsHTMLElementTouchEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */