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
Doc reviewed 20220827
Tests ...
*/

import BaseControl from '../../controls/baseControl/BaseControl.js';
import ApiKeyControlRow from '../apiKeysDialog/ApiKeyControlRow.js';
import ApiKey from '../../containers/ApiKey.js';
import DeleteApiKeyButtonClickEL from '../apiKeysDialog/DeleteApiKeyButtonClickEL.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the ApiKeys control of the ApiKeysDialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ApiKeysControl extends BaseControl {

	/**
	A map to store the rows of the ApiKeyControl object
	@type {Map}
	*/

	#apiKeysControlRowsMap;

	/**
	The DeleteApiKeyButtonClickEL for the delete buttons
	@type {deleteApiKeyButtonClickEL}
	*/

	#deleteApiKeyButtonClickEL;

	/**
	The constructor
	*/

	constructor ( ) {
		super ( );
		this.#apiKeysControlRowsMap = new Map ( );
		this.#deleteApiKeyButtonClickEL = new DeleteApiKeyButtonClickEL ( this );
	}

	/**
	The destructor. Remove event listener and clean the map
	*/

	destructor ( ) {
		this.#apiKeysControlRowsMap.forEach (
			apiKeysControlRow => apiKeysControlRow.destructor ( )
		);
		this.#apiKeysControlRowsMap.clear ( );
		this.#deleteApiKeyButtonClickEL.destructor ( );
		this.#deleteApiKeyButtonClickEL = null;
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
	Add an array of ApiKeys to the control.
	@param {Array.<ApiKey>} apiKeys An array with the ApiKeys to add
	*/

	addApiKeys ( apiKeys ) {
		this.#apiKeysControlRowsMap.clear ( );
		apiKeys.forEach (
			apiKey => {
				const apiKeyControl = new ApiKeyControlRow ( apiKey, this.#deleteApiKeyButtonClickEL );
				this.#apiKeysControlRowsMap.set ( apiKeyControl.objId, apiKeyControl );
			}
		);
		this.refreshApiKeys ( );
	}

	/**
	Add a new ApiKey to the control.
	*/

	newApiKey ( ) {
		const apiKey = new ApiKey ( );
		const apiKeyControlRow = new ApiKeyControlRow ( apiKey, this.#deleteApiKeyButtonClickEL );
		this.#apiKeysControlRowsMap.set ( apiKeyControlRow.objId, apiKeyControlRow );
		this.refreshApiKeys ( );
	}

	/**
	Delete a row with an ApiKey in the control
	@param {Number} rowObjId The objId of the row to delete
	*/

	deleteApiKey ( rowObjId ) {
		this.#apiKeysControlRowsMap.get ( rowObjId ).destructor ( );
		this.#apiKeysControlRowsMap.delete ( rowObjId );
		this.refreshApiKeys ( );
	}

	/**
	Remove all elements from the #apiKeysControl and add the existing ApiKeys
	*/

	refreshApiKeys ( ) {
		while ( this.controlHTMLElement.firstChild ) {
			this.controlHTMLElement.removeChild ( this.controlHTMLElement.firstChild );
		}
		this.#apiKeysControlRowsMap.forEach (
			apiKeyControlRow => { this.controlHTMLElement.appendChild ( apiKeyControlRow.HTMLElement ); }
		);
	}

	/**
	Get an array with the ApiKeys in the control
	@type {Array.<ApiKey>}
	*/

	get apiKeys ( ) {
		const apiKeys = [];
		this.#apiKeysControlRowsMap.forEach (
			apiKeyControl => apiKeys.push ( apiKeyControl.apiKey )
		);
		return apiKeys;
	}

	/**
	Get a JSON string with the ApiKeys in the control
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