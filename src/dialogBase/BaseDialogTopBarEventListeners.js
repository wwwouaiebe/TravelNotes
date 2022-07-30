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
		dragStartEvent.dataTransfer.dropEffect = 'move';
		dragStartEvent.dataTransfer.effectAllowed = 'move';
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
		this.#dragData.dialogX =
			Math.min (
				Math.max ( this.#dragData.dialogX, DIALOG_DRAG_MARGIN ),
				this.#background.clientWidth -
					this.#container.clientWidth -
					DIALOG_DRAG_MARGIN
			);

		this.#dragData.dialogY += dragEndEvent.screenY - this.#dragData.dragStartY;
		this.#dragData.dialogY =
			Math.max ( this.#dragData.dialogY, DIALOG_DRAG_MARGIN );

		const dialogMaxHeight =
			this.#background.clientHeight -
			Math.max ( this.#dragData.dialogY, ZERO ) -
			DIALOG_DRAG_MARGIN;

		this.#container.style.left = String ( this.#dragData.dialogX ) + 'px';
		this.#container.style.top = String ( this.#dragData.dialogY ) + 'px';
		this.#container.style [ 'max-height' ] = String ( dialogMaxHeight ) + 'px';
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
touchstart event listener for the top bar
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TopBarTouchStartEL {

	/**
	A reference to the touchTopBarData object of the dialog
	@type {DragData}
	*/

	#touchTopBarData;

	/**
	The constructor
	@param {TouchData} touchTopBarData A reference to the touchTopBarData object of the dialog
	*/

	constructor ( touchTopBarData ) {
		Object.freeze ( this );
		this.#touchTopBarData = touchTopBarData;
	}

	/**
	Handle the touchstart event on the top bar
	@param {Event} touchStartEvent The event to handle
	*/

	handleEvent ( touchStartEvent ) {
		touchStartEvent.stopPropagation ( );
		if ( ONE === touchStartEvent.targetTouches.length ) {
			const touch = touchStartEvent.changedTouches.item ( ZERO );
			this.#touchTopBarData.touchStartX = touch.screenX;
			this.#touchTopBarData.touchStartY = touch.screenY;
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
touchmove event listener for the top bar
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TopBarTouchMoveEL {

	/**
	A reference to the touchTopBarData object of the dialog
	@type {DragData}
	*/

	#touchTopBarData;

	/**
	A reference to the dialog container
	@type {HTMLElement}
	*/

	#container;

	/**
	The constructor
	@param {TouchData} touchTopBarData A reference to the touchTopBarData object of the dialog
	@param {HTMLElement} container A reference to the dialog container
	*/

	constructor ( touchTopBarData, container ) {
		Object.freeze ( this );
		this.#touchTopBarData = touchTopBarData;
		this.#container = container;
	}

	/**
	Handle the touchmove event on the top bar
	@param {Event} touchMoveEvent The event to handle
	*/

	handleEvent ( touchMoveEvent ) {
		touchMoveEvent.stopPropagation ( );

		if ( ONE === touchMoveEvent.changedTouches.length ) {
			const touch = touchMoveEvent.changedTouches.item ( ZERO );
			this.#touchTopBarData.dialogX += touch.screenX - this.#touchTopBarData.touchStartX;
			this.#touchTopBarData.dialogY += touch.screenY - this.#touchTopBarData.touchStartY;
			this.#touchTopBarData.touchStartX = touch.screenX;
			this.#touchTopBarData.touchStartY = touch.screenY;
			this.#container.style.left = String ( this.#touchTopBarData.dialogX ) + 'px';
			this.#container.style.top = String ( this.#touchTopBarData.dialogY ) + 'px';
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
touchend event listener for the top bar
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TopBarTouchEndEL {

	/**
	A reference to the touchTopBarData object of the dialog
	@type {DragData}
	*/

	#touchTopBarData;

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

	constructor ( touchTopBarData, container, background ) {
		Object.freeze ( this );
		this.#touchTopBarData = touchTopBarData;
		this.#container = container;
		this.#background = background;
	}

	/**
	Handle the touchend event on the top bar
	@param {Event} touchEndEvent The event to handle
	*/

	handleEvent ( touchEndEvent ) {
		touchEndEvent.stopPropagation ( );
		if ( ONE === touchEndEvent.changedTouches.length ) {
			const touch = touchEndEvent.changedTouches.item ( ZERO );
			this.#touchTopBarData.dialogX += touch.screenX - this.#touchTopBarData.touchStartX;
			this.#touchTopBarData.dialogY += touch.screenY - this.#touchTopBarData.touchStartY;

			this.#touchTopBarData.dialogX =
				Math.min (
					Math.max ( this.#touchTopBarData.dialogX, DIALOG_DRAG_MARGIN ),
					this.#background.clientWidth -
						this.#container.clientWidth -
						DIALOG_DRAG_MARGIN
				);

			this.#touchTopBarData.dialogY =
			Math.min (
				Math.max ( this.#touchTopBarData.dialogY, DIALOG_DRAG_MARGIN ),
				this.#background.clientHeight -
					this.#container.clientHeight -
					DIALOG_DRAG_MARGIN
			);
			this.#container.style.left = String ( this.#touchTopBarData.dialogX ) + 'px';
			this.#container.style.top = String ( this.#touchTopBarData.dialogY ) + 'px';
		}

		this.#touchTopBarData.reset ( );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
touchcancel event listener for the top bar
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TopBarTouchCancelEL {

	/**
	A reference to the touchTopBarData object of the dialog
	@type {DragData}
	*/

	#touchTopBarData;

	/**
	The constructor
	@param {TouchData} touchTopBarData A reference to the touchTopBarData object of the dialog
	*/

	constructor ( touchTopBarData ) {
		Object.freeze ( this );
		this.#touchTopBarData = touchTopBarData;
	}

	/**
	Handle the touchcancel event on the top bar
	*/

	handleEvent ( /* touchCancelEvent */ ) {
		this.#touchTopBarData.reset ( );
	}
}

export {
	TopBarDragStartEL,
	TopBarDragEndEL,
	TopBarTouchStartEL,
	TopBarTouchMoveEL,
	TopBarTouchEndEL,
	TopBarTouchCancelEL
};

/* --- End of file --------------------------------------------------------------------------------------------------------- */