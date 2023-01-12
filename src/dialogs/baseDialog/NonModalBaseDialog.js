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

import BaseDialog from '../BaseDialog/BaseDialog.js';
import BackgroundDragOverEL from './BackgroundDragOverEL.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Base class for non modal dialogs
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class NonModalBaseDialog extends BaseDialog {

	/**
	Drag over the background event listener
	@type {BackgroundDragOverEL}
	*/

	#backgroundDragOverEL;

	/**
	Create the event listener for the background
	*/

	#createBackgroundHTMLElementEL ( ) {

		this.#backgroundDragOverEL = new BackgroundDragOverEL ( this.mover );
		document.body.addEventListener ( 'dragover', this.#backgroundDragOverEL, false );
	}

	/**
	The constructor
	*/

	constructor ( ) {
		super ( );
	}

	/**
	Cancel button handler. Can be overloaded in the derived classes
	*/

	onCancel ( ) {
		document.body.removeEventListener ( 'dragover', this.#backgroundDragOverEL, false );
		this.#backgroundDragOverEL = null;
		super.onCancel ( );
		this.removeFromBackground ( document.body );
	}

	/**
	Show the dialog
	*/

	show ( ) {
		super.show ( );
		this.#createBackgroundHTMLElementEL ( );
		this.addToBackground ( document.body );
	}
}

export default NonModalBaseDialog;

/* --- End of file --------------------------------------------------------------------------------------------------------- */