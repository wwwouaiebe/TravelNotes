/*
Copyright - 2017 2023 - wwwouaiebe - Contact: https://www.ouaie.be/

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
	- v4.3.2:
		- Issue #82 : Not possible to open a distant file when the port of TravelNotes is not standard ( 80 or 443 )

Doc reviewed 202208
 */

import theConfig from '../../data/Config.js';
import ConfigOverloader from '../../data/ConfigOverloader.js';
import theTravelNotesViewer from './TravelNotesViewer.js';
import theTravelNotesData from '../../data/TravelNotesData.js';
import theTranslator from '../../core/uiLib/Translator.js';
import theViewerLayersToolbar from '../../toolbars/viewerLayersToolbar/ViewerLayersToolbar.js';
import MapEditorViewer from '../../core/mapEditor/MapEditorViewer.js';
import ViewerKeydownEL from './ViewerKeydownEL.js';
import { ZERO, ONE, LAT_LNG, HTTP_STATUS_OK } from '../Constants.js';

import { LeafletMap } from '../../leaflet/LeafletImports.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Loader for the app. Load all the json files needed (config, translations, map layers...) and add event listeners.
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class AppLoaderViewer {

	/**
	The url of the TaN file in the fil parameter of the url
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
	A flag indicating when the layer toolbar must be added
	@type {Boolean}
	*/

	#addLayerToolbar;

	/**
	The dafault zomm factor
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #VIEWER_DEFAULT_ZOOM ( ) { return 2; }

	/**
	The mapEditorViewer
	@type {MapEditorViewer}
	*/

	static #mapEditorViewer = new MapEditorViewer ( );

	/**
	Loading event listeners
	*/

	#addEventsListeners ( ) {
		document.addEventListener ( 'keydown', new ViewerKeydownEL ( ), true );
		document.addEventListener (
			'routeupdated',
			updateRouteEvent => {
				if ( updateRouteEvent.data ) {
					AppLoaderViewer.#mapEditorViewer.addRoute (
						updateRouteEvent.data.addedRouteObjId
					);
				}
			},
			false
		);
		document.addEventListener (
			'noteupdated',
			updateNoteEvent => {
				if ( updateNoteEvent.data ) {
					AppLoaderViewer.#mapEditorViewer.addNote (
						updateNoteEvent.data.addedNoteObjId
					);
				}
			},
			false
		);
		document.addEventListener (
			'zoomto',
			zoomToEvent => {
				if ( zoomToEvent.data ) {
					AppLoaderViewer.#mapEditorViewer.zoomTo (
						zoomToEvent.data.latLng,
						zoomToEvent.data.geometry
					);
				}
			},
			false
		);
		document.addEventListener (
			'layerchange',
			layerChangeEvent => {
				if ( layerChangeEvent.data ) {
					AppLoaderViewer.#mapEditorViewer.setLayer ( layerChangeEvent.data.layer, layerChangeEvent.data.layer.url );
				}
			}
		);
		document.addEventListener (
			'geolocationpositionchanged',
			geoLocationPositionChangedEvent => {
				if ( geoLocationPositionChangedEvent.data ) {
					AppLoaderViewer.#mapEditorViewer.onGeolocationPositionChanged (
						geoLocationPositionChangedEvent.data.position
					);
				}
			},
			false
		);
		document.addEventListener (
			'geolocationstatuschanged',
			geoLocationStatusChangedEvent => {
				if ( geoLocationStatusChangedEvent.data ) {
					AppLoaderViewer.#mapEditorViewer.onGeolocationStatusChanged ( geoLocationStatusChangedEvent.data.status );
				}
			},
			false
		);
	}

	/**
	Read the url. Search a 'fil' parameter, a 'lng' parameter and a 'lay' in the url.
	*/

	#readURL ( ) {
		const docURL = new URL ( window.location );
		let strTravelUrl = docURL.searchParams.get ( 'fil' );
		if ( strTravelUrl && ZERO !== strTravelUrl.length ) {
			try {
				strTravelUrl = atob ( strTravelUrl );
				if ( strTravelUrl.match ( /[^\w-%:./]/ ) ) {
					throw new Error ( 'invalid char in the url encoded in the fil parameter' );
				}
				const travelURL = new URL (
					strTravelUrl,
					docURL.protocol + '//' + docURL.hostname + ( '' === docURL.port ? '' : ':' + docURL.port )
				);

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
		const urlLng = docURL.searchParams.get ( 'lng' );
		if ( urlLng ) {
			if ( urlLng.match ( /^[A-Z,a-z]{2}$/ ) ) {
				this.#language = urlLng.toLowerCase ( );
			}
		}
		if ( '' === docURL.searchParams.get ( 'lay' ) ) {
			this.#addLayerToolbar = true;
		}
	}

	/**
	Loading the config.json file from the server
	*/

	async #loadConfig ( ) {
		const configResponse = await fetch ( this.#originAndPath + 'Config.json' );
		if ( HTTP_STATUS_OK === configResponse.status && configResponse.ok ) {
			const config = await configResponse.json ( );
			config.travelNotes.language = this.#language || config.travelNotes.language;
			if ( 'wwwouaiebe.github.io' === window.location.hostname ) {
				config.note.haveBackground = true;
			}
			new ConfigOverloader ( ).overload ( config );
			return true;
		}
		return false;
	}

	/**
	Loading translations
	*/

	async #loadTranslations ( ) {
		const languageResponse = await fetch ( this.#originAndPath + this.#language.toUpperCase ( ) + '.json' );
		if ( HTTP_STATUS_OK === languageResponse.status && languageResponse.ok ) {
			theTranslator.setTranslations ( await languageResponse.json ( ) );
			return true;
		}
		return false;
	}

	/**
	Loading map layers
	*/

	async #loadMapLayers ( ) {
		const layersResponse = await fetch ( this.#originAndPath +	'Layers.json' );
		if ( HTTP_STATUS_OK === layersResponse.status && layersResponse.ok ) {
			theViewerLayersToolbar.addMapLayers ( await layersResponse.json ( ) );
			return true;
		}
		return false;
	}

	/**
	Loading TravelNotes
	*/

	#loadTravelNotes ( ) {

		// mapDiv must be extensible for leaflet
		const mapDiv = document.createElement ( 'div' );
		mapDiv.id = 'TravelNotes-Map';
		document.body.appendChild ( mapDiv );
		theTravelNotesData.map = new LeafletMap ( mapDiv.id, { attributionControl : false, zoomControl : false } )
			.setView ( [ LAT_LNG.defaultValue, LAT_LNG.defaultValue ], AppLoaderViewer.#VIEWER_DEFAULT_ZOOM );

		theTravelNotesViewer.addReadOnlyMap ( this.#travelUrl, this.#addLayerToolbar );
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#originAndPath =
			window.location.href.substring ( ZERO, window.location.href.lastIndexOf ( '/' ) + ONE ) + 'TravelNotes';
		this.#addLayerToolbar = false;
	}

	/**
	Load the complete app
	*/

	async loadApp ( ) {
		this.#readURL ( );
		if ( ! await this.#loadConfig ( ) ) {
			document.body.textContent = 'Not possible to load the TravelNotesConfig.json file. ';
			return;
		}
		this.#language = this.#language || theConfig.travelNotes.language;
		if ( ! await this.#loadTranslations ( ) ) {
			document.body.textContent =
				'Not possible to load the TravelNotesConfig' + this.#language.toUpperCase ( ) + '.json file. ';
			return;
		}
		if ( ! await this.#loadMapLayers ( ) ) {
			document.body.textContent = 'Not possible to load the TravelNotesLayers.json file. ';
			return;
		}
		this.#addEventsListeners ( );
		this.#loadTravelNotes ( );
	}
}

export default AppLoaderViewer;

/* --- End of file --------------------------------------------------------------------------------------------------------- */