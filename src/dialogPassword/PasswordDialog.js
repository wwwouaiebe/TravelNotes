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
	- v1.6.0:
		- created
	- v1.11.0:
		- Issue ♯113 : When more than one dialog is opened, using thr Esc or Return key close all the dialogs
	- v2.0.0:
		- Issue ♯137 : Remove html tags from json files
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210914
Tests ...
*/

import theTranslator from '../UILib/Translator.js';
import BaseDialog from '../dialogBase/BaseDialog.js';
import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import { EyeMouseDownEL, EyeMouseUpEL } from '../dialogPassword/PasswordDialogEventListeners.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the password dialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class PasswordDialog extends BaseDialog {

	/**
	The password html div
	@type {HTMLElement}
	*/

	#passwordDiv;

	/**
	the password html input
	@type {HTMLElement}
	*/

	#passwordInput;

	/** the eye html span
	@type {HTMLElement}
	*/

	#eyeSpan;

	/**
	the verifyPassword constructor parameter
	@type {Boolean}
	*/

	#verifyPassword;

	/**
	mouseDown event listener
	@type {EyeMouseDownEL}
	*/

	#eyeMouseDownEL;

	/**
	mouseup event listener
	@type {EyeMouseUpEL}
	*/

	#eyeMouseUpEL;

	/**
	The minimal length for the password
	@type {String}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #PSWD_MIN_LENGTH ( ) { return 12; }

	/**
	The constructor
	@param {Boolean} verifyPassword When true the password must be conform to the password rules
	*/

	constructor ( verifyPassword ) {
		super ( );
		this.#verifyPassword = verifyPassword;

		// Adding HTMLElements
		this.#passwordDiv = theHTMLElementsFactory.create ( 'div', { id : 'TravelNotes-PasswordDialog-PasswordDiv' } );
		this.#passwordInput = theHTMLElementsFactory.create ( 'input', { type : 'password' }, this.#passwordDiv );
		this.#eyeSpan = theHTMLElementsFactory.create (
			'span',
			{
				id : 'TravelNotes-PasswordDialog-EyeSpan',
				textContent : '👁️'
			},
			this.#passwordDiv
		);

		// Event listeners
		this.#eyeMouseDownEL = new EyeMouseDownEL ( this.#passwordInput );
		this.#eyeMouseUpEL = new EyeMouseUpEL ( this.#passwordInput );
		this.#eyeSpan.addEventListener ( 'mousedown', this.#eyeMouseDownEL, false );
		this.#eyeSpan.addEventListener ( 'mouseup', this.#eyeMouseUpEL,	false );
	}

	/**
	Remove event listeners
	*/

	#destructor ( ) {
		this.#eyeSpan.removeEventListener ( 'mousedown', this.#eyeMouseDownEL, false );
		this.#eyeSpan.removeEventListener ( 'mouseup', this.#eyeMouseUpEL,	false );
		this.#eyeMouseDownEL = null;
		this.#eyeMouseUpEL = null;

	}

	/**
	Overload of the BaseDialog.canClose ( ) method.
	@return {Boolean} true when the password is correct, false otherwise
	*/

	canClose ( ) {
		this.hideError ( );
		if ( this.#verifyPassword ) {
			if (
				( this.#passwordInput.value.length < PasswordDialog.#PSWD_MIN_LENGTH )
				||
				! this.#passwordInput.value.match ( /[0-9]+/ )
				||
				! this.#passwordInput.value.match ( /[a-z]+/ )
				||
				! this.#passwordInput.value.match ( /[A-Z]+/ )
				||
				! this.#passwordInput.value.match ( /[^0-9a-zA-Z]/ )
			) {
				this.showError (
					'<p>' + theTranslator.getText ( 'PasswordDialog - Password rules1' ) + '</p><ul>' +
					'<li>' + theTranslator.getText ( 'PasswordDialog - Password rules2' ) + '</li>' +
					'<li>' + theTranslator.getText ( 'PasswordDialog - Password rules3' ) + '</li>' +
					'<li>' + theTranslator.getText ( 'PasswordDialog - Password rules4' ) + '</li>' +
					'<li>' + theTranslator.getText ( 'PasswordDialog - Password rules5' ) + '</li>' +
					'<li>' + theTranslator.getText ( 'PasswordDialog - Password rules6' ) + '</li></ul>'
				);
				this.#passwordInput.focus ( );
				return false;
			}
		}
		return true;
	}

	/**
	Overload of the BaseDialog.onCancel ( ) method.
	*/

	onCancel ( ) {
		this.#destructor ( );
		super.onCancel ( );
	}

	/**
	Overload of the BaseDialog.onOk ( ) method.
	*/

	onOk ( ) {
		this.#destructor ( );
		super.onOk ( new window.TextEncoder ( ).encode ( this.#passwordInput.value ) );
	}

	/**
	Overload of the BaseDialog.onShow ( ) method.
	*/

	onShow ( ) {
		this.#passwordInput.focus ( );
	}

	/**
	An array with the HTMLElements that have to be added in the content of the dialog.
	@type {Array.<HTMLElement>}
	*/

	get contentHTMLElements ( ) { return [ this.#passwordDiv ]; }

	/**
	The dialog title. Overload of the BaseDialog.title property
	@type {String}
	*/

	get title ( ) { return theTranslator.getText ( 'PasswordDialog - password' ); }

}

export default PasswordDialog;

/* --- End of file --------------------------------------------------------------------------------------------------------- */