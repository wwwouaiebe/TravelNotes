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
import OpenSecureFileChangeEL from './OpenSecureFileChangeEL.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
click event listener for the restore keys from secure file button
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class RestoreFromSecureFileButtonClickEL {

	/**
	A reference to the ApiKeys dialog
	@type {ApiKeysDialog}
	*/

	#apiKeysDialog;

	/**
	The OpenSecureFileChangeEL for theUtilities.openFile ( ) method
	@type {OpenSecureFileChangeEL}
	*/

	#openSecureFileChangeEL;

	/**
	The constructor
	@param {ApiKeysDialog} apiKeysDialog A reference to the ApiKeys dialog
	*/

	constructor ( apiKeysDialog ) {
		Object.freeze ( this );
		this.#apiKeysDialog = apiKeysDialog;
		this.#openSecureFileChangeEL = new OpenSecureFileChangeEL ( this.#apiKeysDialog );
	}

	/**
	The destructor
	*/

	destructor ( ) {
		this.#apiKeysDialog = null;
		this.#openSecureFileChangeEL.destructor ( );
	}

	/**
	Event listener method
	@param {Event} clickEvent The event to handle
	*/

	handleEvent ( clickEvent ) {
		clickEvent.stopPropagation ( );
		this.#apiKeysDialog.hideError ( );
		theUtilities.openFile (	this.#openSecureFileChangeEL );
	}
}

export default RestoreFromSecureFileButtonClickEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */