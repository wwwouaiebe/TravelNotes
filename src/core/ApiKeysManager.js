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

import ApiKey from '../containers/ApiKey.js';
import ApiKeysDialog from '../dialogs/apiKeysDialog/ApiKeysDialog.js';
import theUtilities from './uiLib/Utilities.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import theConfig from '../data/Config.js';
import theEventDispatcher from './lib/EventDispatcher.js';
import DataEncryptor from './lib/DataEncryptor.js';
import PasswordDialog from '../dialogs/passwordDialog/PasswordDialog.js';
import theTranslator from './uiLib/Translator.js';
import theErrorsUI from '../uis/errorsUI/ErrorsUI.js';

import { ZERO, ONE, HTTP_STATUS_OK } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
ApiKeys manager
See theApiKeysManager for the one and only one instance of this class
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ApiKeysManager {

	/**
	A flag indicating that a ApiKeys file was found on the server when launching the app
	@type {Boolean}
	*/

	#haveApiKeysFile = false;

	/**
	A map with the ApiKeys
	@type {Map.<String>}
	*/

	#apiKeysMap = new Map ( );

	/**
	This method is called when the 'ApiKeys' file is decoded correctly
	@param {String} decryptedData the decoded api keys as JSON string
	*/

	#onOkDecryptServerFile ( decryptedData ) {
		this.#resetApiKeys ( JSON.parse ( new TextDecoder ( ).decode ( decryptedData ) ) );
	}

	/**
	This method is called when the 'ApiKeys' file is not decoded correctly
	@param {Error} err The error occured when decrypting
	*/

	#onErrorDecryptServerFile ( err ) {

		// Showing the error if not cancelled by user
		if ( err instanceof Error ) {
			console.error ( err );
		}
		if ( err && 'Canceled by user' !== err ) {
			theErrorsUI.showError (
				theTranslator.getText ( 'ApiKeysManager - An error occurs when reading the ApiKeys file' )
			);
		}
	}

	/**
	This method is called when a 'ApiKeys' file is found on the web server
	The methos ask a password to the user and try to decode the file
	@param {ArrayBuffer} data the data to decode
	*/

	#onServerFileFound ( data ) {
		if ( window.isSecureContext && ( window?.crypto?.subtle?.importKey ) ) {
			new DataEncryptor ( ).decryptData (
				data,
				decryptedData => this.#onOkDecryptServerFile ( decryptedData ),
				err => this.#onErrorDecryptServerFile ( err ),
				new PasswordDialog ( false ).show ( )
			);
		}
	}

	/**
	This method get an Api Key from the JS map
	@param {String} providerName the provider name
	@return {String} the Api Key
	*/

	#getApiKey ( providerName ) {
		return this.#apiKeysMap.get ( providerName.toLowerCase ( ) );
	}

	/**
	 This method add an Api Key to the JS map
	@param {String} providerName the provider name
	@param {String} key the Api Key
	*/

	#setApiKey ( providerName, key ) {
		this.#apiKeysMap.set ( providerName.toLowerCase ( ), key );
	}

	/**
	This method set the ApiKeys from the session storage
	@return {Number} the number of Api keys restored
	*/

	#setApiKeysFromSessionStorage ( ) {
		if ( ! theUtilities.storageAvailable ( 'sessionStorage' ) ) {
			return ZERO;
		}

		let apiKeysCounter = ZERO;
		for ( let counter = ZERO; counter < sessionStorage.length; counter ++ ) {
			const keyName = sessionStorage.key ( counter );
			if ( keyName.match ( /^\w*ProviderKey$/ ) ) {
				this.#setApiKey (
					keyName.replace ( 'ProviderKey', '' ),
					atob ( sessionStorage.getItem ( keyName ) )
				);
				apiKeysCounter ++;
			}
		}
		theTravelNotesData.providers.forEach (
			provider => {
				if ( provider.providerKeyNeeded ) {
					provider.providerKey = ( this.#getApiKey ( provider.name ) || '' );
				}
			}
		);
		return apiKeysCounter;
	}

	/**
	This method replace all the ApiKeys from the map and storage with the given ApiKeys
	@param {Array.<ApiKey>} newApiKeys the new ApiKeys
	*/

	#resetApiKeys ( newApiKeys ) {
		this.#apiKeysMap.clear ( );
		const saveToSessionStorage =
			theUtilities.storageAvailable ( 'sessionStorage' )
			&&
			theConfig.ApiKeys.saveToSessionStorage;
		if ( saveToSessionStorage ) {
			sessionStorage.clear ( );
		}
		newApiKeys.forEach (
			newApiKey => {
				if ( saveToSessionStorage ) {
					sessionStorage.setItem (
						( newApiKey.providerName ).toLowerCase ( ) + 'ProviderKey',
						btoa ( newApiKey.providerKey )
					);
				}
				this.#setApiKey ( newApiKey.providerName, newApiKey.providerKey );
			}
		);
		theTravelNotesData.providers.forEach (
			provider => {
				if ( provider.providerKeyNeeded ) {
					provider.providerKey = ( this.#getApiKey ( provider.name ) || '' );
				}
			}
		);

		theEventDispatcher.dispatch ( 'providersadded' );
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Verify that a provider key is known
	@param {String} providerName the provider name for witch the Api Key is searched
	@return {Boolean} true when the provider Api Key is known
	*/

	hasKey ( providerName ) { return this.#apiKeysMap.has ( providerName.toLowerCase ( ) ); }

	/**
	Get the url from the mapLayer
	@param {MapLayer} mapLayer the layer for witch the url must returned
	@return {String} the url for the given mapLayer or null if the url cannot be given
	*/

	getUrl ( mapLayer ) {
		if ( mapLayer.providerKeyNeeded ) {
			const providerKey = this.#apiKeysMap.get ( mapLayer.providerName.toLowerCase ( ) );
			if ( providerKey ) {
				return mapLayer.url.replace ( '{providerKey}', providerKey );
			}
			return null;
		}
		return mapLayer.url;
	}

	/**
	This method try to restore the ApiKeys from the storage. If not possible the method search
	a file named 'ApiKeys' on the web server. If the file is found, ask the file password to the user
	and try to decode the file.
	*/

	setKeysFromServerFile ( ) {

		let keysRestoredFromStorage = false;

		// Try first to restore keys from storage
		if ( ZERO !== this.#setApiKeysFromSessionStorage ( ) ) {
			theEventDispatcher.dispatch ( 'providersadded' );
			keysRestoredFromStorage = true;
		}

		// otherwise searching on the server
		fetch ( window.location.href.substring ( ZERO, window.location.href.lastIndexOf ( '/' ) + ONE ) + 'ApiKeys' )
			.then (
				response => {
					if ( HTTP_STATUS_OK === response.status && response.ok ) {
						this.#haveApiKeysFile = true;
						if ( ! keysRestoredFromStorage ) {
							response.arrayBuffer ( ).then ( data => this.#onServerFileFound ( data ) );
						}
					}
				}
			)
			.catch (
				err => {
					if ( err instanceof Error ) {
						console.error ( err );
					}
				}
			);
	}

	/**
	This method show the ApiKeys dialog and update the ApiKeys when the user close the dialog.
	*/

	setKeysFromDialog ( ) {

		// preparing a list of providers and provider keys for the dialog
		const apiKeys = [];
		this.#apiKeysMap.forEach (
			( providerKey, providerName ) => {
				apiKeys.push ( new ApiKey ( providerName, providerKey ) );
			}
		);
		apiKeys.sort ( ( first, second ) => first.providerName.localeCompare ( second.providerName ) );

		// showing dialog
		new ApiKeysDialog ( apiKeys, this.#haveApiKeysFile )
			.show ( )
			.then ( newApiKeys => this.#resetApiKeys ( newApiKeys ) )
			.catch (
				err => {
					if ( err instanceof Error ) {
						console.error ( err );
					}
				}
			);
	}

	/**
	This method add a provider. Used by plugins
	@param {class} providerClass The JS class of the provider to add
	*/

	addProvider ( providerClass ) {
		const provider = new providerClass ( );
		const providerName = provider.name.toLowerCase ( );

		// searching if we have already the provider key
		let providerKey = this.#getApiKey ( providerName );

		// no provider key. Searching in the storage
		if ( provider.providerKeyNeeded && ! providerKey ) {
			if ( theUtilities.storageAvailable ( 'sessionStorage' ) ) {
				providerKey = sessionStorage.getItem ( providerName );
				if ( providerKey ) {
					providerKey = atob ( providerKey );
				}
			}
		}

		// adding the provider key to the provider
		if ( provider.providerKeyNeeded && providerKey ) {
			provider.providerKey = providerKey;
		}

		// adding the provider to the available providers
		theTravelNotesData.providers.set ( provider.name.toLowerCase ( ), provider );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of ApiKeysManager class
@type {ApiKeysManager}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theApiKeysManager = new ApiKeysManager ( );

export default theApiKeysManager;

/* --- End of file --------------------------------------------------------------------------------------------------------- */