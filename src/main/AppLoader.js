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

import theTravelNotes from '../main/TravelNotes.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import theConfig from '../data/Config.js';
import ConfigOverloader from '../data/ConfigOverloader.js';
import theTranslator from '../core/uiLib/Translator.js';
import theNoteDialogToolbarData from '../dialogs/notesDialog/toolbar/NoteDialogToolbarData.js';
import theOsmSearchDictionary from '../core/osmSearch/OsmSearchDictionary.js';
import theMapLayersCollection from '../data/MapLayersCollection.js';
import theErrorsUI from '../uis/errorsUI/ErrorsUI.js';
import EventListenersLoader from './EventListenersLoader.js';

import { LAT_LNG, ZERO, ONE, NOT_FOUND, HTTP_STATUS_OK } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Loader for the app. Load all the json files needed (config, translations, map layers...) and add event listeners
to the document
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class AppLoader {

	/**
	The url of the trv file in the fil parameter of the url
	@type {String}
	*/

	#travelUrl;

	/**
	the language in the lng parameter of the url
	@type {String}
	*/

	#language;

	/**
	The path of the app + TravelNotes ( first part of the json file names )
	@type {String}
	*/

	#originAndPath;

	/**
	An error message used when loading the json files
	@type {String}
	*/

	#errorMessage;

	/**
	Read the url. Search a 'fil' parameter and a 'lng' parameter in the url.
	*/

	#readURL ( ) {
		const docURL = new URL ( window.location );

		// 'fil' parameter
		let strTravelUrl = docURL.searchParams.get ( 'fil' );
		if ( strTravelUrl && ZERO !== strTravelUrl.length ) {
			try {
				strTravelUrl = atob ( strTravelUrl );

				// Verify that non illegal chars are present in the 'fil' parameter
				if ( strTravelUrl.match ( /[^\w-%:./]/ ) ) {

					throw new Error ( 'invalid char in the url encoded in the fil parameter' );
				}

				// Verify that the given url is on the same server and uses the same protocol
				const travelURL = new URL ( strTravelUrl );
				if (
					docURL.protocol && travelURL.protocol && docURL.protocol === travelURL.protocol
					&&
					docURL.hostname && travelURL.hostname && docURL.hostname === travelURL.hostname
				) {
					this.#travelUrl = encodeURI ( travelURL.href );
				}
				else {
					throw new Error ( 'The distant file is not on the same site than the app' );
				}
			}
			catch ( err ) {
				if ( err instanceof Error ) {
					console.error ( err );
				}
			}
		}

		// 'lng' parameter (lng as 'language and not lng as longitude...). lng must be 2 letters...
		const urlLng = docURL.searchParams.get ( 'lng' );
		if ( urlLng ) {
			if ( urlLng.match ( /^[A-Z,a-z]{2}$/ ) ) {
				this.#language = urlLng.toLowerCase ( );
			}
		}
	}

	/**
	Loading the config.json file from the server
	*/

	async #loadConfig ( ) {
		const configResponse = await fetch ( this.#originAndPath + 'Config.json' );

		if ( HTTP_STATUS_OK === configResponse.status && configResponse.ok ) {
			const config = await configResponse.json ( );

			// overload of language
			config.travelNotes.language = this.#language || config.travelNotes.language;

			// some special settings for the demo
			if ( 'wwwouaiebe.github.io' === window.location.hostname ) {
				config.ApiKeysDialog.haveUnsecureButtons = true;
				config.errorsUI.showHelp = true;
				config.mapLayersToolbar.theDevil.addButton = false;
				// eslint-disable-next-line no-magic-numbers
				config.note.maxManeuversNotes = 12;
				config.note.haveBackground = true;
				config.noteDialog.theDevil.addButton = false;
				// eslint-disable-next-line no-magic-numbers
				config.printRouteMap.maxTiles = 10;
				config.route.showDragTooltip = NOT_FOUND;
			}

			// default config overload with user config
			new ConfigOverloader ( ).overload ( config );

			// language setting for providers
			theTravelNotesData.providers.forEach (
				provider => {
					provider.userLanguage = theConfig.travelNotes.language;
				}
			);
			return true;
		}
		return false;
	}

	/**
	Loading translations
	@param {Object} translationPromiseResult The response of the fetch for the TravelNotesXX.json file
	@param {Object} defaultTranslationPromiseResult The response of the fetch for the TravelNotesEN.json file
	*/

	async #loadTranslations ( translationPromiseResult, defaultTranslationPromiseResult ) {
		if (
			'fulfilled' === translationPromiseResult.status
			&&
			HTTP_STATUS_OK === translationPromiseResult.value.status
			&&
			translationPromiseResult.value.ok
		) {
			theTranslator.setTranslations ( await translationPromiseResult.value.json ( ) );
			return true;
		}
		if (
			'fulfilled' === defaultTranslationPromiseResult.status
			&&
			HTTP_STATUS_OK === defaultTranslationPromiseResult.value.status
			&&
			defaultTranslationPromiseResult.value.ok
		) {
			theTranslator.setTranslations ( await defaultTranslationPromiseResult.value.json ( ) );
			this.#errorMessage +=
				'Not possible to load the TravelNotes' +
				this.#language.toUpperCase ( ) +
				'.json file. English will be used. ';
			return true;
		}
		this.#errorMessage += 'Not possible to load the translations. ';
		return false;
	}

	/**
	Loading the NoteDialog config
	@param {Object} noteDialogPromiseResult The response of the fetch for the TravelNotesNoteDialogXX.json file
	@param {Object} defaultNoteDialogPromiseResult The response of the fetch for the TravelNotesNoteDialogEN.json file
	*/

	async #loadNoteDialogConfig ( noteDialogPromiseResult, defaultNoteDialogPromiseResult ) {
		if (
			'fulfilled' === noteDialogPromiseResult.status
			&&
			HTTP_STATUS_OK === noteDialogPromiseResult.value.status
			&&
			noteDialogPromiseResult.value.ok
		) {
			const noteDialogData = await noteDialogPromiseResult.value.json ( );
			theNoteDialogToolbarData.loadJson ( noteDialogData );
			return true;
		}
		if (
			'fulfilled' === defaultNoteDialogPromiseResult.status
			&&
			HTTP_STATUS_OK === defaultNoteDialogPromiseResult.value.status
			&&
			defaultNoteDialogPromiseResult.value.ok
		) {
			const defaultNoteDialogData = await defaultNoteDialogPromiseResult.value.json ( );
			theNoteDialogToolbarData.loadJson ( defaultNoteDialogData );
			this.#errorMessage +=
				'Not possible to load the TravelNotesNoteDialog' +
				this.#language.toUpperCase ( ) +
				'.json file. English will be used. ';
			return true;
		}
		this.#errorMessage += 'Not possible to load the translations for the note dialog. ';
		return false;
	}

	/**
	Loading the OsmSearch dictionary
	@param {Object} searchDictPromiseResult The response of the fetch for the TravelNotesSearchDictionaryXX.csv file
	@param {Object} defaultSearchDictPromiseResult The response of the fetch for the TravelNotesSearchDictionaryEN.csv file
	*/

	async #loadOsmSearchDictionary ( searchDictPromiseResult, defaultSearchDictPromiseResult ) {
		if (
			'fulfilled' === searchDictPromiseResult.status
			&&
			HTTP_STATUS_OK === searchDictPromiseResult.value.status
			&&
			searchDictPromiseResult.value.ok
		) {
			theOsmSearchDictionary.parseDictionary ( await searchDictPromiseResult.value.text ( ) );
			return true;
		}
		if (
			'fulfilled' === defaultSearchDictPromiseResult.status
			&&
			HTTP_STATUS_OK === defaultSearchDictPromiseResult.value.status
			&&
			defaultSearchDictPromiseResult.value.ok
		) {
			theOsmSearchDictionary.parseDictionary ( await defaultSearchDictPromiseResult.value.text ( ) );
			this.#errorMessage +=
				'Not possible to load the TravelNotesSearchDictionary' +
				this.#language.toUpperCase ( ) +
				'.csv file. English will be used. ';
			return true;
		}
		this.#errorMessage += 'Not possible to load the search dictionary. OSM search will not be available.';
		return true;
	}

	/**
	Loading map layers
	@param {Object} layersPromiseResult The response of the fetch for the TravelNotesLayers.json file
	*/

	async #loadMapLayers ( layersPromiseResult ) {
		if (
			'fulfilled' === layersPromiseResult.status
			&&
			HTTP_STATUS_OK === layersPromiseResult.value.status
			&&
			layersPromiseResult.value.ok
		) {
			theMapLayersCollection.addMapLayers ( await layersPromiseResult.value.json ( ) );
			return true;
		}
		this.#errorMessage +=
			'Not possible to load the TravelNotesLayers.json file. Only the OpenStreetMap background will be available. ';
		return true;
	}

	/**
	Loading json files from the server
	*/

	async #loadJsonFiles ( ) {

		// loading the files in //
		const results = await Promise.allSettled ( [
			fetch ( this.#originAndPath +	this.#language.toUpperCase ( ) + '.json' ),
			fetch ( this.#originAndPath + 'EN.json' ),
			fetch ( this.#originAndPath + 'NoteDialog' + this.#language.toUpperCase ( ) + '.json' ),
			fetch ( this.#originAndPath + 'NoteDialogEN.json' ),
			fetch ( this.#originAndPath + 'SearchDictionary' + this.#language.toUpperCase ( ) + '.csv' ),
			fetch ( this.#originAndPath + 'SearchDictionaryEN.csv' ),
			fetch ( this.#originAndPath + 'Layers.json' )
		] );

		/* eslint-disable no-magic-numbers */
		const jsonSuccess =
			await this.#loadTranslations ( results [ 0 ], results [ 1 ] )
			&&
			await this.#loadNoteDialogConfig ( results [ 2 ], results [ 3 ] )
			&&
			await this.#loadOsmSearchDictionary ( results [ 4 ], results [ 5 ] )
			&&
			await this.#loadMapLayers ( results [ 6 ] );

		/* eslint-enable no-magic-numbers */

		if ( '' !== this.#errorMessage && jsonSuccess ) {
			theErrorsUI.showError ( this.#errorMessage );
		}
		else if ( '' !== this.#errorMessage ) {
			document.body.textContent = this.#errorMessage;
		}

		return jsonSuccess;
	}

	/**
	Loading theTravelNotes
	*/

	#loadTravelNotes ( ) {
		document.body.style [ 'font-size' ] = String ( theConfig.fontSize.initialValue ) + 'mm';

		// mapDiv must be extensible for leaflet
		const mapDiv = document.createElement ( 'div' );
		mapDiv.id = 'TravelNotes-Map';
		document.body.appendChild ( mapDiv );
		theTravelNotesData.map = window.L.map ( mapDiv.id, { attributionControl : false, zoomControl : false } )
			.setView ( [ LAT_LNG.defaultValue, LAT_LNG.defaultValue ], ZERO );

		if ( this.#travelUrl ) {
			theTravelNotes.addReadOnlyTravel ( this.#travelUrl );
		}
		else {
			EventListenersLoader.addUnloadEventsListeners ( );
			theTravelNotes.addToolbarsMenusUIs ( );
		}
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#originAndPath =
			window.location.href.substring ( ZERO, window.location.href.lastIndexOf ( '/' ) + ONE ) + 'TravelNotes';
		this.#errorMessage = '';
	}

	/**
	Load the complete app
	*/

	async loadApp ( ) {

		// adding event lsteners
		EventListenersLoader.addEventsListeners ( );

		// creating a reference of TravelNotes in the browser window object
		window.TaN = theTravelNotes;

		// reading url
		this.#readURL ( );

		// loading config
		if ( ! await this.#loadConfig ( ) ) {
			document.body.textContent = 'Not possible to load the TravelNotesConfig.json file. ';
			return;
		}

		// set the language to the config language if nothing in the url
		this.#language = this.#language || theConfig.travelNotes.language || 'fr';

		// creating the errors UI... needed for #loadJsonFiles ( ) method
		theErrorsUI.createUI ( );

		// loading json files
		if ( await this.#loadJsonFiles ( ) ) {
			this.#loadTravelNotes ( );
		}
	}
}

export default AppLoader;

/* --- End of file --------------------------------------------------------------------------------------------------------- */