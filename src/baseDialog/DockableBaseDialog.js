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
		- created
Doc reviewed ...
Tests ...
*/

import NonModalBaseDialog from '../baseDialog/NonModalBaseDialog.js';
import { MouseEnterDockableDialogEL, MouseLeaveDockableDialogEL } from '../baseDialog/DockableBaseDialogEL.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Base class used for dockable dialogs
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class DockableBaseDialog extends NonModalBaseDialog {

	/**
	A variable to store the visibility of the dialog
	@type {boolean}
	*/

	#isShow;

	/**
	mouse enter on the dialog event listener
	@type {MouseEnterDockableDialogEL}
	*/

	#mouseEnterDockableDialogEL;

	/**
	mouse leave the dialog event listener
	@type {MouseLeaveDockableDialogEL}
	*/

	#mouseLeaveDockableDialogEL;

	/**
	The constructor
	@param {Number} dialogX The default X position in pixels for the dialog
	@param {Number} dialogY The default Y position in pixels for the dialog
	*/

	constructor ( ) {
		super ( );
		this.#mouseEnterDockableDialogEL = new MouseEnterDockableDialogEL ( this.dialogMover );
		this.#mouseLeaveDockableDialogEL = new MouseLeaveDockableDialogEL ( this.dialogMover );
	}

	/**
	Cancel button handler. Overload of the base class onCancel method
	*/

	onCancel ( ) {
		if ( this.#isShow ) {
			super.onCancel ( );
			this.#isShow = false;
			this.dialogMover.dialogHTMLElement.removeEventListener ( 'mouseenter', this.#mouseEnterDockableDialogEL, false );
			this.dialogMover.dialogHTMLElement.removeEventListener ( 'mouseleave', this.#mouseLeaveDockableDialogEL, false );
		}
	}

	/**
	Show the dialog. Overload of the base class show method
	*/

	show ( ) {
		if ( this.#isShow ) {
			return;
		}
		super.show ( );
		this.updateContent ( );
		this.#isShow = true;
		this.addCssClass ( 'TravelNotes-DockableBaseDialog' );

		this.dialogMover.moveDialogToSavedPosition ( );
		this.dialogMover.dialogHTMLElement.addEventListener ( 'mouseenter', this.#mouseEnterDockableDialogEL, false );
		this.dialogMover.dialogHTMLElement.addEventListener ( 'mouseleave', this.#mouseLeaveDockableDialogEL, false );
	}

	/**
	The show status of the dialog
	@type {boolean}
	*/

	get isShow ( ) { return this.#isShow; }
}

export default DockableBaseDialog;

/* --- End of file --------------------------------------------------------------------------------------------------------- */