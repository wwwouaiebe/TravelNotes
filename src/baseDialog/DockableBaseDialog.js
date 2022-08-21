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

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Mouse enter on the dialog event listener. Show the content of the dialog when the dialog is docked
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class MouseEnterDockableDialogEL {

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
	*/

	handleEvent ( ) {
		if ( this.#dragData.container.classList.contains ( 'TravelNotes-BaseDialog-OnTop' ) ) {
			for ( const node of this.#dragData.container.childNodes ) {
				if ( node.classList.contains ( 'TravelNotes-BaseDialog-ContentDiv' ) ) {
					node.classList.remove ( 'TravelNotes-Hidden' );
				}
			}
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Mouse leave on the dialog event listener. Hide the content of the dialog when the dialog is docked
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class MouseLeaveDockableDialogEL {

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
	*/

	handleEvent ( ) {
		if ( this.#dragData.container.classList.contains ( 'TravelNotes-BaseDialog-OnTop' ) ) {
			for ( const node of this.#dragData.container.childNodes ) {
				if ( node.classList.contains ( 'TravelNotes-BaseDialog-ContentDiv' ) ) {
					node.classList.add ( 'TravelNotes-Hidden' );
				}
			}
		}
	}
}

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
	The X position of the dialog
	@type {Number}
	*/

	#dialogX;

	/**
	The Y position of the dialog
	@type {Number}
	*/

	#dialogY;

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

	constructor ( dialogX, dialogY ) {
		super ( );
		this.#dialogX = dialogX;
		this.#dialogY = dialogY;
		this.#mouseEnterDockableDialogEL = new MouseEnterDockableDialogEL ( this.dragData );
		this.#mouseLeaveDockableDialogEL = new MouseLeaveDockableDialogEL ( this.dragData );
	}

	/**
	Cancel button handler. Overload of the base class onCancel method
	*/

	onCancel ( ) {
		if ( this.#isShow ) {
			super.onCancel ( );
			this.#isShow = false;
			this.#dialogX = this.dragData.dialogX;
			this.#dialogY = this.dragData.dialogY;
			this.dragData.container.removeEventListener ( 'mouseenter', this.#mouseEnterDockableDialogEL, false );
			this.dragData.container.removeEventListener ( 'mouseleave', this.#mouseLeaveDockableDialogEL, false );
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
		this.dragData.container.classList.add ( 'TravelNotes-DockableBaseDialog' );
		this.moveTo ( this.#dialogX, this.#dialogY );
		this.dragData.container.addEventListener ( 'mouseenter', this.#mouseEnterDockableDialogEL, false );
		this.dragData.container.addEventListener ( 'mouseleave', this.#mouseLeaveDockableDialogEL, false );
	}

	/**
	The show status of the dialog
	@type {boolean}
	*/

	get isShow ( ) { return this.#isShow; }
}

export default DockableBaseDialog;

/* --- End of file --------------------------------------------------------------------------------------------------------- */