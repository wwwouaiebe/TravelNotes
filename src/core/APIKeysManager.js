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
	- v1.6.0:
		- created
	- v1.10.0:
		- Issue ♯107 : Add a button to reload the APIKeys file in the API keys dialog
	- v1.11.0:
		- Issue ♯108 : Add a warning when an error occurs when reading the APIKeys file at startup reopened
	- v2.0.0:
		- Issue ♯133 : Outphase reading the APIKeys with the url
		- Issue ♯137 : Remove html tags from json files
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
	- v3.2.0:
		- Issue ♯9 : String.substr ( ) is deprecated... Replace...
	- v3.3.0:
		- Issue ♯16 :  Password is asked each time the page is refreshed
Doc reviewed 20210914
Tests 20210903

-----------------------------------------------------------------------------------------------------------------------
*/

import { APIKey } from '../coreLib/Containers.js';
import APIKeysDialog from '../dialogAPIKeys/APIKeysDialog.js';
import theUtilities from '../UILib/Utilities.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import theConfig from '../data/Config.js';
import theEventDispatcher from '../coreLib/EventDispatcher.js';
import DataEncryptor from '../coreLib/DataEncryptor.js';
import PasswordDialog from '../dialogPassword/PasswordDialog.js';
import theTranslator from '../UILib/Translator.js';
import theErrorsUI from '../errorsUI/ErrorsUI.js';

import { ZERO, ONE, HTTP_STATUS_OK } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
API keys manager
See theAPIKeysManager for the one and only one instance of this class
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class APIKeysManager {

	/**
	A flag indicating that a APIKkeys file was found on the server when launching the app
	@type {Boolean}
	*/

	#haveAPIKeysFile = false;

	/**
	A map with the APIKeys
	@type {Map.<String>}
	*/

	#apiKeysMap = new Map ( );

	/**
	This method is called when the 'APIKkeys' file is decoded correctly
	@param {String} decryptedData the decoded API keys as JSON string
	*/

	#onOkDecryptServerFile ( decryptedData ) {
		this.#resetAPIKeys ( JSON.parse ( new TextDecoder ( ).decode ( decryptedData ) ) );
	}

	/**
	This method is called when the 'APIKkeys' file is not decoded correctly
	@param {Error} err The error occured when decrypting
	*/

	#onErrorDecryptServerFile ( err ) {

		// Showing the error if not cancelled by user
		if ( err instanceof Error ) {
			console.error ( err );
		}
		if ( err && 'Canceled by user' !== err ) {
			theErrorsUI.showError (
				theTranslator.getText ( 'APIKeysManager - An error occurs when reading the APIKeys file' )
			);
		}
	}

	/**
	This method is called when a 'APIKeys' file is found on the web server
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
	This method get an API key from the JS map
	@param {String} providerName the provider name
	@return {String} the API key
	*/

	#getAPIKey ( providerName ) {
		return this.#apiKeysMap.get ( providerName.toLowerCase ( ) );
	}

	/**
	 This method add an API key to the JS map
	@param {String} providerName the provider name
	@param {String} key the API key
	*/

	#setAPIKey ( providerName, key ) {
		this.#apiKeysMap.set ( providerName.toLowerCase ( ), key );
	}

	/**
	This method set the API keys from the session storage
	@return {Number} the number of API keys restored
	*/

	#setAPIKeysFromSessionStorage ( ) {
		if ( ! theUtilities.storageAvailable ( 'sessionStorage' ) ) {
			return ZERO;
		}

		let APIKeysCounter = ZERO;
		for ( let counter = ZERO; counter < sessionStorage.length; counter ++ ) {
			const keyName = sessionStorage.key ( counter );
			if ( keyName.match ( /^\w*ProviderKey$/ ) ) {
				this.#setAPIKey (
					keyName.replace ( 'ProviderKey', '' ),
					atob ( sessionStorage.getItem ( keyName ) )
				);
				APIKeysCounter ++;
			}
		}
		theTravelNotesData.providers.forEach (
			provider => {
				if ( provider.providerKeyNeeded ) {
					provider.providerKey = ( this.#getAPIKey ( provider.name ) || '' );
				}
			}
		);
		return APIKeysCounter;
	}

	/**
	This method replace all the API keys from the map and storage with the given APIKeys
	@param {Array.<APIKey>} newAPIKeys the new APIKeys
	*/

	#resetAPIKeys ( newAPIKeys ) {
		sessionStorage.clear ( );
		this.#apiKeysMap.clear ( );
		const saveToSessionStorage =
			theUtilities.storageAvailable ( 'sessionStorage' )
			&&
			theConfig.APIKeys.saveToSessionStorage;
		newAPIKeys.forEach (
			newApiKey => {
				if ( saveToSessionStorage ) {
					sessionStorage.setItem (
						( newApiKey.providerName ).toLowerCase ( ) + 'ProviderKey',
						btoa ( newApiKey.providerKey )
					);
				}
				this.#setAPIKey ( newApiKey.providerName, newApiKey.providerKey );
			}
		);
		theTravelNotesData.providers.forEach (
			provider => {
				if ( provider.providerKeyNeeded ) {
					provider.providerKey = ( this.#getAPIKey ( provider.name ) || '' );
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
	@param {String} providerName the provider name for witch the API key is searched
	@return {Boolean} true when the provider API key is known
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
	This method try to restore the API keys from the storage. If not possible the method search
	a file named 'APIKeys' on the web server. If the file is found, ask the file password to the user
	and try to decode the file.
	*/

	setKeysFromServerFile ( ) {

		let keysRestoredFromStorage = false;

		// Try first to restore keys from storage
		if ( ZERO !== this.#setAPIKeysFromSessionStorage ( ) ) {
			theEventDispatcher.dispatch ( 'providersadded' );
			keysRestoredFromStorage = true;
		}

		// otherwise searching on the server
		fetch ( window.location.href.substring ( ZERO, window.location.href.lastIndexOf ( '/' ) + ONE ) + 'APIKeys' )
			.then (
				response => {
					if ( HTTP_STATUS_OK === response.status && response.ok ) {
						this.#haveAPIKeysFile = true;
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
	This method show the APIKeys dialog and update the APIKeys when the user close the dialog.
	*/

	setKeysFromDialog ( ) {

		// preparing a list of providers and provider keys for the dialog
		const apiKeys = [];
		this.#apiKeysMap.forEach (
			( providerKey, providerName ) => {
				apiKeys.push ( new APIKey ( providerName, providerKey ) );
			}
		);
		apiKeys.sort ( ( first, second ) => first.providerName.localeCompare ( second.providerName ) );

		// showing dialog
		new APIKeysDialog ( apiKeys, this.#haveAPIKeysFile )
			.show ( )
			.then ( newAPIKeys => this.#resetAPIKeys ( newAPIKeys ) )
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
		let providerKey = this.#getAPIKey ( providerName );

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
The one and only one instance of APIKeysManager class
@type {APIKeysManager}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theAPIKeysManager = new APIKeysManager ( );

export default theAPIKeysManager;

/* --- End of file --------------------------------------------------------------------------------------------------------- */