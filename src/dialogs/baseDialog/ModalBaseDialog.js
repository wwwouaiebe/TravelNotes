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

import theHTMLElementsFactory from '../../core/uiLib/HTMLElementsFactory.js';
import theHTMLSanitizer from '../../core/htmlSanitizer/HTMLSanitizer.js';
import BaseDialogCancelButtonEL from './BaseDialogCancelButtonEL.js';
import ModalDialogKeyboardKeydownEL from './ModalDialogKeyboardKeydownEL.js';
import ModalDialogOkButtonEL from './ModalDialogOkButtonEL.js';
import ModalBaseDialogBackgroundEL from './ModalBaseDialogBackgroundEL.js';
import BaseDialog from './BaseDialog.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Base class for modal dialogs
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ModalBaseDialog extends BaseDialog {

	/**
	The background HTMLElement of the dialog
	@type {HTMLElement}
	*/

	#backgroundHTMLElement;

	/**
	The error HTMLElement of the dialog
	@type {HTMLElement}
	*/

	#errorHTMLElement;

	/**
	The wait HTMLElement of the dialog
	@type {HTMLElement}
	*/

	#waitHTMLElement;

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
	@type {ModalDialogOkButtonEL}
	*/

	#modalDialogOkButtonEL;

	/**
	Cancel button click event listener
	@type {BaseDialogCancelButtonEL}
	*/

	#baseDialogCancelButtonEL;

	/**
	onOk promise function
	@type {function}
	*/

	#onPromiseOkFunction;

	/**
	onError promise function
	@type {function}
	*/

	#onPromiseErrorFunction;

	/**
	Keyboard key down event listener
	@type {ModalDialogKeyboardKeydownEL}
	*/

	#modalDialogKeyboardKeydownEL;

	/**
	Context menu event listener on the background
	@type {ModalBaseDialogBackgroundEL}
	*/

	#backgroundEL;

	/**
	Create the background
	*/

	#createBackgroundHTMLElement ( ) {

		// A new element covering the entire screen is created, with drag and drop event listeners
		this.#backgroundHTMLElement = theHTMLElementsFactory.create ( 'div', { className : 'TravelNotes-Background' } );
		this.#backgroundEL = new ModalBaseDialogBackgroundEL ( this );
		this.#backgroundEL.addEventListeners ( this.#backgroundHTMLElement );
	}

	/**
	Create the error HTMLElement
	*/

	#createErrorHTMLElement ( ) {
		this.#errorHTMLElement = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-ModalBaseDialog-ErrorHTMLElement TravelNotes-Hidden'
			}
		);
		this.addToDialog ( this.#errorHTMLElement );
	}

	/**
	Create the dialog wait HTMLElement and animation
	*/

	#createWaitHTMLElement ( ) {
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
				this.#waitHTMLElement = theHTMLElementsFactory.create (
					'div',
					{
						className : 'TravelNotes-ModalBaseDialog-WaitHTMLElement  TravelNotes-Hidden'
					}				)
			)
		);
		this.addToDialog ( this.#waitHTMLElement );
	}

	/**
	Create the dialog footer
	*/

	#createFooterHTMLElement ( ) {
		const footerDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-ModalBaseDialog-FooterHTMLElement'
			}
		);
		this.addToDialog ( footerDiv );

		this.#okButton = theHTMLElementsFactory.create (
			'div',
			{
				textContent : this.options.firstButtonText || '🆗',
				className : 'TravelNotes-BaseDialog-Button'
			},
			footerDiv
		);
		this.#modalDialogOkButtonEL = new ModalDialogOkButtonEL ( this );
		this.#modalDialogOkButtonEL.addEventListeners ( this.#okButton );

		if ( this.options.secondButtonText ) {
			this.#secondButton = theHTMLElementsFactory.create (
				'div',
				{
					textContent : this.options.secondButtonText,
					className : 'TravelNotes-BaseDialog-Button'
				},
				footerDiv
			);
			this.#baseDialogCancelButtonEL = new BaseDialogCancelButtonEL ( this );
			this.#baseDialogCancelButtonEL.addEventListeners ( this.#secondButton );
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
		this.#createBackgroundHTMLElement ( );
		this.#createErrorHTMLElement ( );
		this.#createWaitHTMLElement ( );
		this.#createFooterHTMLElement ( );
	}

	/**
	The destructor. Remove and set to null the event listeners
	*/

	#destructor ( ) {
		this.#backgroundEL.removeEventListeners ( this.#backgroundHTMLElement );
		this.#backgroundEL = null;
		document.removeEventListener ( 'keydown', this.#modalDialogKeyboardKeydownEL, { capture : true } );
		this.#modalDialogKeyboardKeydownEL = null;
		this.#modalDialogOkButtonEL.removeEventListeners ( this.#okButton );
		this.#modalDialogOkButtonEL = null;
		if ( this.options.secondButtonText ) {
			this.#baseDialogCancelButtonEL.removeEventListeners ( this.#secondButton );
			this.#baseDialogCancelButtonEL = null;
		}
		document.body.removeChild ( this.#backgroundHTMLElement );
	}

	/**
	Build and show the dialog
	@param {function} onOk The onOk Promise handler
	@param {function} onError The onError Promise handler
	*/

	#show ( onOk, onError ) {
		this.#onPromiseOkFunction = onOk;
		this.#onPromiseErrorFunction = onError;
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
		document.body.appendChild ( this.#backgroundHTMLElement );
		this.addToBackground ( this.#backgroundHTMLElement );
		this.#modalDialogKeyboardKeydownEL = new ModalDialogKeyboardKeydownEL ( this );
		document.addEventListener ( 'keydown', this.#modalDialogKeyboardKeydownEL, { capture : true } );
		this.mover.centerDialog ( );
		return new Promise ( ( onOk, onError ) => this.#show ( onOk, onError ) );
	}

	/**
	Cancel button handler. Can be overloaded in the derived classes
	*/

	onCancel ( ) {
		this.#destructor ( );
		super.onCancel ( );
		this.#onPromiseErrorFunction ( 'Canceled by user' );
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
			this.#onPromiseOkFunction ( returnValue );
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
		this.#waitHTMLElement.classList.remove ( 'TravelNotes-Hidden' );
		this.#okButton.classList.add ( 'TravelNotes-Hidden' );
	}

	/**
	Hide the wait section of the dialog and show the okbutton
	*/

	hideWait ( ) {
		this.#waitHTMLElement.classList.add ( 'TravelNotes-Hidden' );
		this.#okButton.classList.remove ( 'TravelNotes-Hidden' );
	}

	/**
	Show the error section of the dialog
	@param {String} errorText The text to display in the error section
	*/

	showError ( errorText ) {
		this.#errorHTMLElement.textContent = '';
		theHTMLSanitizer.sanitizeToHtmlElement ( errorText, this.#errorHTMLElement );
		this.#errorHTMLElement.classList.remove ( 'TravelNotes-Hidden' );
	}

	/**
	Hide the error section of the dialog
	*/

	hideError ( ) {
		this.#errorHTMLElement.textContent = '';
		this.#errorHTMLElement.classList.add ( 'TravelNotes-Hidden' );
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