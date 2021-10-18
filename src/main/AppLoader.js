/*
Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/

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
Doc reviewed 20210913
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@file AppLoader.js
@copyright Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/
@license GNU General Public License
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@module main

@------------------------------------------------------------------------------------------------------------------------------
*/

/* eslint-disable max-lines */

import theMapEditor from '../coreMapEditor/MapEditor.js';
import theIndexedDb from '../UILib/IndexedDb.js';
import theTravelHTMLViewsFactory from '../viewsFactories/TravelHTMLViewsFactory.js';
import theUtilities from '../UILib/Utilities.js';
import theMouseUI from '../mouseUI/MouseUI.js';
import theProfileWindowsManager from '../core/ProfileWindowsManager.js';
import theUI from '../UI/UI.js';
import theTravelNotes from '../main/TravelNotes.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import theConfig from '../data/Config.js';
import ConfigOverloader from '../data/ConfigOverloader.js';
import theTranslator from '../UILib/Translator.js';
import theNoteDialogToolbarData from '../dialogNotes/NoteDialogToolbarData.js';
import theOsmSearchDictionary from '../coreOsmSearch/OsmSearchDictionary.js';
import theMapLayersCollection from '../data/MapLayersCollection.js';
import theErrorsUI from '../errorsUI/ErrorsUI.js';

import { LAT_LNG, SAVE_STATUS, ZERO, ONE, NOT_FOUND, HTTP_STATUS_OK, PANE_ID } from '../main/Constants.js';

const OUR_DEMO_PRINT_MAX_TILES = 120;
const OUR_DEMO_MAX_MANEUVERS_NOTES = 10;

/**
@------------------------------------------------------------------------------------------------------------------------------

@class RoadbookUpdateEL
@classdesc roadbookupdate event listener
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class RoadbookUpdateEL {

	/**
	@type {boolean}
	@private
	*/

	#storageAvailable = false;

	/*
	constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#storageAvailable = theUtilities.storageAvailable ( 'localStorage' );
	}

	/**
	Event listener method
	*/

	handleEvent ( ) {
		theMouseUI.saveStatus = SAVE_STATUS.modified;

		if ( this.#storageAvailable ) {
			theIndexedDb.getOpenPromise ( )
				.then (
					( ) => {
						theIndexedDb.getWritePromise (
							theTravelNotesData.UUID,
							theTravelHTMLViewsFactory.getTravelHTML ( 'TravelNotes-Roadbook-' ).outerHTML
						);
					}
				)
				.then ( ( ) => localStorage.setItem ( theTravelNotesData.UUID, Date.now ( ) ) )
				.catch ( err => {
					if ( err instanceof Error ) {
						console.error ( err );
					}
				}
				);
		}
	}
}

/**
@------------------------------------------------------------------------------------------------------------------------------

@class AppLoader
@classdesc Loader for the app. Load all the json files needed (config, translations, map layers...) and add event listeners
to the document
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class AppLoader {

	/**
	The url of the trv file in the fil parameter of the url
	@type {string}
	@private
	*/

	#travelUrl = null;

	/**
	the language in the lng parameter of the url
	@type {string}
	@private
	*/

	#language = null;

	/**
	The path of the app + TravelNotes ( first part of the json file names )
	@type {string}
	@private
	*/

	#originAndPath = window.location.href.substr ( ZERO, window.location.href.lastIndexOf ( '/' ) + ONE ) + 'TravelNotes';

	/**
	An error message used when loading the json files
	@type {string}
	@private
	*/

	#errorMessage = '';

	/**
	Loading event listeners
	@private
	*/

	#addEventsListeners ( ) {
		document.addEventListener (
			'routeupdated',
			updateRouteEvent => {
				if ( updateRouteEvent.data ) {
					theMapEditor.updateRoute (
						updateRouteEvent.data.removedRouteObjId,
						updateRouteEvent.data.addedRouteObjId
					);
				}
			},
			false
		);
		document.addEventListener (
			'routepropertiesupdated',
			updateRoutePropertiesEvent => {
				if ( updateRoutePropertiesEvent.data ) {
					theMapEditor.updateRouteProperties (
						updateRoutePropertiesEvent.data.routeObjId
					);
				}
			},
			false
		);
		document.addEventListener (
			'noteupdated',
			updateNoteEvent => {
				if ( updateNoteEvent.data ) {
					theMapEditor.updateNote (
						updateNoteEvent.data.removedNoteObjId,
						updateNoteEvent.data.addedNoteObjId
					);
				}
			},
			false
		);
		document.addEventListener (
			'removeobject',
			removeObjectEvent => {
				if ( removeObjectEvent.data ) {
					theMapEditor.removeObject (
						removeObjectEvent.data.objId
					);
				}
			},
			false
		);
		document.addEventListener ( 'removeallobjects',	( ) => theMapEditor.removeAllObjects ( ), false );
		document.addEventListener (
			'zoomto',
			zoomToEvent => {
				if ( zoomToEvent.data ) {
					theMapEditor.zoomTo (
						zoomToEvent.data.latLng,
						zoomToEvent.data.geometry
					);
				}
			},
			false
		);
		document.addEventListener (
			'additinerarypointmarker',
			addItineraryPointMarkerEvent => {
				if ( addItineraryPointMarkerEvent.data ) {
					theMapEditor.addItineraryPointMarker (
						addItineraryPointMarkerEvent.data.objId,
						addItineraryPointMarkerEvent.data.latLng
					);
				}
			},
			false
		);
		document.addEventListener (
			'addsearchpointmarker',
			addSearchPointMarkerEvent => {
				if ( addSearchPointMarkerEvent.data ) {
					theMapEditor.addSearchPointMarker (
						addSearchPointMarkerEvent.data.objId,
						addSearchPointMarkerEvent.data.latLng,
						addSearchPointMarkerEvent.data.geometry
					);
				}
			},
			false
		);
		document.addEventListener (
			'addrectangle',
			addRectangleEvent => {
				if ( addRectangleEvent.data ) {
					theMapEditor.addRectangle (
						addRectangleEvent.data.objId,
						addRectangleEvent.data.bounds,
						addRectangleEvent.data.properties
					);
				}
			},
			false
		);
		document.addEventListener (
			'addwaypoint',
			addWayPointEvent => {
				if ( addWayPointEvent.data ) {
					theMapEditor.addWayPoint (
						addWayPointEvent.data.wayPoint,
						addWayPointEvent.data.letter
					);
				}
			},
			false
		);
		document.addEventListener (
			'layerchange',
			layerChangeEvent => {
				if ( layerChangeEvent.data ) {
					theMapEditor.setLayer ( layerChangeEvent.data.layer );
				}
			}
		);
		document.addEventListener (
			'geolocationpositionchanged',
			geoLocationPositionChangedEvent => {
				if ( geoLocationPositionChangedEvent.data ) {
					theMapEditor.onGeolocationPositionChanged ( geoLocationPositionChangedEvent.data.position );
				}
			},
			false
		);
		document.addEventListener (
			'geolocationstatuschanged',
			geoLocationStatusChangedEvent => {
				if ( geoLocationStatusChangedEvent.data ) {
					theMapEditor.onGeolocationStatusChanged ( geoLocationStatusChangedEvent.data.status );
				}
			},
			false
		);
		document.addEventListener ( 'roadbookupdate', new RoadbookUpdateEL ( ), false );
		document.addEventListener (
			'profileclosed',
			profileClosedEvent => {
				if ( profileClosedEvent.data ) {
					theProfileWindowsManager.onProfileClosed ( profileClosedEvent.data.objId );
				}
			},
			false
		);
		document.addEventListener (
			'uipinned',
			( ) => theUI.pin ( ),
			false
		);
		document.addEventListener (
			'geolocationstatuschanged',
			geoLocationStatusChangedEvent => {
				theUI.travelNotesToolbarUI.geoLocationStatusChanged ( geoLocationStatusChangedEvent.data.status );
			},
			false
		);
		document.addEventListener ( 'travelnameupdated', ( ) => theUI.travelUI.setTravelName ( ), false );
		document.addEventListener ( 'setrouteslist', ( ) => theUI.travelUI.routesListUI.setRoutesList ( ), false );
		document.addEventListener (
			'showitinerary',
			( ) => theUI.panesManagerUI.showPane ( PANE_ID.itineraryPane ),
			false
		);
		document.addEventListener (
			'updateitinerary',
			( ) => theUI.panesManagerUI.updatePane ( PANE_ID.itineraryPane ),
			false
		);
		document.addEventListener (
			'showtravelnotes',
			( ) => theUI.panesManagerUI.showPane ( PANE_ID.travelNotesPane ),
			false
		);
		document.addEventListener (
			'updatetravelnotes',
			( ) => theUI.panesManagerUI.updatePane ( PANE_ID.travelNotesPane ),
			false
		);
		document.addEventListener (
			'showsearch',
			( ) => theUI.panesManagerUI.showPane ( PANE_ID.searchPane ),
			false
		);
		document.addEventListener (
			'updatesearch',
			( ) => theUI.panesManagerUI.updatePane ( PANE_ID.searchPane ),
			false
		);
		document.addEventListener ( 'providersadded', ( ) => theUI.providersToolbarUI.providersAdded ( ), false );
		document.addEventListener (
			'setprovider',
			setProviderEvent => {
				if ( setProviderEvent?.data?.provider ) {
					theUI.providersToolbarUI.provider = setProviderEvent.data.provider;
				}
			},
			false
		);
		document.addEventListener (
			'settransitmode',
			setTransitModeEvent => {
				if ( setTransitModeEvent?.data?.transitMode ) {
					theUI.providersToolbarUI.transitMode = setTransitModeEvent.data.transitMode;
				}
			},
			false
		);
	}

	/**
	Loading unload and beforeunload event listeners
	@private
	*/

	#addUnloadEventsListeners ( ) {
		window.addEventListener ( 'unload', ( ) => localStorage.removeItem ( theTravelNotesData.UUID ) );
		window.addEventListener (
			'beforeunload',
			beforeUnloadEvent => {
				theIndexedDb.closeDb ( theTravelNotesData.UUID );
				if ( theConfig.travelNotes.haveBeforeUnloadWarning ) {
					beforeUnloadEvent.returnValue = 'x';
					return 'x';
				}
			}
		);
	}

	/**
	Read the url. Search a 'fil' parameter and a 'lng' parameter in the url.
	@private
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
	@private
	*/

	async #loadConfig ( ) {
		const configResponse = await fetch ( this.#originAndPath + 'Config.json' );

		if ( HTTP_STATUS_OK === configResponse.status && configResponse.ok ) {
			const config = await configResponse.json ( );

			// overload of language
			config.travelNotes.language = this.#language || config.travelNotes.language;

			// some special settings for the demo
			if ( 'wwwouaiebe.github.io' === window.location.hostname ) {
				config.APIKeysDialog.haveUnsecureButtons = true;
				config.errorsUI.showHelp = true;
				config.layersToolbarUI.theDevil.addButton = false;
				config.note.maxManeuversNotes = OUR_DEMO_MAX_MANEUVERS_NOTES;
				config.note.haveBackground = true;
				config.noteDialog.theDevil.addButton = false;
				config.printRouteMap.maxTiles = OUR_DEMO_PRINT_MAX_TILES;
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
	@private
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
	@private
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
	@private
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
	@private
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
	@private
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
	@private
	*/

	#loadTravelNotes ( ) {

		// mapDiv must be extensible for leaflet
		const mapDiv = document.createElement ( 'div' );
		mapDiv.id = 'TravelNotes-Map';
		document.body.appendChild ( mapDiv );
		theTravelNotesData.map = window.L.map ( mapDiv.id, { attributionControl : false, zoomControl : false } )
			.setView ( [ LAT_LNG.defaultValue, LAT_LNG.defaultValue ], ZERO );

		if ( this.#travelUrl ) {
			theTravelNotes.addReadOnlyMap ( this.#travelUrl );
		}
		else {
			this.#addUnloadEventsListeners ( );
			theTravelNotes.addControl ( 'TravelNotes-UI' );
		}
	}

	/*
	constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Load the complete app
	*/

	async loadApp ( ) {
		this.#addEventsListeners ( );
		window.TaN = theTravelNotes;
		this.#readURL ( );

		if ( ! await this.#loadConfig ( ) ) {
			document.body.textContent = 'Not possible to load the TravelNotesConfig.json file. ';
			return;
		}

		// set the language to the config language if nothing in the url
		this.#language = this.#language || theConfig.travelNotes.language || 'fr';
		theErrorsUI.createUI ( );

		if ( await this.#loadJsonFiles ( ) ) {
			this.#loadTravelNotes ( );
		}
	}
}

export default AppLoader;

/* eslint-enable max-lines */

/*
@------------------------------------------------------------------------------------------------------------------------------

end of AppLoader.js file

@------------------------------------------------------------------------------------------------------------------------------
*/