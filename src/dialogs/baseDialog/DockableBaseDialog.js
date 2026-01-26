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

import NonModalBaseDialog from './NonModalBaseDialog.js';
import theConfig from '../../data/Config.js';
import BaseContextMenu from '../../contextMenus/baseContextMenu/BaseContextMenu.js';
import { ZERO } from '../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Base class used for dockable dialogs
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class DockableBaseDialog extends NonModalBaseDialog {

	/**
	The default X position in pixels for the dialog.
	@type {?Number}
	*/

	#defaultDialogX;

	/**
	The default Y position in pixels for the dialog
	@type {?Number}
	*/

	#defaultDialogY;

	/**
	A timer id for the mouse leave event listener
	@type {?Number}
	*/

	#mouseLeaveTimerId;

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
	The minimal timeout for the mouse leave event
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #MIN_MOUSE_LEAVE_TIMEOUT ( ) { return 1500; }

	/**
	A flag indication if the dialog is dockable
	@type {Boolean}
	*/

	get isDockable ( ) { return true; }

	/**
	Hide the content of the dialog. Used by the timer on mouseLeave
	*/

	#hideContent ( ) {
		if ( this.mover.dialogDocked ) {
			if ( BaseContextMenu.isActive ) {
				this.#mouseLeaveTimerId = setTimeout (
					( ) => { this.#hideContent ( ); },
					Math.max ( DockableBaseDialog.#MIN_MOUSE_LEAVE_TIMEOUT, theConfig.dockableBaseDialog.timeout )
				);
			}
			else {
				this.addCssClass (
					'travelnotes-dockable-base-dialog-hidden-content'
				);
			}
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
			this.removeCssClass ( 'travelnotes-dockable-base-dialog-hidden-content' );
		}
	}

	/**
	mouse leave the dialog event listener
	*/

	#mouseLeaveDialogEL ( ) {
		if ( this.mover.dialogDocked ) {
			this.#mouseLeaveTimerId = setTimeout (
				( ) => { this.#hideContent ( ); },
				Math.max ( DockableBaseDialog.#MIN_MOUSE_LEAVE_TIMEOUT, theConfig.dockableBaseDialog.timeout )
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
			this.toggleCssClass ( 'travelnotes-dockable-base-dialog-hidden-content' );
		}
	}

	/**
	The constructor
	@param {?Number} defaultDialogX The default X position in pixels for the dialog
	@param {?Number} defaultDialogY The default Y position in pixels for the dialog
	*/

	constructor ( defaultDialogX, defaultDialogY ) {
		super ( );
		this.#defaultDialogX = defaultDialogX;
		this.#defaultDialogY = defaultDialogY;
		this.#mouseLeaveTimerId = null;
		this.#lastMouseEventTimestamp = ZERO;
		this.#isShow = false;
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
		this.addCssClass ( 'travelnotes-dockable-base-dialog' );
		this.updateContent ( );
		if ( null !== this.#defaultDialogX && null !== this.#defaultDialogY ) {

			// moving the dialog to it's default position if a default position was given in the constructor
			this.mover.moveDialog (
				{
					clientX : this.#defaultDialogX,
					clientY : this.#defaultDialogY
				}
			);
			this.mover.dockDialog ( );
			this.#defaultDialogX = null;
			this.#defaultDialogY = null;
		}
		else {

			// otherwise moving to the last used position
			this.mover.moveDialogToLastPosition ( );
		}

		// Adding event listeners
		this.dialogContainer.addEventListener (
			'mouseenter',
			mouseEvent => this.#mouseEnterDialogEL ( mouseEvent ),
			false
		);

		if ( theConfig.dockableBaseDialog.hideOnMouseLeave ) {
			this.dialogContainer.addEventListener (
				'mouseleave',
				( ) => this.#mouseLeaveDialogEL ( ),
				false
			);
		}

		this.topBarHTMLElement.addEventListener (
			'click',
			clickEvent => this.#topBarClickEL ( clickEvent ),
			false
		);

		if ( this.mover.dialogDocked ) {
			this.addCssClass ( 'travelnotes-dockable-base-dialog-hidden-content' );
		}
		this.#isShow = true;
	}

}

export default DockableBaseDialog;

/* --- End of file --------------------------------------------------------------------------------------------------------- */