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

import PasswordDialog from '../passwordDialog/PasswordDialog.js';
import DataEncryptor from '../../core/lib/DataEncryptor.js';
import DataEncryptorHandlers from './DataEncryptorHandlers.js';
import { ZERO } from '../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Change event listener for the open secure file input
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class OpenSecureFileChangeEL {

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
	@param {Event} changeEvent The event to handle
	*/

	handleEvent ( changeEvent ) {
		changeEvent.stopPropagation ( );
		this.#apiKeysDialog.showWait ( );
		this.#apiKeysDialog.keyboardELEnabled = false;
		const fileReader = new FileReader ( );
		fileReader.onload = ( ) => {
			new DataEncryptor ( ).decryptData (
				fileReader.result,
				data => { this.#dataEncryptorHandlers.onOkDecrypt ( data ); },
				err => { this.#dataEncryptorHandlers.onErrorDecrypt ( err ); },
				new PasswordDialog ( false ).show ( )
			);
		};
		fileReader.readAsArrayBuffer ( changeEvent.target.files [ ZERO ] );
	}
}

export default OpenSecureFileChangeEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */