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

import BaseEL from '../../eventListeners/BaseEL.js';
import { ZERO, ONE } from '../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
click, touchstart, touchmove, touchend and touchcancel event listeners on the topbar
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class BaseDialogTopBarEL extends BaseEL {

	/**
	A reference to the mover object of the dialog
	@type {BaseDialogMover|DockableBaseDialogMover}
	*/

	#mover;

	/**
	The constructor
	@param {BaseDialogMover|DockableBaseDialogMover} mover A reference to the mover object of the dialog
	*/

	constructor ( mover ) {
		super ( );
		Object.freeze ( this );
		this.#mover = mover;
		this.eventTypes = [ 'dragstart', 'dragend' ];
	}

	/**
	touchstart event handler
	@param {Event} touchStartEvent The event to handle
	*/

	handleTouchStartEvent ( touchStartEvent ) {
		if ( ONE === touchStartEvent.changedTouches.length ) {
			const touch = touchStartEvent.changedTouches.item ( ZERO );
			this.#mover.setDragStartPoint ( touch );
		}
	}

	/**
	touchmove event handler
	@param {Event} touchMoveEvent The event to handle
	*/

	handleTouchMoveEvent ( touchMoveEvent ) {
		if ( ONE === touchMoveEvent.changedTouches.length ) {
			const touch = touchMoveEvent.changedTouches.item ( ZERO );
			this.#mover.moveDialog ( touch, touchMoveEvent.type );
		}
	}

	/**
	touchend event handler
	@param {Event} touchEndEvent The event to handle
	*/

	handleTouchEndEvent ( touchEndEvent ) {
		if ( ONE === touchEndEvent.changedTouches.length ) {
			const touch = touchEndEvent.changedTouches.item ( ZERO );
			this.#mover.moveDialog ( touch, touchEndEvent.type );
		}
	}

	/**
	touchcancel event handler
	*/

	handleTouchCancel ( ) {
	}

	/**
	drag start event listener method
	@param {Event} dragStartEvent The event to handle
	*/

	handleDragStartEvent ( dragStartEvent ) {
		this.#mover.setDragStartPoint ( dragStartEvent );
		dragStartEvent.dataTransfer.setData ( 'ObjId', this.#mover.objId );
	}

	/**
	drag end event listener method
	@param {Event} dragEndEvent The event to handle
	*/

	handleDragEndEvent ( dragEndEvent ) {
		this.#mover.moveDialog ( dragEndEvent );
	}
}

export default BaseDialogTopBarEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */