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

import theDevice from '../../core/lib/Device';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
pointerup, pointerdown and pointermove event listener for the dialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class DialogPointerEL {

	/**
	A reference to the mover object of the dialog
	@type {BaseDialogMover}
	*/

	#mover;

	/**
	A flag to detect a pointerdown event eventually followed by a pointerup event
	@type {boolean}
	*/

	#isPointerDown;

	/**
	The constructor
	@param {BaseDialogMover} mover A reference to the mover object of the dialog
	*/

	constructor ( mover ) {
		Object.freeze ( this );
		this.#mover = mover;
		this.#isPointerDown = false;
	}

	/**
	Handle the pointerup, pointerdown and pointermove event on the top bar
	@param {Event} pointerEvent The event to handle
	*/

	handleEvent ( pointerEvent ) {
		pointerEvent.stopPropagation ( );
		theDevice.setPointerType ( pointerEvent );
		if ( 'touch' !== theDevice.pointerType ) {
			return;
		}
		switch ( pointerEvent.type ) {
		case 'pointerdown' :
			this.#isPointerDown = true;
			this.#mover.dragStart ( pointerEvent );
			break;
		case 'pointerup' :
			this.#isPointerDown = false;
			this.#mover.moveDialog ( pointerEvent );
			this.#mover.dockDialog ( );
			break;
		case 'pointermove' :
			if ( this.#isPointerDown ) {
				this.#mover.moveDialog ( pointerEvent );
			}
			break;
		default :
			break;
		}
	}
}

export default DialogPointerEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */