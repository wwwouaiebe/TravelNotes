import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import theHTMLSanitizer from '../coreLib/HTMLSanitizer.js';
import { CancelDialogButtonClickEL } from '../baseDialog/BaseDialogEventListeners.js';
import {
	DialogKeyboardKeydownEL,
	OkButtonClickEL
} from '../baseDialog/ModalBaseDialogEventListeners.js';
import BaseDialog from '../baseDialog/BaseDialog.js';

class ModalBaseDialog extends BaseDialog {

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
	@type {CancelDialogButtonClickEL}
	*/

	#cancelDialogButtonClickEL;

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
	Create the error div
	*/

	#createErrorDiv ( ) {
		this.#errorDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-ErrorDiv TravelNotes-Hidden'
			},
			this.container
		);
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
					},
					this.container
				)
			)
		);
	}

	/**
	Create the dialog footer
	*/

	#createFooterDiv ( ) {
		const footerDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-FooterDiv'
			},
			this.container
		);

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
			this.#cancelDialogButtonClickEL = new CancelDialogButtonClickEL ( this );
			this.#secondButton.addEventListener ( 'click',	this.#cancelDialogButtonClickEL, false	);
		}
		else {
			this.#secondButton = null;
		}

		this.footerHTMLElements.forEach (
			footerHTMLElement => footerDiv.appendChild ( footerHTMLElement )
		);
	}

	#createHTML ( ) {
		this.#createErrorDiv ( );
		this.#createWaitDiv ( );
		this.#createFooterDiv ( );
	}

	#ModalBaseDialogDestructor ( ) {
		document.removeEventListener ( 'keydown', this.#dialogKeyboardKeydownEL, { capture : true } );
		this.#dialogKeyboardKeydownEL = null;

		this.#okButton.removeEventListener ( 'click', this.#okButtonClickEL, false );
		this.#okButtonClickEL = null;
		if ( this.options.secondButtonText ) {
			this.#secondButton.removeEventListener ( 'click', this.#cancelDialogButtonClickEL, false	);
		}
	}

	/**
	Build and show the dialog
	@param {function} onPromiseOkFct The onOk Promise handler
	@param {function} onPromiseErrorFct The onError Promise handler
	*/

	#show ( onPromiseOkFct, onPromiseErrorFct ) {
		this.#onPromiseOkFct = onPromiseOkFct;
		this.#onPromiseErrorFct = onPromiseErrorFct;
	}

	constructor ( options ) {
		super ( options );
		this.#keyboardELEnabled = true;
	}

	show ( ) {
		super.show ( );
		this.#createHTML ( );
		this.#dialogKeyboardKeydownEL = new DialogKeyboardKeydownEL ( this );
		document.addEventListener ( 'keydown', this.#dialogKeyboardKeydownEL, { capture : true } );
		this.centerDialog ( );
		return new Promise ( ( onOk, onError ) => this.#show ( onOk, onError ) );
	}

	/**
	Cancel button handler. Can be overloaded in the derived classes
	*/

	onCancel ( ) {
		this.#ModalBaseDialogDestructor ( );
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
			super.onOk ( );
			this.#onPromiseOkFct ( returnValue );
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
	A flag to avoid all dialogs close when using the esc or enter keys
	@type {Boolean}
	*/

	get keyboardELEnabled ( ) { return this.#keyboardELEnabled; }

	set keyboardELEnabled ( keyboardELEnabled ) { this.#keyboardELEnabled = keyboardELEnabled; }
}

export default ModalBaseDialog;