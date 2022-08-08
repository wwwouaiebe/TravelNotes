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

import { ZERO, ONE, DIALOG_DRAG_MARGIN } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
dragstart event listener for the top bar
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TopBarDragStartEL {

	/**
	A reference to the dragData object of the dialog
	@type {DragData}
	*/

	#dragData;

	/**
	The constructor
	@param {DragData} dragData A reference to the dragData object of the dialog
	*/

	constructor ( dragData ) {
		Object.freeze ( this );
		this.#dragData = dragData;
	}

	/**
	Event listener method
	@param {Event} dragStartEvent The event to handle
	*/

	handleEvent ( dragStartEvent ) {
		this.#dragData.dragStartX = dragStartEvent.screenX;
		this.#dragData.dragStartY = dragStartEvent.screenY;
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
dragend event event listener for the top bar
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TopBarDragEndEL {

	/**
	A reference to the dragData object of the dialog
	@type {DragData}
	*/

	#dragData;

	/**
	A reference to the dialog container
	@type {HTMLElement}
	*/

	#container;

	/**
	A reference to the background of the dialog
	@type {HTMLElement}
	*/

	#background;

	/**
	The constructor
	@param {DragData} dragData A reference to the dragData object of the dialog
	@param {HTMLElement} container A reference to the dialog container
	@param {HTMLElement} background A reference to the background of the dialog
	*/

	constructor ( dragData, container, background ) {
		Object.freeze ( this );
		this.#dragData = dragData;
		this.#container = container;
		this.#background = background;
	}

	/**
	Event listener method
	@param {Event} dragEndEvent The event to handle
	*/

	handleEvent ( dragEndEvent ) {
		this.#dragData.dialogX += dragEndEvent.screenX - this.#dragData.dragStartX;
		this.#dragData.dialogY += dragEndEvent.screenY - this.#dragData.dragStartY;

		this.#dragData.dialogX =
			Math.min (
				Math.max ( this.#dragData.dialogX, DIALOG_DRAG_MARGIN ),
				this.#background.clientWidth -
					this.#container.clientWidth -
					DIALOG_DRAG_MARGIN
			);

		this.#dragData.dialogY =
		Math.min (
			Math.max ( this.#dragData.dialogY, DIALOG_DRAG_MARGIN ),
			this.#background.clientHeight -
				this.#container.clientHeight -
				DIALOG_DRAG_MARGIN
		);

		this.#container.style.left = String ( this.#dragData.dialogX ) + 'px';
		this.#container.style.top = String ( this.#dragData.dialogY ) + 'px';
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
touchstart event listener for the top bar
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TopBarTouchStartEL {

	/**
	A reference to the dragData object of the dialog
	@type {DragData}
	*/

	#dragData;

	/**
	The constructor
	@param {TouchData} touchTopBarData A reference to the touchTopBarData object of the dialog
	*/

	constructor ( dragData ) {
		Object.freeze ( this );
		this.#dragData = dragData;
	}

	/**
	Handle the touchstart event on the top bar
	@param {Event} touchStartEvent The event to handle
	*/

	handleEvent ( touchStartEvent ) {
		touchStartEvent.stopPropagation ( );
		if ( ONE === touchStartEvent.targetTouches.length ) {
			const touch = touchStartEvent.changedTouches.item ( ZERO );
			this.#dragData.dragStartX = touch.screenX;
			this.#dragData.dragStartY = touch.screenY;
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
touchmove and touchend event listener for the top bar
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TopBarTouchMoveOrEndEL {

	/**
	A reference to the dragData object of the dialog
	@type {DragData}
	*/

	#dragData;

	/**
	A reference to the dialog container
	@type {HTMLElement}
	*/

	#container;

	/**
	A reference to the background of the dialog
	@type {HTMLElement}
	*/

	#background;

	/**
	The constructor
	@param {TouchData} touchTopBarData A reference to the touchTopBarData object of the dialog
	@param {HTMLElement} container A reference to the dialog container
	@param {HTMLElement} background A reference to the background of the dialog
	*/

	constructor ( dragData, container, background ) {
		Object.freeze ( this );
		this.#dragData = dragData;
		this.#container = container;
		this.#background = background;
	}

	/**
	Handle the touch move or touch end event on the top bar
	@param {Event} touchEndEvent The event to handle
	*/

	handleEvent ( touchEndEvent ) {
		touchEndEvent.stopPropagation ( );
		if ( ONE === touchEndEvent.changedTouches.length ) {
			const touch = touchEndEvent.changedTouches.item ( ZERO );
			this.#dragData.dialogX += touch.screenX - this.#dragData.dragStartX;
			this.#dragData.dialogY += touch.screenY - this.#dragData.dragStartY;

			this.#dragData.dragStartX = touch.screenX;
			this.#dragData.dragStartY = touch.screenY;

			this.#dragData.dialogX =
				Math.min (
					Math.max ( this.#dragData.dialogX, DIALOG_DRAG_MARGIN ),
					this.#background.clientWidth -
						this.#container.clientWidth -
						DIALOG_DRAG_MARGIN
				);

			this.#dragData.dialogY =
			Math.min (
				Math.max ( this.#dragData.dialogY, DIALOG_DRAG_MARGIN ),
				this.#background.clientHeight -
					this.#container.clientHeight -
					DIALOG_DRAG_MARGIN
			);

			this.#container.style.left = String ( this.#dragData.dialogX ) + 'px';
			this.#container.style.top = String ( this.#dragData.dialogY ) + 'px';
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
touchcancel event listener for the top bar
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TopBarTouchCancelEL {

	/**
	A reference to the dragData object of the dialog
	@type {DragData}
	*/

	#dragData;

	/**
	The constructor
	@param {TouchData} touchTopBarData A reference to the touchTopBarData object of the dialog
	*/

	constructor ( dragData ) {
		Object.freeze ( this );
		this.#dragData = dragData;
	}

	/**
	Handle the touchcancel event on the top bar
	*/

	handleEvent ( /* touchCancelEvent */ ) {
		this.#dragData.reset ( );
	}
}

export {
	TopBarDragStartEL,
	TopBarDragEndEL,
	TopBarTouchStartEL,
	TopBarTouchMoveOrEndEL,
	TopBarTouchCancelEL
};

/* --- End of file --------------------------------------------------------------------------------------------------------- */