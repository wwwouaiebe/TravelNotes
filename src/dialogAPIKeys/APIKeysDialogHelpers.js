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
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210914
Tests ...
*/

import theUtilities from '../UILib/Utilities.js';
import theTranslator from '../UILib/Translator.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
handlers for DataEncryptor
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class DataEncryptorHandlers {

	/**
	A reference to the API keys dialog
	@type {APIKeysDialog}
	*/

	#APIKeysDialog;

	/**
	The constructor
	@param {APIKeysDialog} APIKeysDialog A reference to the API keys dialog
	*/

	constructor ( APIKeysDialog ) {
		this.#APIKeysDialog = APIKeysDialog;
		Object.freeze ( this );
	}

	/**
	onErrorDecrypt handler for the DataEncryptor
	@param {Error|String} err The error to handle
	*/

	onErrorDecrypt ( err ) {
		this.#APIKeysDialog.hideWait ( );
		this.#APIKeysDialog.keyboardELEnabled = true;
		if ( err && 'Canceled by user' !== err ) {
			this.#APIKeysDialog.showError (
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
			this.#APIKeysDialog.addAPIKeys (
				JSON.parse ( new TextDecoder ( ).decode ( data ) )
			);
		}
		catch ( err ) {
			this.onErrorDecrypt ( err );
			return;
		}
		this.#APIKeysDialog.hideWait ( );
		this.#APIKeysDialog.hideError ( );
		this.#APIKeysDialog.keyboardELEnabled = true;
	}

	/**
	onOkEncrypt handler for the DataEncryptor
	@param {Uint8Array} data The encrypted data to handle
	*/

	onOkEncrypt ( data ) {
		this.#APIKeysDialog.hideError ( );
		this.#APIKeysDialog.hideWait ( );
		theUtilities.saveFile ( 'APIKeys', data );
		this.#APIKeysDialog.keyboardELEnabled = true;
	}

	/**
	onErrorEncrypt handler for the DataEncryptor
	*/

	onErrorEncrypt ( ) {
		this.#APIKeysDialog.showError (
			theTranslator.getText ( 'DataEncryptorHandlers - An error occurs when saving the keys' )
		);
		this.#APIKeysDialog.hideWait ( );
		this.#APIKeysDialog.keyboardELEnabled = true;
	}

}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
shared methods for save to file buttons event listeners
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class SaveAPIKeysHelper {

	/**
	A reference to the Map where the APIKeysDialogKeyControl objects are stored
	@type {Map.<APIKeysDialogKeyControl>}
	*/

	#APIKeysControls;

	/**
	The constructor
	@param {Map.<APIKeysDialogKeyControl>} APIKeysControls A reference to the Map where the APIKeysDialogKeyControl
	objects are stored
	*/

	constructor ( APIKeysControls ) {
		this.#APIKeysControls = APIKeysControls;
		Object.freeze ( this );
	}

	/**
	Transform the APIKeysControls value into a JSON string
	*/

	getAPIKeysJsonString ( ) {
		const APIKeys = [];
		this.#APIKeysControls.forEach (
			APIKeyControl => {
				APIKeys.push (
					{
						providerName : APIKeyControl.providerName,
						providerKey : APIKeyControl.providerKey
					}
				);
			}
		);
		return JSON.stringify ( APIKeys );
	}

}

export { DataEncryptorHandlers, SaveAPIKeysHelper };

/* --- End of file --------------------------------------------------------------------------------------------------------- */