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
import DockableBaseDialogMover from '../baseDialog/DockableBaseDialogMover.js';
import theConfig from '../data/Config.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Base class used for dockable dialogs
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class DockableBaseDialog extends NonModalBaseDialog {

	/**
	The default X position in pixels for the dialog
	@type {?Number}
	*/

	#dialogX;

	/**
	The default Y position in pixels for the dialog
	@type {?Number}
	*/

	#dialogY;

	/**
	A timer id for the mouse leave event listener
	@type {?Number}
	*/

	#mouseLeaveTimerId;

	#dockableBaseDialogMover;

	/**
	Hide the content of the dialog. Used by the timer on mouseLeave
	*/

	#hideContent ( ) {
		if ( this.mover.dialogDocked ) {
			this.mover.dialogHTMLElement.classList.add (
				'TravelNotes-DockableBaseDialog-HiddenContent'
			);
		}
	}

	/**
	mouse enter on the dialog event listener
	*/

	#mouseEnterDialogEL ( ) {
		if ( this.#mouseLeaveTimerId ) {
			clearTimeout ( this.#mouseLeaveTimerId );
			this.#mouseLeaveTimerId = null;
		}
		if ( this.mover.dialogDocked ) {
			this.mover.dialogHTMLElement.classList.remove ( 'TravelNotes-DockableBaseDialog-HiddenContent' );
		}
	}

	/**
	mouse leave the dialog event listener
	*/

	#mouseLeaveDialogEL ( ) {
		if ( this.mover.dialogDocked ) {
			this.#mouseLeaveTimerId = setTimeout (
				( ) => { this.#hideContent ( ); },
				theConfig.baseDialog.timeout
			);
		}
	}

	/**
	The constructor
	@param {Number} dialogX The default X position in pixels for the dialog
	@param {Number} dialogY The default Y position in pixels for the dialog
	*/

	constructor ( dialogX, dialogY ) {
		super ( );
		this.#dialogX = dialogX;
		this.#dialogY = dialogY;
		this.#mouseLeaveTimerId = null;
	}

	get mover ( ) {
		return this.#dockableBaseDialogMover ?
			this.#dockableBaseDialogMover :
			this.#dockableBaseDialogMover = new DockableBaseDialogMover ( );
	}

	/**
	Show the dialog. Overload of the base class show method
	*/

	show ( ) {
		super.show ( );
		this.addCssClass ( 'TravelNotes-DockableBaseDialog' );
		this.updateContent ( );
		if ( null !== this.#dialogX && null !== this.#dialogY ) {
			this.mover.moveDialogTo ( this.#dialogX, this.#dialogY );
			this.#dialogX = null;
			this.#dialogY = null;
		}
		else {
			this.mover.moveDialogToLastPosition ( );
		}
		this.mover.dialogHTMLElement.addEventListener (
			'mouseenter',
			( ) => this.#mouseEnterDialogEL ( ),
			false
		);
		this.mover.dialogHTMLElement.addEventListener (
			'mouseleave',
			( ) => this.#mouseLeaveDialogEL ( ),
			false
		);
		if ( this.mover.dialogDocked ) {
			this.mover.dialogHTMLElement.classList.add ( 'TravelNotes-DockableBaseDialog-HiddenContent' );
		}
	}

}

export default DockableBaseDialog;

/* --- End of file --------------------------------------------------------------------------------------------------------- */