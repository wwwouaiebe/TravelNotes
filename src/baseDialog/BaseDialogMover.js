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
		- created from DragData
Doc reviewed 20220823
Tests ...
*/

import { ZERO, TWO, DIALOG_DRAG_MARGIN } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class store the dialog position and expose methods to move the dialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class BaseDialogMover {

	/**
	The start drag X screen coordinate of the mouse
	@type {Number}
	*/

	dragStartX;

	/** The start drag Y screen coordinate of the mouse
	@type {Number}
	*/

	dragStartY;

	/**
	The X screen coordinate of the upper left corner of the dialog
	@type {Number}
	*/

	dialogX;

	/**
	The Y screen coordinate of the upper left corner of the dialog
	@type {Number}
	*/

	dialogY;

	/**
	Finish the move dialog. Adapt the style of the dialog
	*/

	endMoveDialog ( ) {
		this.dialogHTMLElement.style.left = String ( this.dialogX ) + 'px';
		this.dialogHTMLElement.style.top = String ( this.dialogY ) + 'px';
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.seal ( this );
		this.dialogX = DIALOG_DRAG_MARGIN;
		this.dialogY = DIALOG_DRAG_MARGIN;
		this.dragStartX = ZERO;
		this.dragStartY = ZERO;
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

	/**
	Set the drag start values
	@param {Event|Touch} dragEventOrTouch The drag event or Touch with the drag start values
	*/

	setDragStartPoint ( dragEventOrTouch ) {
		this.dragStartX = dragEventOrTouch.screenX;
		this.dragStartY = dragEventOrTouch.screenY;
	}

	/**
	Move the dialog to a drag event point and set the drag start values to this point
	@param {Event|Touch} dragEventOrTouch The drag event or Touch with the drag start values
	@param {?String} eventType The type of the event that have triggered the call to the method
	*/

	moveDialog ( dragEventOrTouch ) {
		const newDialogX = this.dialogX + dragEventOrTouch.screenX - this.dragStartX;
		const newDialogY = this.dialogY + dragEventOrTouch.screenY - this.dragStartY;
		this.moveDialogTo ( newDialogX, newDialogY );
		this.setDragStartPoint ( dragEventOrTouch );
	}

	/**
	Move the dialog on the screen
	@param {Number} newDialogX The new X position of the dialog in pixels
	@param {Number} newDialogY The new Y position of the dialog in pixels
	@param {?String} eventType The type of the event that have triggered the call to the method
	*/

	moveDialogTo ( newDialogX, newDialogY ) {
		const maxDialogX =
			this.backgroundHTMLElement.offsetWidth - this.dialogHTMLElement.offsetWidth - DIALOG_DRAG_MARGIN;
		const maxDialogY =
			this.backgroundHTMLElement.offsetHeight - this.dialogHTMLElement.offsetHeight - DIALOG_DRAG_MARGIN;

		this.dialogX = Math.max ( Math.min ( newDialogX, maxDialogX ), DIALOG_DRAG_MARGIN );
		this.dialogY = Math.max ( Math.min ( newDialogY, maxDialogY ), DIALOG_DRAG_MARGIN );
		this.endMoveDialog ( );
	}

	/**
	Center the dialog o the screen
	*/

	centerDialog ( ) {
		this.dialogX =
			( this.backgroundHTMLElement.clientWidth - this.dialogHTMLElement.clientWidth ) / TWO;
		this.dialogY =
			( this.backgroundHTMLElement.clientHeight - this.dialogHTMLElement.clientHeight ) / TWO;
		this.endMoveDialog ( );
	}

	/**
	Move the dialog to the top left corner of the screen
	*/

	moveDialogToTopLeft ( ) {
		this.dialogX = DIALOG_DRAG_MARGIN;
		this.dialogY = DIALOG_DRAG_MARGIN;
		this.endMoveDialog ( );
	}

	/**
	set the position of the dialog the first time the dialog is show
	@param {Number} dialogX The X position of the dialog in pixels
	@param {Number} dialogY The Y position of the dialog in pixels
	*/

	setStartupPosition ( dialogX, dialogY ) {
		this.dialogX = dialogX;
		this.dialogY = dialogY;
	}

	/**
	Move the dialog to it's last position after a hide followed by a show
	*/

	moveDialogToLastPosition ( ) {
		this.moveDialogTo ( this.dialogX, this.dialogY );
	}
}

export default BaseDialogMover;

/* --- End of file --------------------------------------------------------------------------------------------------------- */