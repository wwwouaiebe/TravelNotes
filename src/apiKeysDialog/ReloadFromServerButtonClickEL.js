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
	- v 4.0.0:
		- Issue ♯48 : Review the dialogs
Doc reviewed 20210914
Tests ...
*/

import PasswordDialog from '../passwordDialog/PasswordDialog.js';
import DataEncryptor from '../coreLib/DataEncryptor.js';
import DataEncryptorHandlers from '../apiKeysDialog/DataEncryptorHandlers.js';

import { ZERO, ONE, HTTP_STATUS_OK } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
click event listener for the reload keys from server file button
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ReloadFromServerButtonClickEL {

	/**
	A reference to the ApiKeys dialog
	@type {ApiKeysDialog}
	*/

	#apiKeysDialog;

	/**
	The constructor
	@param {ApiKeysDialog} apiKeysDialog A reference to the ApiKeys dialog
	*/

	constructor ( apiKeysDialog ) {
		Object.freeze ( this );
		this.#apiKeysDialog = apiKeysDialog;
	}

	/**
	Event listener method
	@param {Event} clickEvent The event to handle
	*/

	handleEvent ( clickEvent ) {
		clickEvent.stopPropagation ( );
		this.#apiKeysDialog.hideError ( );
		this.#apiKeysDialog.showWait ( );
		this.#apiKeysDialog.keyboardELEnabled = false;

		fetch ( window.location.href.substring ( ZERO, window.location.href.lastIndexOf ( '/' ) + ONE ) + 'ApiKeys' )
			.then (
				response => {
					if ( HTTP_STATUS_OK === response.status && response.ok ) {
						response.arrayBuffer ( ).then (
							data => {
								const dataEncryptorHandlers = new DataEncryptorHandlers ( this.#apiKeysDialog );
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
						new DataEncryptorHandlers ( this.#apiKeysDialog ).onErrorDecrypt (
							new Error ( 'Invalid http status' )
						);
					}
				}
			)
			.catch (
				err => {
					new DataEncryptorHandlers ( this.#apiKeysDialog ).onErrorDecrypt ( err );
					if ( err instanceof Error ) {
						console.error ( err );
					}
				}
			);
	}
}

export default ReloadFromServerButtonClickEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */