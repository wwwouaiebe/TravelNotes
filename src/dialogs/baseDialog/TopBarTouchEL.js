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
		- created from v3.6.0
Doc reviewed 202208
 */

import { ZERO, ONE } from '../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
touchstart, touchmove, touchend and touchcancel event listener for the top bar
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TopBarTouchEL {

	/**
	A reference to the mover object of the dialog
	@type {BaseDialogMover|DockableBaseDialogMover}
	*/

	#mover;

	/**
	A flag to detect a click event directly followed by a touchstart and touchend events on touch devices
	@type {boolean}
	*/

	#isClickEvent;

	/**
	The constructor
	@param {BaseDialogMover|DockableBaseDialogMover} mover A reference to the mover object of the dialog
	*/

	constructor ( mover ) {
		Object.freeze ( this );
		this.#mover = mover;
		this.#isClickEvent = false;
	}

	/**
	Handle the touch move or touch end event on the top bar
	@param {Event} touchEvent The event to handle
	*/

	handleEvent ( touchEvent ) {
		touchEvent.stopPropagation ( );
		let eventType = touchEvent.type;
		if ( ONE === touchEvent.changedTouches.length ) {
			const touch = touchEvent.changedTouches.item ( ZERO );
			switch ( touchEvent.type ) {
			case 'touchstart' :
				this.#isClickEvent = true;
				this.#mover.setDragStartPoint ( touch );
				break;
			case 'touchmove' :
				this.#isClickEvent = false;
				touchEvent.preventDefault ( );
				this.#mover.moveDialog ( touch, eventType );
				break;
			case 'touchend' :
				if ( ! this.#isClickEvent ) {
					this.#mover.moveDialog ( touch, eventType );
				}
				break;
			case 'touchcancel' :
				break;
			default :
				break;
			}
		}
	}
}

export default TopBarTouchEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */