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
		- Created
Doc reviewed ...
Tests ...
*/

import DialogControl from '../baseDialog/DialogControl.js';
import { APIKeyDeletedEL } from '../apiKeysDialog/APIKeysDialogEventListeners.js';
import APIKeyControlRow from '../apiKeysDialog/APIKeyControlRow.js';
import { APIKey } from '../coreLib/Containers.js';

import { ZERO } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the APIKeys control of the APIKeysDialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ApiKeysControl extends DialogControl {

	/**
	A map to store the rows of the APIKeyControl object
	@type {Map}
	*/

	#apiKeysControlRowsMap;

	/**
	Api key deleted event listener
	@type {APIKeyDeletedEL}
	*/

	#onAPIKeyDeletedEventListener;

	/**
	The constructor
	*/

	constructor ( ) {
		super ( );
		this.#apiKeysControlRowsMap = new Map ( );
		this.#onAPIKeyDeletedEventListener = new APIKeyDeletedEL ( this, this.#apiKeysControlRowsMap );
		this.HTMLElement.addEventListener ( 'apikeydeleted', this.#onAPIKeyDeletedEventListener, false );
	}

	/**
	The destructor. Remove event listener and clean the map
	*/

	destructor ( ) {
		this.HTMLElement.removeEventListener ( 'apikeydeleted', this.#onAPIKeyDeletedEventListener, false );
		this.#onAPIKeyDeletedEventListener = null;
		this.#apiKeysControlRowsMap.clear ( );
	}

	/**
	Verify that the control don't have empty provider name or provider key
	Verify that the control don't have duplicate provider name
	@return {Object} an object with rhe validation results
	*/

	haveEmptyOrDuplicateValues ( ) {
		let haveEmpty = false;
		const providersNames = [];
		this.#apiKeysControlRowsMap.forEach (
			apiKeyControl => {
				haveEmpty =
                    haveEmpty ||
                    '' === apiKeyControl.providerName
                    ||
                    '' === apiKeyControl.providerKey;
				providersNames.push ( apiKeyControl.providerName );
			}
		);
		let haveDuplicate = false;
		providersNames.forEach (
			providerName => {
				haveDuplicate =
					haveDuplicate ||
					providersNames.indexOf ( providerName ) !== providersNames.lastIndexOf ( providerName );
			}
		);

		return { haveEmpty : haveEmpty, haveDuplicate : haveDuplicate };
	}

	/**
	Add an array of APIKeys to the control.
	@param {Array.<APIKey>} apiKeys An array with the APIKeys to add
	*/

	addAPIKeys ( apiKeys ) {
		this.#apiKeysControlRowsMap.clear ( );
		apiKeys.forEach (
			apiKey => {
				const apiKeyControl = new APIKeyControlRow ( apiKey );
				this.#apiKeysControlRowsMap.set ( apiKeyControl.objId, apiKeyControl );
			}
		);
		this.refreshAPIKeys ( );
	}

	/**
	Add a new APIKey to the control.
	*/

	newApiKey ( ) {
		const apiKey = new APIKey ( );
		const apiKeyControlRow = new APIKeyControlRow ( apiKey );
		this.#apiKeysControlRowsMap.set ( apiKeyControlRow.objId, apiKeyControlRow );
		this.refreshAPIKeys ( );
	}

	/**
	Remove all elements from the #apiKeysControl and add the existing APIKeys
	*/

	refreshAPIKeys ( ) {
		while ( this.HTMLElement.firstChild ) {
			this.HTMLElement.removeChild ( this.HTMLElement.firstChild );
		}
		this.#apiKeysControlRowsMap.forEach (
			apiKeyControl => { this.HTMLElement.appendChild ( apiKeyControl.HTMLElements [ ZERO ] ); }
		);
	}

	/**
	Get an array with the APIKeys in the control
	@type {Array.<APIKey>}
	*/

	get apiKeys ( ) {
		const apiKeys = [];
		this.#apiKeysControlRowsMap.forEach (
			apiKeyControl => apiKeys.push ( apiKeyControl.apiKey )
		);
		return apiKeys;
	}

	/**
	Get a JSON string with the APIKeys in the control
	@type {String}
	*/

	get apiKeysJSON ( ) {
		const apiKeys = [];
		this.#apiKeysControlRowsMap.forEach (
			apiKeyControl => apiKeys.push ( apiKeyControl.apiKey.jsonObject )
		);
		return JSON.stringify ( apiKeys );

	}
}

export default ApiKeysControl;

/* --- End of file --------------------------------------------------------------------------------------------------------- */