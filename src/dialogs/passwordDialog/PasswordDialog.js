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

import theTranslator from '../../core/uiLib/Translator.js';
import ModalBaseDialog from '../baseDialog/ModalBaseDialog.js';
import PasswordControl from '../../controls/passwordControl/PasswordControl.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the password dialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class PasswordDialog extends ModalBaseDialog {

	/**
	the password control
	@type {PasswordControl}
	*/

	#passwordControl;

	/**
	the verifyPassword constructor parameter
	@type {Boolean}
	*/

	#verifyPassword;

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
	}

	/**
	Remove event listeners
	*/

	#destructor ( ) {
		this.#passwordControl.destructor ( );
	}

	/**
	Create all the controls needed for the dialog.
	Overload of the base class createContentHTML
	*/

	createContentHTML ( ) {
		this.#passwordControl = new PasswordControl ( );
	}

	/**
	Overload of the ModalBaseDialog.show ( ) method.
	*/

	show ( ) {
		const showPromise = super.show ( );
		this.#passwordControl.focus ( );
		return showPromise;
	}

	/**
	Overload of the BaseDialog.canClose ( ) method.
	@return {Boolean} true when the password is correct, false otherwise
	*/

	canClose ( ) {
		this.hideError ( );
		if ( this.#verifyPassword ) {
			if (
				( this.#passwordControl.value.length < PasswordDialog.#PSWD_MIN_LENGTH )
				||
				! this.#passwordControl.value.match ( /[0-9]+/ )
				||
				! this.#passwordControl.value.match ( /[a-z]+/ )
				||
				! this.#passwordControl.value.match ( /[A-Z]+/ )
				||
				! this.#passwordControl.value.match ( /[^0-9a-zA-Z]/ )
			) {
				this.showError (
					'<p>' + theTranslator.getText ( 'PasswordDialog - Password rules1' ) + '</p><ul>' +
					'<li>' + theTranslator.getText ( 'PasswordDialog - Password rules2' ) + '</li>' +
					'<li>' + theTranslator.getText ( 'PasswordDialog - Password rules3' ) + '</li>' +
					'<li>' + theTranslator.getText ( 'PasswordDialog - Password rules4' ) + '</li>' +
					'<li>' + theTranslator.getText ( 'PasswordDialog - Password rules5' ) + '</li>' +
					'<li>' + theTranslator.getText ( 'PasswordDialog - Password rules6' ) + '</li></ul>'
				);
				this.#passwordControl.focus ( );
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
		if ( super.onOk ( new window.TextEncoder ( ).encode ( this.#passwordControl.value ) ) ) {
			this.#destructor ( );
		}
	}

	/**
	An array with the HTMLElements that have to be added in the content of the dialog.
	@type {Array.<HTMLElement>}
	*/

	get contentHTMLElements ( ) { return [ this.#passwordControl.controlHTMLElement ]; }

	/**
	The dialog title. Overload of the BaseDialog.title property
	@type {String}
	*/

	get title ( ) { return theTranslator.getText ( 'PasswordDialog - password' ); }

}

export default PasswordDialog;

/* --- End of file --------------------------------------------------------------------------------------------------------- */