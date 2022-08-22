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
        - created from BaseDialogEventListeners.js
		- Issue ♯38 : Review mouse and touch events on the background div of dialogs
		- Issue #41 : Not possible to move a dialog on touch devices
Doc reviewed ...
Tests ...
*/

import { ZERO, ONE } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
dragstart event listener for the top bar
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TopBarDragStartEL {

	/**
	A reference to the DialogMover object of the dialog
	@type {DialogMover}
	*/

	#dialogMover;

	/**
	The constructor
	@param {DialogMover} dialogMover A reference to the DialogMover object of the dialog
	*/

	constructor ( dialogMover ) {
		Object.freeze ( this );
		this.#dialogMover = dialogMover;
	}

	/**
	Event listener method
	@param {Event} dragStartEvent The event to handle
	*/

	handleEvent ( dragStartEvent ) {
		this.#dialogMover.setDragStartPoint ( dragStartEvent );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
dragend event event listener for the top bar
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TopBarDragEndEL {

	/**
	A reference to the DialogMover object of the dialog
	@type {DialogMover}
	*/

	#dialogMover;

	/**
	The constructor
	@param {DialogMover} dialogMover A reference to the DialogMover object of the dialog
	*/

	constructor ( dialogMover ) {
		Object.freeze ( this );
		this.#dialogMover = dialogMover;
	}

	/**
	Event listener method
	@param {Event} dragEndEvent The event to handle
	*/

	handleEvent ( dragEndEvent ) {
		this.#dialogMover.moveDialog ( dragEndEvent );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
touchstart, touchmove, touchend and touchcancel event listener for the top bar
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TopBarTouchEL {

	/**
	A reference to the DialogMover object of the dialog
	@type {DialogMover}
	*/

	#dialogMover;

	/**
	The constructor
	@param {DialogMover} dialogMover A reference to the DialogMover object of the dialog
	*/

	constructor ( dialogMover ) {
		Object.freeze ( this );
		this.#dialogMover = dialogMover;
	}

	/**
	Handle the touch move or touch end event on the top bar
	@param {Event} touchEvent The event to handle
	*/

	handleEvent ( touchEvent ) {
		touchEvent.stopPropagation ( );
		if ( ONE === touchEvent.changedTouches.length ) {
			const touch = touchEvent.changedTouches.item ( ZERO );
			switch ( touchEvent.type ) {
			case 'touchstart' :
				this.#dialogMover.setDragStartPoint ( touch );
				break;
			case 'touchmove' :
			case 'touchend' :
				this.#dialogMover.moveDialog ( touch );
				break;
			case 'touchcancel' :
				break;
			default :
				break;
			}
		}
	}
}

export {
	TopBarDragStartEL,
	TopBarDragEndEL,
	TopBarTouchEL
};

/* --- End of file --------------------------------------------------------------------------------------------------------- */