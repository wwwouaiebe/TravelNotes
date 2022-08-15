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

import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import theHTMLSanitizer from '../coreLib/HTMLSanitizer.js';
import { CancelButtonClickEL } from '../baseDialog/BaseDialogEventListeners.js';
import {
	DialogKeyboardKeydownEL,
	OkButtonClickEL
} from '../baseDialog/ModalBaseDialogEventListeners.js';
import {
	BackgroundWheelEL,
	BackgroundContextMenuEL,
	BackgroundDragOverEL,
	BackgroundTouchEL,
	BackgroundMouseEL
} from '../baseDialog/BaseDialogBackgroundEventListeners.js';
import BaseDialog from '../baseDialog/BaseDialog.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Base class for modal dialogs
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ModalBaseDialog extends BaseDialog {

	/**
	The background div of the dialog
	@type {HTMLElement}
	*/

	#backgroundDiv;

	/**
	The error div of the dialog
	@type {HTMLElement}
	*/

	#errorDiv;

	/**
	The wait div of the dialog
	@type {HTMLElement}
	*/

	#waitDiv;

	/**
	A flag to avoid all dialogs close when using the esc or enter keys
	@type {Boolean}
	*/

	#keyboardELEnabled;

	/**
	The ok button
	@type {HTMLElement}
	*/

	#okButton;

	/**
	The second button if any
	@type {?HTMLElement}
	*/

	#secondButton;

	/**
	Ok button click event listener
	@type {OkButtonClickEL}
	*/

	#okButtonClickEL;

	/**
	Cancel button click event listener
	@type {CancelButtonClickEL}
	*/

	#cancelButtonClickEL;

	/**
	onOk promise function
	@type {function}
	*/

	#onPromiseOkFct;

	/**
	onError promise function
	@type {function}
	*/

	#onPromiseErrorFct;

	/**
	Keyboard key down event listener
	@type {DialogKeyboardKeydownEL}
	*/

	#dialogKeyboardKeydownEL;

	/**
	Drag over the background event listener
	@type {BackgroundDragOverEL}
	*/

	#backgroundDragOverEL;

	/**
	Touch on the background event listener
	@type {BackgroundTouchEL}
	*/

	#backgroundTouchEL;

	/**
	mouseup, mousedown and mousemove event listeners  on the background
	@type {BackgroundMouseEL}
	*/

	#backgroundMouseEL;

	/**
	Wheel event listener on the background
	@type {BackgroundWheelEL}
	*/

	#backgroundWheelEL;

	/**
	Context menu event listener on the background
	@type {BackgroundContextMenuEL}
	*/

	#backgroundContextMenuEL;

	/**
	Create the background
	*/

	#createBackgroundDiv ( ) {

		// A new element covering the entire screen is created, with drag and drop event listeners
		this.#backgroundDiv = theHTMLElementsFactory.create ( 'div', { className : 'TravelNotes-Background' } );
		this.dragData.background = this.#backgroundDiv;
	}

	/**
	Create the background div event listeners.
	*/

	#createBackgroundDivEL ( ) {

		this.#backgroundDragOverEL = new BackgroundDragOverEL ( this.dragData );
		this.#backgroundDiv.addEventListener ( 'dragover', this.#backgroundDragOverEL, false );

		this.#backgroundWheelEL = new BackgroundWheelEL ( );
		this.#backgroundDiv.addEventListener ( 'wheel', this.#backgroundWheelEL, { passive : true }	);

		this.#backgroundContextMenuEL = new BackgroundContextMenuEL ( );
		this.#backgroundDiv.addEventListener ( 'contextmenu', this.#backgroundContextMenuEL, false );

		this.#backgroundTouchEL = new BackgroundTouchEL ( this );
		this.#backgroundDiv.addEventListener ( 'touchstart', this.#backgroundTouchEL, false );
		this.#backgroundDiv.addEventListener ( 'touchmove', this.#backgroundTouchEL, false );
		this.#backgroundDiv.addEventListener ( 'touchend', this.#backgroundTouchEL, false );
		this.#backgroundDiv.addEventListener ( 'touchcancel', this.#backgroundTouchEL, false );

		this.#backgroundMouseEL = new BackgroundMouseEL ( );
		this.#backgroundDiv.addEventListener ( 'mouseup', this.#backgroundMouseEL, false );
		this.#backgroundDiv.addEventListener ( 'mousemove', this.#backgroundMouseEL, false );
		this.#backgroundDiv.addEventListener ( 'mousedown', this.#backgroundMouseEL, false );
	}

	/**
	Create the error div
	*/

	#createErrorDiv ( ) {
		this.#errorDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-ErrorDiv TravelNotes-Hidden'
			}
		);
		this.addToContainer ( this.#errorDiv );
	}

	/**
	Create the dialog wait animation
	*/

	#createWaitDiv ( ) {
		theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-WaitAnimationBullet'
			},
			theHTMLElementsFactory.create (
				'div',
				{
					className : 'TravelNotes-WaitAnimation'
				},
				this.#waitDiv = theHTMLElementsFactory.create (
					'div',
					{
						className : 'TravelNotes-BaseDialog-WaitDiv  TravelNotes-Hidden'
					}				)
			)
		);
		this.addToContainer ( this.#waitDiv );
	}

	/**
	Create the dialog footer
	*/

	#createFooterDiv ( ) {
		const footerDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-FooterDiv'
			}
		);
		this.addToContainer ( footerDiv );

		this.#okButton = theHTMLElementsFactory.create (
			'div',
			{
				textContent : this.options.firstButtonText || '🆗',
				className : 'TravelNotes-BaseDialog-Button'
			},
			footerDiv
		);
		this.#okButtonClickEL = new OkButtonClickEL ( this );
		this.#okButton.addEventListener ( 'click', this.#okButtonClickEL, false );

		if ( this.options.secondButtonText ) {
			this.#secondButton = theHTMLElementsFactory.create (
				'div',
				{
					textContent : this.options.secondButtonText,
					className : 'TravelNotes-BaseDialog-Button'
				},
				footerDiv
			);
			this.#cancelButtonClickEL = new CancelButtonClickEL ( this );
			this.#secondButton.addEventListener ( 'click',	this.#cancelButtonClickEL, false	);
		}
		else {
			this.#secondButton = null;
		}

		this.footerHTMLElements.forEach (
			footerHTMLElement => footerDiv.appendChild ( footerHTMLElement )
		);
	}

	/**
	Create the HTML for the dialog
	*/

	#createHTML ( ) {
		this.#createBackgroundDiv ( );
		this.#createBackgroundDivEL ( );
		this.#createErrorDiv ( );
		this.#createWaitDiv ( );
		this.#createFooterDiv ( );
	}

	/**
	The destructor. Remove and set to null the event listeners
	*/

	#destructor ( ) {
		this.#backgroundDiv.removeEventListener ( 'wheel', this.#backgroundWheelEL, { passive : true }	);
		this.#backgroundWheelEL = null;

		this.#backgroundDiv.removeEventListener ( 'contextmenu', this.#backgroundContextMenuEL, false );
		this.#backgroundContextMenuEL = null;

		this.#backgroundDiv.removeEventListener ( 'dragover', this.#backgroundDragOverEL, false );
		this.#backgroundDragOverEL = null;

		this.#backgroundDiv.removeEventListener ( 'touchstart', this.#backgroundTouchEL, false );
		this.#backgroundDiv.removeEventListener ( 'touchmove', this.#backgroundTouchEL, false );
		this.#backgroundDiv.removeEventListener ( 'touchend', this.#backgroundTouchEL, false );
		this.#backgroundDiv.removeEventListener ( 'touchcancel', this.#backgroundTouchEL, false );
		this.#backgroundTouchEL = null;

		this.#backgroundDiv.removeEventListener ( 'mouseup', this.#backgroundMouseEL, false );
		this.#backgroundDiv.removeEventListener ( 'mousemove', this.#backgroundMouseEL, false );
		this.#backgroundDiv.removeEventListener ( 'mousedown', this.#backgroundMouseEL, false );
		this.#backgroundMouseEL = null;

		document.removeEventListener ( 'keydown', this.#dialogKeyboardKeydownEL, { capture : true } );
		this.#dialogKeyboardKeydownEL = null;

		this.#okButton.removeEventListener ( 'click', this.#okButtonClickEL, false );
		this.#okButtonClickEL = null;
		if ( this.options.secondButtonText ) {
			this.#secondButton.removeEventListener ( 'click', this.#cancelButtonClickEL, false	);
		}

		document.body.removeChild ( this.#backgroundDiv );
	}

	/**
	Build and show the dialog
	@param {function} onOk The onOk Promise handler
	@param {function} onError The onError Promise handler
	*/

	#show ( onOk, onError ) {
		this.#onPromiseOkFct = onOk;
		this.#onPromiseErrorFct = onError;
	}

	/**
	the constructor
	@param {BaseDialogOptions} options The options of the dialog
	*/

	constructor ( options ) {
		super ( options );
		this.#keyboardELEnabled = true;
	}

	/**
	Show the dialog
	*/

	show ( ) {
		super.show ( );
		this.#createHTML ( );
		document.body.appendChild ( this.#backgroundDiv );
		this.addToBackground ( this.#backgroundDiv );
		this.#dialogKeyboardKeydownEL = new DialogKeyboardKeydownEL ( this );
		document.addEventListener ( 'keydown', this.#dialogKeyboardKeydownEL, { capture : true } );
		this.centerDialog ( );
		return new Promise ( ( onOk, onError ) => this.#show ( onOk, onError ) );
	}

	/**
	Cancel button handler. Can be overloaded in the derived classes
	*/

	onCancel ( ) {
		this.#destructor ( );
		super.onCancel ( );
		this.#onPromiseErrorFct ( 'Canceled by user' );
	}

	/**
	Called after the ok button will be clicked and before the dialog will be closed.
	Can be overloaded in the derived classes.
	@return {Boolean} true when the dialog can be closed (all data in the dialog are valid), false otherwise.
	*/

	canClose ( ) {
		return true;
	}

	/**
	Ok button handler. Can be overloaded in the derived classes, but you have always to call super.onOk ( ).
	@param {} returnValue a value that will be returned to the onOk handler of the Promise
	*/

	onOk ( returnValue ) {
		if ( this.canClose ( ) ) {
			this.#onPromiseOkFct ( returnValue );
			this.#destructor ( );
			super.onOk ( );
			return true;
		}
		return false;
	}

	/**
	Show the wait section of the dialog and hide the okbutton
	*/

	showWait ( ) {
		this.#waitDiv.classList.remove ( 'TravelNotes-Hidden' );
		this.#okButton.classList.add ( 'TravelNotes-Hidden' );
	}

	/**
	Hide the wait section of the dialog and show the okbutton
	*/

	hideWait ( ) {
		this.#waitDiv.classList.add ( 'TravelNotes-Hidden' );
		this.#okButton.classList.remove ( 'TravelNotes-Hidden' );
	}

	/**
	Show the error section of the dialog
	@param {String} errorText The text to display in the error section
	*/

	showError ( errorText ) {
		this.#errorDiv.textContent = '';
		theHTMLSanitizer.sanitizeToHtmlElement ( errorText, this.#errorDiv );
		this.#errorDiv.classList.remove ( 'TravelNotes-Hidden' );
	}

	/**
	Hide the error section of the dialog
	*/

	hideError ( ) {
		this.#errorDiv.textContent = '';
		this.#errorDiv.classList.add ( 'TravelNotes-Hidden' );
	}

	/**
	An array with the HTMLElements that have to be added in the footer of the dialog
	Can be overloaded in the derived classes
	@type {Array.<HTMLElement>}
	*/

	get footerHTMLElements ( ) { return []; }

	/**
	A flag to avoid all dialogs close when using the esc or enter keys
	@type {Boolean}
	*/

	get keyboardELEnabled ( ) { return this.#keyboardELEnabled; }

	set keyboardELEnabled ( keyboardELEnabled ) { this.#keyboardELEnabled = keyboardELEnabled; }
}

export default ModalBaseDialog;

/* --- End of file --------------------------------------------------------------------------------------------------------- */