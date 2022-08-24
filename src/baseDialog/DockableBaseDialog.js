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
import { ZERO } from '../main/Constants.js';

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

	/**
	The mover used by the dialog
	@type {DockableBaseDialogMover}
	*/

	#dockableBaseDialogMover;

	/**
	The last mouse event time stamp. Used to detect a mouseenter event directly followed by a click event
	on touch devices
	@type {Number}
	*/

	#lastMouseEventTimestamp;

	/**
	A flag to store the visibility of the dialog
	@type {boolean}
	*/

	#isShow;

	/**
	The max delay between a mouseenter and a click event to consider the two events as a single event
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #MOUSE_EVENT_MAX_DELAY ( ) { return 100; }

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
	@param {Event} mouseEvent The event to handle
	*/

	#mouseEnterDialogEL ( mouseEvent ) {
		this.#lastMouseEventTimestamp = mouseEvent.timeStamp;
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
	Click on the top bar event listener
	@param {Event} clickEvent The event to handle
	*/

	#topBarClickEL ( clickEvent ) {
		clickEvent.preventDefault ( );
		if ( DockableBaseDialog.#MOUSE_EVENT_MAX_DELAY > clickEvent.timeStamp - this.#lastMouseEventTimestamp ) {
			return;
		}
		if ( this.mover.dialogDocked ) {
			this.mover.dialogHTMLElement.classList.toggle ( 'TravelNotes-DockableBaseDialog-HiddenContent' );
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
		this.#dockableBaseDialogMover = null;
		this.#lastMouseEventTimestamp = ZERO;
		this.#isShow = false;
	}

	/**
	Get the mover object used with this dialog. Create the object if needed.
	Overload of the base class get mover ( )
	@type {DockableBaseDialogMover}
	*/

	get mover ( ) {
		return this.#dockableBaseDialogMover ?
			this.#dockableBaseDialogMover :
			this.#dockableBaseDialogMover = new DockableBaseDialogMover ( );
	}

	/**
	Overload of the base class method onCancel ( ). Close the dialog
	*/

	onCancel ( ) {
		super.onCancel ( );
		this.#isShow = false;
	}

	/**
	Show the dialog. Overload of the base class show method
	*/

	show ( ) {
		if ( this.#isShow ) {
			return;
		}
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
			mouseEvent => this.#mouseEnterDialogEL ( mouseEvent ),
			false
		);
		this.mover.dialogHTMLElement.addEventListener (
			'mouseleave',
			( ) => this.#mouseLeaveDialogEL ( ),
			false
		);

		this.mover.topBarHTMLElement.addEventListener (
			'click',
			clickEvent => this.#topBarClickEL ( clickEvent ),
			false
		);

		if ( this.mover.dialogDocked ) {
			this.mover.dialogHTMLElement.classList.add ( 'TravelNotes-DockableBaseDialog-HiddenContent' );
		}
		this.#isShow = true;
	}

}

export default DockableBaseDialog;

/* --- End of file --------------------------------------------------------------------------------------------------------- */