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

import theUtilities from '../../core/uiLib/Utilities.js';
import theTranslator from '../../core/uiLib/Translator.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
handlers for DataEncryptor
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class DataEncryptorHandlers {

	/**
	A reference to the ApiKeys dialog
	@type {ApiKeysDialog}
	*/

	#ApiKeysDialog;

	/**
	The constructor
	@param {ApiKeysDialog} ApiKeysDialog A reference to the ApiKeys dialog
	*/

	constructor ( ApiKeysDialog ) {
		this.#ApiKeysDialog = ApiKeysDialog;
		Object.freeze ( this );
	}

	/**
	The destructor
	*/

	destructor ( ) {
		this.#ApiKeysDialog = null;
	}

	/**
	onErrorDecrypt handler for the DataEncryptor
	@param {Error|String} err The error to handle
	*/

	onErrorDecrypt ( err ) {
		this.#ApiKeysDialog.hideWait ( );
		this.#ApiKeysDialog.keyboardELEnabled = true;
		if ( err && 'Canceled by user' !== err ) {
			this.#ApiKeysDialog.showError (
				theTranslator.getText ( 'DataEncryptorHandlers - An error occurs when reading the file' )
			);
		}
	}

	/**
	onOkDecrypt handler for the DataEncryptor
	@param {Uint8Array} data The decrypted data to handle
	*/

	onOkDecrypt ( data ) {
		try {
			this.#ApiKeysDialog.addApiKeys (
				JSON.parse ( new TextDecoder ( ).decode ( data ) )
			);
		}
		catch ( err ) {
			this.onErrorDecrypt ( err );
			return;
		}
		this.#ApiKeysDialog.hideWait ( );
		this.#ApiKeysDialog.hideError ( );
		this.#ApiKeysDialog.keyboardELEnabled = true;
	}

	/**
	onOkEncrypt handler for the DataEncryptor
	@param {Uint8Array} data The encrypted data to handle
	*/

	onOkEncrypt ( data ) {
		this.#ApiKeysDialog.hideError ( );
		this.#ApiKeysDialog.hideWait ( );
		theUtilities.saveFile ( 'ApiKeys', data );
		this.#ApiKeysDialog.keyboardELEnabled = true;
	}

	/**
	onErrorEncrypt handler for the DataEncryptor
	*/

	onErrorEncrypt ( ) {
		this.#ApiKeysDialog.showError (
			theTranslator.getText ( 'DataEncryptorHandlers - An error occurs when saving the keys' )
		);
		this.#ApiKeysDialog.hideWait ( );
		this.#ApiKeysDialog.keyboardELEnabled = true;
	}

}

export default DataEncryptorHandlers;

/* --- End of file --------------------------------------------------------------------------------------------------------- */