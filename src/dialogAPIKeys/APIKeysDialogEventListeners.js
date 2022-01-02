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
	- v3.2.0:
		- Issue ♯9 : String.substr ( ) is deprecated... Replace...
Doc reviewed 20210914
Tests ...
*/

import PasswordDialog from '../dialogPassword/PasswordDialog.js';
import DataEncryptor from '../coreLib/DataEncryptor.js';
import theUtilities from '../UILib/Utilities.js';
import APIKeysDialogKeyControl from '../dialogAPIKeys/APIKeysDialogKeyControl.js';
import { DataEncryptorHandlers, SaveAPIKeysHelper } from '../dialogAPIKeys/APIKeysDialogHelpers.js';
import { APIKey } from '../coreLib/Containers.js';

import { ZERO, ONE, HTTP_STATUS_OK } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Event listener for the apikeydeleted event
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class APIKeyDeletedEL {

	/**
	A reference to the API keys dialog
	@type {APIKeysDialog}
	*/

	#APIKeysDialog;

	/**
	A reference to the Map where the APIKeysDialogKeyControl objects are stored
	@type {Map.<APIKeysDialogKeyControl>}
	*/

	#APIKeysControls;

	/**
	The constructor
	@param {APIKeysDialog} APIKeysDialog A reference to the API keys dialog
	@param {Map.<APIKeysDialogKeyControl>} APIKeysControls A reference to the Map where the APIKeysDialogKeyControl
	objects are stored
	*/

	constructor ( APIKeysDialog, APIKeysControls ) {
		Object.freeze ( this );
		this.#APIKeysDialog = APIKeysDialog;
		this.#APIKeysControls = APIKeysControls;
	}

	/**
	Event listener method
	@param {Event} ApiKeyDeletedEvent The event to handle
	*/

	handleEvent ( ApiKeyDeletedEvent ) {
		ApiKeyDeletedEvent.stopPropagation ( );
		this.#APIKeysControls.delete ( ApiKeyDeletedEvent.data.objId );
		this.#APIKeysDialog.refreshAPIKeys ( );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
change event listener for the open unsecure file input
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class OpenUnsecureFileChangeEL {

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
		Object.freeze ( this );
		this.#APIKeysDialog = APIKeysDialog;
	}

	/**
	Event listener method
	@param {Event} changeEvent The event to handle
	*/

	handleEvent ( changeEvent ) {
		changeEvent.stopPropagation ( );
		const fileReader = new FileReader ( );
		fileReader.onload = ( ) => {
			try {
				this.#APIKeysDialog.addAPIKeys (
					JSON.parse ( fileReader.result )
				);
			}
			catch ( err ) {
				this.#APIKeysDialog.showError ( err.message );
				if ( err instanceof Error ) {
					console.error ( err );
				}
			}
		};
		fileReader.readAsText ( changeEvent.target.files [ ZERO ] );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
click event listener for the restore keys from unsecure file button
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class RestoreFromUnsecureFileButtonClickEL {

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
		Object.freeze ( this );
		this.#APIKeysDialog = APIKeysDialog;
	}

	/**
	Event listener method
	@param {Event} clickEvent The event to handle
	*/

	handleEvent ( clickEvent ) {
		clickEvent.stopPropagation ( );
		this.#APIKeysDialog.hideError ( );
		theUtilities.openFile (	new OpenUnsecureFileChangeEL ( this.#APIKeysDialog ), '.json' );

	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
click event listener for the reload keys from server file button
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ReloadFromServerButtonClickEL {

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
		Object.freeze ( this );
		this.#APIKeysDialog = APIKeysDialog;
	}

	/**
	Event listener method
	@param {Event} clickEvent The event to handle
	*/

	handleEvent ( clickEvent ) {
		clickEvent.stopPropagation ( );
		this.#APIKeysDialog.hideError ( );
		this.#APIKeysDialog.showWait ( );
		this.#APIKeysDialog.keyboardELEnabled = false;

		fetch ( window.location.href.substring ( ZERO, window.location.href.lastIndexOf ( '/' ) + ONE ) + 'APIKeys' )
			.then (
				response => {
					if ( HTTP_STATUS_OK === response.status && response.ok ) {
						response.arrayBuffer ( ).then (
							data => {
								const dataEncryptorHandlers = new DataEncryptorHandlers ( this.#APIKeysDialog );
								new DataEncryptor ( ).decryptData (
									data,
									tmpData => { dataEncryptorHandlers.onOkDecrypt ( tmpData ); },
									err => { dataEncryptorHandlers.onErrorDecrypt ( err ); },
									new PasswordDialog ( false ).show ( )
								);
							}
						);
					}
					else {
						new DataEncryptorHandlers ( this.#APIKeysDialog ).onErrorDecrypt (
							new Error ( 'Invalid http status' )
						);
					}
				}
			)
			.catch (
				err => {
					new DataEncryptorHandlers ( this.#APIKeysDialog ).onErrorDecrypt ( err );
					if ( err instanceof Error ) {
						console.error ( err );
					}
				}
			);
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Change event listener for the open secure file input
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class OpenSecureFileChangeEL {

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
		Object.freeze ( this );
		this.#APIKeysDialog = APIKeysDialog;
	}

	/**
	Event listener method
	@param {Event} changeEvent The event to handle
	*/

	handleEvent ( changeEvent ) {
		changeEvent.stopPropagation ( );
		this.#APIKeysDialog.showWait ( );
		this.#APIKeysDialog.keyboardELEnabled = false;
		const fileReader = new FileReader ( );
		fileReader.onload = ( ) => {
			const dataEncryptorHandlers = new DataEncryptorHandlers ( this.#APIKeysDialog );
			new DataEncryptor ( ).decryptData (
				fileReader.result,
				data => { dataEncryptorHandlers.onOkDecrypt ( data ); },
				err => { dataEncryptorHandlers.onErrorDecrypt ( err ); },
				new PasswordDialog ( false ).show ( )
			);
		};
		fileReader.readAsArrayBuffer ( changeEvent.target.files [ ZERO ] );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
click event listener for the restore keys from secure file button
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class RestoreFromSecureFileButtonClickEL {

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
		Object.freeze ( this );
		this.#APIKeysDialog = APIKeysDialog;
	}

	/**
	Event listener method
	@param {Event} clickEvent The event to handle
	*/

	handleEvent ( clickEvent ) {
		clickEvent.stopPropagation ( );
		this.#APIKeysDialog.hideError ( );
		theUtilities.openFile (	new OpenSecureFileChangeEL ( this.#APIKeysDialog ) );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Click event listener for the saveAPIKeys to secure file button
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class SaveToSecureFileButtonClickEL {

	/**
	A reference to the API keys dialog
	@type {APIKeysDialog}
	*/

	#APIKeysDialog;

	/**
	A reference to the Map where the APIKeysDialogKeyControl objects are stored
	@type {Map.<APIKeysDialogKeyControl>}
	*/

	#APIKeysControls;

	/**
	The constructor
	@param {APIKeysDialog} APIKeysDialog A reference to the API keys dialog
	@param {Map.<APIKeysDialogKeyControl>} APIKeysControls A reference to the Map where the APIKeysDialogKeyControl
	objects are stored
	*/

	constructor ( APIKeysDialog, APIKeysControls ) {
		Object.freeze ( this );
		this.#APIKeysDialog = APIKeysDialog;
		this.#APIKeysControls = APIKeysControls;
	}

	/**
	Event listener method
	@param {Event} clickEvent The event to handle
	*/

	handleEvent ( clickEvent ) {
		clickEvent.stopPropagation ( );
		if ( ! this.#APIKeysDialog.validateAPIKeys ( ) ) {
			return;
		}
		this.#APIKeysDialog.showWait ( );

		this.#APIKeysDialog.keyboardELEnabled = false;
		const dataEncryptorHandlers = new DataEncryptorHandlers ( this.#APIKeysDialog );
		new DataEncryptor ( ).encryptData (
			new window.TextEncoder ( ).encode (
				new SaveAPIKeysHelper ( this.#APIKeysControls ).getAPIKeysJsonString ( )
			),
			data => dataEncryptorHandlers.onOkEncrypt ( data ),
			( ) => dataEncryptorHandlers.onErrorEncrypt ( ),
			new PasswordDialog ( true ).show ( )
		);
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Click event listener for the saveAPIKeys to unsecure file button
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class SaveToUnsecureFileButtonClickEL {

	/**
	A reference to the API keys dialog
	@type {APIKeysDialog}
	*/

	#APIKeysDialog;

	/**
	A reference to the Map where the APIKeysDialogKeyControl objects are stored
	@type {Map.<APIKeysDialogKeyControl>}
	*/

	#APIKeysControls;

	/**
	The constructor
	@param {APIKeysDialog} APIKeysDialog A reference to the API keys dialog
	@param {Map.<APIKeysDialogKeyControl>} APIKeysControls A reference to the Map where the APIKeysDialogKeyControl
	objects are stored
	*/

	constructor ( APIKeysDialog, APIKeysControls ) {
		Object.freeze ( this );
		this.#APIKeysDialog = APIKeysDialog;
		this.#APIKeysControls = APIKeysControls;
	}

	/**
	Event listener method
	@param {Event} clickEvent The event to handle
	*/

	handleEvent ( clickEvent ) {
		clickEvent.stopPropagation ( );
		if ( ! this.#APIKeysDialog.validateAPIKeys ( ) ) {
			return;
		}
		theUtilities.saveFile (
			'APIKeys.json',
			new SaveAPIKeysHelper ( this.#APIKeysControls ).getAPIKeysJsonString ( ),
			'application/json'
		);
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Click event listener for the add new APIKey button
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class NewAPIKeyButtonClickEL {

	/**
	A reference to the API keys dialog
	@type {APIKeysDialog}
	*/

	#APIKeysDialog;

	/**
	A reference to the Map where the APIKeysDialogKeyControl objects are stored
	@type {Map.<APIKeysDialogKeyControl>}
	*/

	#APIKeysControls;

	/**
	The constructor
	@param {APIKeysDialog} APIKeysDialog A reference to the API keys dialog
	@param {Map.<APIKeysDialogKeyControl>} APIKeysControls A reference to the Map where the APIKeysDialogKeyControl
	objects are stored
	*/

	constructor ( APIKeysDialog, APIKeysControls ) {
		Object.freeze ( this );
		this.#APIKeysDialog = APIKeysDialog;
		this.#APIKeysControls = APIKeysControls;
	}

	/**
	Event listener method
	@param {Event} clickEvent The event to handle
	*/

	handleEvent ( clickEvent ) {
		clickEvent.stopPropagation ( );
		const apiKey = new APIKey ( );
		const APIKeyControl = new APIKeysDialogKeyControl ( apiKey );
		this.#APIKeysControls.set ( APIKeyControl.objId, APIKeyControl );
		this.#APIKeysDialog.refreshAPIKeys ( );
	}
}

export {
	APIKeyDeletedEL,
	RestoreFromUnsecureFileButtonClickEL,
	ReloadFromServerButtonClickEL,
	RestoreFromSecureFileButtonClickEL,
	SaveToSecureFileButtonClickEL,
	SaveToUnsecureFileButtonClickEL,
	NewAPIKeyButtonClickEL
};

/* --- End of file --------------------------------------------------------------------------------------------------------- */