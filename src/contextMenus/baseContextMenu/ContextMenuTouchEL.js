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
Touch event listener for the context menus
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ContextMenuTouchEL {

	/**
	The X position of the pointer of the previous event
	@type {?Number}
	*/

	#clientX = null;

	/**
	The Y position of the pointer of the previous event
	@type {?Number}
	*/

	#clientY = null;

	/**
	The minimal difference on the Y position between two events
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #MIN_DELTA_CLIENT_Y ( ) { return 100; }

	/**
	The maximal difference on the X position between two events
	@type {Number}
	*/
	// eslint-disable-next-line no-magic-numbers
	static get #MAX_DELTA_CLIENT_X ( ) { return 30; }

	/**
	A reference to the menuOperator Object
	@type {BaseContextMenuOperator}
	*/

	#menuOperator = null;

	/**
	The constructor
	@param {BaseContextMenuOperator} menuOperator A reference to the menuOperator Object
	*/

	constructor ( menuOperator ) {
		Object.freeze ( this );
		this.#menuOperator = menuOperator;
	}

	/**
	Event listener method
	@param {Event} touchEvent The event to handle
	*/

	handleEvent ( touchEvent ) {
		if ( ONE === touchEvent.changedTouches.length ) {
			const touch = touchEvent.changedTouches.item ( ZERO );
			switch ( touchEvent.type ) {
			case 'touchstart' :
				this.#clientX = touch.clientX;
				this.#clientY = touch.clientY;
				break;
			case 'touchend' :
				if ( this.#clientX && this.#clientY ) {
					if (
						ContextMenuTouchEL.#MIN_DELTA_CLIENT_Y < this.#clientY - touch.clientY
							&&
							ContextMenuTouchEL.#MAX_DELTA_CLIENT_X > Math.abs ( this.#clientX - touch.clientX )
					) {
						this.#menuOperator.onCancelMenu ( );
					}
				}
				this.#clientX = null;
				this.#clientY = null;
				break;
			case 'touchcancel' :
				this.#clientX = null;
				this.#clientY = null;
				break;
			default :
				break;
			}
		}
	}
}

export default ContextMenuTouchEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */