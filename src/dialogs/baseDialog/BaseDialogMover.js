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

import ObjId from '../../data/ObjId.js';
import theDevice from '../../core/lib/Device.js';
import { ZERO, TWO, DIALOG_DRAG_MARGIN } from '../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class store the dialog position and expose methods to move the dialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class BaseDialogMover {

	/**
	A unique identifier given to the mover for drag and drop operations
	@type {Number}
	*/

	#objId;

	/**
	The start drag X screen coordinate of the mouse
	@type {Number}
	*/

	#dragStartX;

	/** The start drag Y screen coordinate of the mouse
	@type {Number}
	*/

	#dragStartY;

	/**
	The X screen coordinate of the upper left corner of the dialog
	@type {Number}
	*/

	#dialogX;

	/**
	The Y screen coordinate of the upper left corner of the dialog
	@type {Number}
	*/

	#dialogY;

	/**
	Compute the new position of the dialog on the screen
	@param {Number} newDialogX The new X position of the dialog in pixels
	@param {Number} newDialogY The new Y position of the dialog in pixels
	*/

	#computePosition ( newDialogX, newDialogY ) {
		const screenAvailable = theDevice.screenAvailable;
		const maxDialogX =
			screenAvailable.width -	this.dialogHTMLElement.offsetWidth - DIALOG_DRAG_MARGIN;
		const maxDialogY =
			screenAvailable.height - this.dialogHTMLElement.offsetHeight - DIALOG_DRAG_MARGIN;
		this.#dialogX = Math.max ( Math.min ( newDialogX, maxDialogX ), DIALOG_DRAG_MARGIN );
		this.#dialogY = Math.max ( Math.min ( newDialogY, maxDialogY ), DIALOG_DRAG_MARGIN );
	}

	/**
	Finish the move dialog. Adapt the style of the dialog
	*/

	#endMoveDialog ( ) {
		this.dialogHTMLElement.style.left = String ( this.#dialogX ) + 'px';
		this.dialogHTMLElement.style.top = String ( this.#dialogY ) + 'px';
	}

	/**
	The container element of the dialog
	@type {HTMLElement}
	*/

	dialogHTMLElement = null;

	/**
	The top bar element of the dialog
	@type {HTMLElement}
	*/

	topBarHTMLElement = null;

	/**
	The constructor
	*/

	constructor ( ) {
		Object.seal ( this );
		this.#dialogX = DIALOG_DRAG_MARGIN;
		this.#dialogY = DIALOG_DRAG_MARGIN;
		this.#dragStartX = ZERO;
		this.#dragStartY = ZERO;
		this.#objId = ObjId.nextObjId;
	}

	/**
	A flag to detect if the dialog is on top of the screen
	@type {boolean}
	*/

	get onTop ( ) { return DIALOG_DRAG_MARGIN + TWO > this.#dialogY; }

	/**
	A unique identifier given to the mover for drag and drop operations
	@type {Number}
	*/

	get objId ( ) { return this.#objId; }

	/**
	Center the dialog o the screen
	*/

	centerDialog ( ) {
		const screenAvailable = theDevice.screenAvailable;
		this.dialogHTMLElement.style [ 'max-height' ] =
			String ( screenAvailable.height - ( TWO * DIALOG_DRAG_MARGIN ) ) + 'px';
		this.dialogHTMLElement.style [ 'max-width' ] =
			String ( screenAvailable.width - ( TWO * DIALOG_DRAG_MARGIN ) ) + 'px';
		this.#dialogX = ( screenAvailable.width - this.dialogHTMLElement.clientWidth ) / TWO;
		this.#dialogY = ( screenAvailable.height - this.dialogHTMLElement.clientHeight ) / TWO;
		this.#endMoveDialog ( );
	}

	/**
	Move the dialog to a drag event point and set the drag start values to this point
	@param {Event|Touch} dragEventOrTouch The drag event or Touch with the drag start values
	@param {?String} eventType The type of the event that have triggered the call to the method
	*/

	moveDialog ( dragEventOrTouch, eventType ) {
		const newDialogX = this.#dialogX + dragEventOrTouch.screenX - this.#dragStartX;
		const newDialogY = this.#dialogY + dragEventOrTouch.screenY - this.#dragStartY;
		this.moveDialogTo ( newDialogX, newDialogY, eventType );
		this.setDragStartPoint ( dragEventOrTouch );
	}

	/**
	Move the dialog on the screen
	@param {Number} newDialogX The new X position of the dialog in pixels
	@param {Number} newDialogY The new Y position of the dialog in pixels
	*/

	moveDialogTo ( newDialogX, newDialogY ) {
		this.#computePosition ( newDialogX, newDialogY );
		this.#endMoveDialog ( );
	}

	/**
	Move the dialog to it's last position after a hide followed by a show
	*/

	moveDialogToLastPosition ( ) {
		this.moveDialogTo ( this.#dialogX, this.#dialogY );
	}

	/**
	Move the dialog to the top left corner of the screen
	*/

	moveDialogToTopLeft ( ) {
		this.#dialogX = DIALOG_DRAG_MARGIN;
		this.#dialogY = DIALOG_DRAG_MARGIN;
		this.#endMoveDialog ( );
	}

	/**
	Set the drag start values
	@param {Event|Touch} dragEventOrTouch The drag event or Touch with the drag start values
	*/

	setDragStartPoint ( dragEventOrTouch ) {
		this.#dragStartX = dragEventOrTouch.screenX;
		this.#dragStartY = dragEventOrTouch.screenY;
	}
}

export default BaseDialogMover;

/* --- End of file --------------------------------------------------------------------------------------------------------- */