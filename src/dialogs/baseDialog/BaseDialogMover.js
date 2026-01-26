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

import ObjId from '../../data/ObjId.js';
import theDevice from '../../core/lib/Device.js';
import { ZERO, TWO, DIALOG_DRAG_MARGIN, DIALOG_MAX_WIDTH } from '../../main/Constants.js';
import theConfig from '../../data/Config.js';

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
	The dragstart X screen coordinate of the mouse
	@type {Number}
	*/

	#dragStartX;

	/** The dragstart Y screen coordinate of the mouse
	@type {Number}
	*/

	#dragStartY;

	/**
	The X screen coordinate of the upper left corner of the dialog
	@type {Number}
	*/

	#dialogLeft;

	/**
	The Y screen coordinate of the upper left corner of the dialog
	@type {Number}
	*/

	#dialogTop;

	/**
	a flag to store the docked status of the dialog
	@type {boolean}
	*/

	#dialogDocked;

	/**
	a flag to store the docked status of the dialog
	@type {boolean}
	*/

	get dialogDocked ( ) { return this.#dialogDocked; }

	/**
	 * A reference to the dialog handled by the DialogMover
	 * @type {BaseDialog}
	 */

	#dialog;

	/**
	A flag to detect if the dialog is on top of the screen
	@type {boolean}
	*/

	get isOnTop ( ) { return DIALOG_DRAG_MARGIN + TWO > this.#dialogTop; }

	/**
	A unique identifier given to the mover for drag and drop operations
	@type {Number}
	*/

	get objId ( ) { return this.#objId; }

	/**
	Dock the dialog on top f the screen when possible
	*/

	dockDialog ( ) {
		if ( this.#dialog.isDockable ) {
			if ( this.isOnTop ) {
				this.#dialog.addCssClass ( 'travelnotes-dockable-base-dialog-docked' );
				this.#dialog.addCssClass ( 'travelnotes-dockable-base-dialog-hidden-content' );
				this.#dialogTop = ZERO;
				this.#dialog.moveDialog ( this.#dialogLeft, this.#dialogTop );
				this.#dialogDocked = true;
			}
			else {
				this.#dialog.removeCssClass ( 'travelnotes-dockable-base-dialog-docked' );
				this.#dialog.removeCssClass ( 'travelnotes-dockable-base-dialog-hidden-content' );
				this.#dialogDocked = false;
			}
		}
	}

	/**
	The constructor
	@param {BaseDialog} dialog the dialog for witch the mover object is created
	*/

	constructor ( dialog ) {
		Object.freeze ( this );
		this.#dialog = dialog;
		this.#dialogLeft = DIALOG_DRAG_MARGIN;
		this.#dialogTop = DIALOG_DRAG_MARGIN;
		this.#dragStartX = ZERO;
		this.#dragStartY = ZERO;
		this.#objId = ObjId.nextObjId;
		this.#dialogDocked = false;
	}

	/**
	 * Save the dragstart point
	 * @param {Event} dragOrPointerEvent The dragstart event
	 */

	dragStart ( dragOrPointerEvent ) {
		this.#dragStartX = dragOrPointerEvent.clientX;
		this.#dragStartY = dragOrPointerEvent.clientY;
	}

	/**
	Move the dialog to a dragevent point and set the dragstart values to this point
	@param {Event} dragOrPointerEvent The drag event or pointer event with the drag start values
	*/

	moveDialog ( dragOrPointerEvent ) {

		// computing the new values for the upper left corner of the dialog
		const newDialogLeft = this.#dialogLeft + dragOrPointerEvent.clientX - this.#dragStartX;
		const newDialogTop = this.#dialogTop + dragOrPointerEvent.clientY - this.#dragStartY;

		// computing the max possible values (the dialog must be completely in the browser window)
		const screenAvailable = theDevice.screenAvailable;
		const boundingClientRect = this.#dialog.boundingClientRect;

		const maxDialogLeft =
			screenAvailable.width -	boundingClientRect.width - DIALOG_DRAG_MARGIN;
		const maxDialogTop =
			screenAvailable.height - boundingClientRect.height - ( TWO * DIALOG_DRAG_MARGIN );

		// selecting the correct value
		this.#dialogLeft = Math.max ( Math.min ( newDialogLeft, maxDialogLeft ), DIALOG_DRAG_MARGIN );
		this.#dialogTop = Math.max ( Math.min ( newDialogTop, maxDialogTop ), DIALOG_DRAG_MARGIN );

		// moving and docking the dialog
		this.#dialog.moveDialog ( this.#dialogLeft, this.#dialogTop );

		// Saving the dragOrPointer coords as start point for the next move
		this.#dragStartX = dragOrPointerEvent.clientX;
		this.#dragStartY = dragOrPointerEvent.clientY;
	}

	/**
	Center the dialog o the screen
	*/

	centerDialog ( ) {

		// only for dockable dialog...
		this.#dialog.removeCssClass ( 'travelnotes-dockable-base-dialog-docked' );
		this.#dialog.removeCssClass ( 'travelnotes-dockable-base-dialog-hidden-content' );

		const screenAvailable = theDevice.screenAvailable;
		const boundingClientRect = this.#dialog.boundingClientRect;

		this.#dialog.setMaxDim (
			Math.min ( screenAvailable.width - ( TWO * DIALOG_DRAG_MARGIN ), DIALOG_MAX_WIDTH ),
			screenAvailable.height - ( TWO * DIALOG_DRAG_MARGIN )
		);

		this.#dialogLeft = ( screenAvailable.width - boundingClientRect.width ) / TWO;
		if ( theConfig.baseDialog.touchTopScreen && 'touch' === theDevice.pointerType ) {

			// dialogs go on top of the screen for touch devices
			this.#dialogTop = DIALOG_DRAG_MARGIN;
		}
		else {
			this.#dialogTop = ( screenAvailable.height - boundingClientRect.height ) / TWO;
		}
		this.#dialog.moveDialog ( this.#dialogLeft, this.#dialogTop );
	}

	/**
	Move the dialog to it's last position after a hide followed by a show
	*/

	moveDialogToLastPosition ( ) {
		this.#dialog.moveDialog ( this.#dialogLeft, this.#dialogTop );
	}

	/**
	Move the dialog to the top left corner of the screen
	*/

	moveDialogToTopLeft ( ) {
		this.#dialogLeft = DIALOG_DRAG_MARGIN;
		this.#dialogTop = DIALOG_DRAG_MARGIN;
		this.#dialog.moveDialog ( this.#dialogLeft, this.#dialogTop );
	}

}

export default BaseDialogMover;

/* --- End of file --------------------------------------------------------------------------------------------------------- */