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

import BaseDialogMover from './BaseDialogMover.js';
import { ZERO, DIALOG_DRAG_MARGIN } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class store the dialog position and expose methods to move the dialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class DockableDialogMover extends BaseDialogMover {

	/**
	a flag to store the docked status of the dialog
	@type {boolean}
	*/

	#dialogDocked;

	/**
	Dock the dialog on top f the screen when possible
	*/

	#dockDialog ( ) {
		if ( DIALOG_DRAG_MARGIN === this.dialogY ) {
			this.dialogY = ZERO;
			this.dialogHTMLElement.classList.add ( 'TravelNotes-DockableBaseDialog-Docked' );
			this.#dialogDocked = true;
		}
		else {
			this.dialogHTMLElement.classList.remove ( 'TravelNotes-DockableBaseDialog-Docked' );
			this.dialogHTMLElement.classList.remove ( 'TravelNotes-DockableBaseDialog-HiddenContent' );
			this.#dialogDocked = false;
		}
	}

	/**
	The constructor
	*/

	constructor ( ) {
		super ( );
		this.#dialogDocked = false;
	}

	/**
	A method to test if a dialog is docked. True when the dialog is docked
	@type {boolean}
	*/

	get dialogDocked ( ) { return this.#dialogDocked; }

	/**
	Move the dialog to a drag event point and set the drag start values to this point
	@param {Event|Touch} dragEventOrTouch The drag event or Touch with the drag start values
	@param {?String} eventType The type of the event that have triggered the call to the method
	*/

	moveDialog ( dragEventOrTouch, eventType ) {
		const newDialogX = this.dialogX + dragEventOrTouch.screenX - this.dragStartX;
		const newDialogY = this.dialogY + dragEventOrTouch.screenY - this.dragStartY;
		this.moveDialogTo ( newDialogX, newDialogY, eventType );
		this.setDragStartPoint ( dragEventOrTouch );
	}

	/**
	Move the dialog on the screen
	@param {Number} newDialogX The new X position of the dialog in pixels
	@param {Number} newDialogY The new Y position of the dialog in pixels
	@param {?String} eventType The type of the event that have triggered the call to the method
	*/

	moveDialogTo ( newDialogX, newDialogY, eventType ) {
		const maxDialogX =
			this.backgroundHTMLElement.offsetWidth - this.dialogHTMLElement.offsetWidth - DIALOG_DRAG_MARGIN;
		const maxDialogY =
			this.backgroundHTMLElement.offsetHeight - this.dialogHTMLElement.offsetHeight - DIALOG_DRAG_MARGIN;

		this.dialogX = Math.max ( Math.min ( newDialogX, maxDialogX ), DIALOG_DRAG_MARGIN );
		this.dialogY = Math.max ( Math.min ( newDialogY, maxDialogY ), DIALOG_DRAG_MARGIN );
		if ( 'touchmove' !== eventType ) {
			this.#dockDialog ( );
		}
		this.endMoveDialog ( );
	}

}

export default DockableDialogMover;

/* --- End of file --------------------------------------------------------------------------------------------------------- */