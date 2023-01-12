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

import PasswordDialog from '../passwordDialog/PasswordDialog.js';
import DataEncryptor from '../../core/lib/DataEncryptor.js';
import DataEncryptorHandlers from './DataEncryptorHandlers.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Click event listener for the saveApiKeys to secure file button
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class SaveToSecureFileButtonClickEL {

	/**
	A reference to the ApiKeys dialog
	@type {ApiKeysDialog}
	*/

	#apiKeysDialog;

	/**
	A DataEncryptorHandlers object used to encode / decode the ApiKeys
	@type {DataEncryptorHandlers}
	*/

	#dataEncryptorHandlers;

	/**
	The constructor
	@param {ApiKeysDialog} apiKeysDialog A reference to the ApiKeys dialog
	objects are stored
	*/

	constructor ( apiKeysDialog ) {
		Object.freeze ( this );
		this.#apiKeysDialog = apiKeysDialog;
		this.#dataEncryptorHandlers = new DataEncryptorHandlers ( this.#apiKeysDialog );
	}

	/**
	The destructor
	*/

	destructor ( ) {
		this.#dataEncryptorHandlers.destructor ( );
		this.#apiKeysDialog = null;
	}

	/**
	Event listener method
	@param {Event} clickEvent The event to handle
	*/

	handleEvent ( clickEvent ) {
		clickEvent.stopPropagation ( );
		if ( ! this.#apiKeysDialog.validateApiKeys ( ) ) {
			return;
		}
		this.#apiKeysDialog.showWait ( );

		this.#apiKeysDialog.keyboardELEnabled = false;
		new DataEncryptor ( ).encryptData (
			new window.TextEncoder ( ).encode ( this.#apiKeysDialog.apiKeysJSON ),
			data => this.#dataEncryptorHandlers.onOkEncrypt ( data ),
			( ) => this.#dataEncryptorHandlers.onErrorEncrypt ( ),
			new PasswordDialog ( true ).show ( )
		);
	}
}

export default SaveToSecureFileButtonClickEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */