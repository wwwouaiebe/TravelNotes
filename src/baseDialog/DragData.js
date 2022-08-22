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

import { ZERO, TWO, DIALOG_DRAG_MARGIN } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A simple container with data shared between a dialog or a float window and the drag event listeners
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class DragData {

	/**
	The X screen coordinate of the mouse when dragging
	@type {Number}
	*/

	#dragStartX = ZERO;

	/** The Y screen coordinate of the mouse when dragging
	@type {Number}
	*/

	#dragStartY = ZERO;

	/**
	The X screen coordinate of the upper left corner of the dialog
	@type {Number}
	*/

	#dialogX = ZERO;

	/**
	The Y screen coordinate of the upper left corner of the dialog
	@type {Number}
	*/

	#dialogY = ZERO;

	/**
	The constructor
	*/

	constructor ( ) {
		Object.seal ( this );
		this.#dialogX = ZERO;
		this.#dialogY = ZERO;
		this.#dragStartX = ZERO;
		this.#dragStartY = ZERO;
	}

	/**
	The background element of the dialog
	@type {HTMLElement}
	*/

	backgroundHTMLElement = null;

	/**
	The container element of the dialog
	@type {HTMLElement}
	*/

	dialogHTMLElement = null;

	setDragStartPoint ( dragEventOrTouch ) {
		this.#dragStartX = dragEventOrTouch.screenX;
		this.#dragStartY = dragEventOrTouch.screenY;
	}

	moveDialog ( dragEventOrTouch ) {
		const toX = this.#dialogX + dragEventOrTouch.screenX - this.#dragStartX;
		const toY = this.#dialogY + dragEventOrTouch.screenY - this.#dragStartY;

		this.#dialogX = Math.max (
			Math.min (
				toX,
				this.backgroundHTMLElement.offsetWidth - this.dialogHTMLElement.offsetWidth
			),
			DIALOG_DRAG_MARGIN
		);
		this.#dialogY = Math.max (
			Math.min (
				toY,
				this.backgroundHTMLElement.offsetHeight - this.dialogHTMLElement.offsetHeight
			),
			DIALOG_DRAG_MARGIN
		);
		if (
			DIALOG_DRAG_MARGIN === this.#dialogY
			&&
			this.dialogHTMLElement.classList.contains ( 'TravelNotes-DockableBaseDialog' )
		) {
			this.#dialogY = ZERO;
		}

		if ( ZERO === this.#dialogY ) {
			this.dialogHTMLElement.classList.add ( 'TravelNotes-BaseDialog-OnTop' );
		}
		else {
			this.dialogHTMLElement.classList.remove ( 'TravelNotes-BaseDialog-OnTop' );
		}
		this.moveDialogToSavedPosition ( );
		this.setDragStartPoint ( dragEventOrTouch );
	}

	/**
	Center the dialog o the screen
	*/

	centerDialog ( ) {
		this.#dialogX =
			( this.backgroundHTMLElement.clientWidth - this.dialogHTMLElement.clientWidth ) / TWO;
		this.#dialogY =
			( this.backgroundHTMLElement.clientHeight - this.dialogHTMLElement.clientHeight ) / TWO;
		this.moveDialogToSavedPosition ( );
	}

	moveDialogToTopLeft ( ) {
		this.#dialogX = DIALOG_DRAG_MARGIN;
		this.#dialogY = DIALOG_DRAG_MARGIN;
		this.moveDialogToSavedPosition ( );
	}

	moveDialogToSavedPosition ( ) {
		this.dialogHTMLElement.style.left = String ( this.#dialogX ) + 'px';
		this.dialogHTMLElement.style.top = String ( this.#dialogY ) + 'px';
	}
}

export default DragData;

/* --- End of file --------------------------------------------------------------------------------------------------------- */