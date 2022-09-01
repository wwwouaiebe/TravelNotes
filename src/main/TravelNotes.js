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
	- v1.0.0:
		- created
	- v1.1.0:
		- Issue ♯26 : added confirmation message before leaving the page when data modified.
		- Issue ♯27 : push directly the route in the editor when starting a new travel
	- v1.3.0:
		- Improved myReadURL method
		- Working with Promise at startup
		- Added baseDialog property
	- v1.4.0:
		- Replacing DataManager with TravelNotesData, Config, Version and DataSearchEngine
		- removing interface
		- moving file functions from TravelEditor to the new FileLoader
		- added loading of osmSearch
	- v1.5.0:
		- Issue ♯52 : when saving the travel to the file, save also the edited route.
	- v1.6.0:
		- Issue ♯65 : Time to go to ES6 modules?
		- Issue ♯69 : ContextMenu and ContextMenuFactory are unclear
		- Issue ♯63 : Find a better solution for provider keys upload
		- Issue ♯75 : Merge Maps and TravelNotes
	- v1.12.0:
		- Issue ♯120 : Review the UserInterface
	- v2.0.0:
		- Issue ♯137 : Remove html tags from json files
		- Issue ♯139 : Remove Globals
		- Issue ♯140 : Remove userData
	-v2.2.0:
		- Issue ♯129 : Add an indicator when the travel is modified and not saved
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
	- v4.0.0:
		- Issue ♯49 : Add a full screen mode method
		- Issue ♯51 : Review completely the UI
Doc reviewed 20210913
Tests ...
*/

import theConfig from '../data/Config.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import theRouteEditor from '../core/RouteEditor.js';
import theApiKeysManager from '../core/ApiKeysManager.js';
import Travel from '../data/Travel.js';
import ViewerFileLoader from '../core/ViewerFileLoader.js';
import { theAppVersion } from '../data/Version.js';
import theEventDispatcher from '../core/lib/EventDispatcher.js';
import MapContextMenu from '../contextMenus/MapContextMenu.js';
import theMapLayersManager from '../core/MapLayersManager.js';
import theMapLayersToolbar from '../mapLayersToolbar/MapLayersToolbar.js';
import theMouseUI from '../mouseUI/MouseUI.js';
import theAttributionsUI from '../attributionsUI/AttributionsUI.js';
import theTravelNotesToolbar from '../travelNotesToolbar/TravelNotesToolbar.js';
import theErrorsUI from '../errorsUI/ErrorsUI.js';
import theTranslator from '../UILib/Translator.js';
import theFullScreenUI from '../fullScreenUI/FullScreenUI.js';
import { LAT_LNG, TWO, SAVE_STATUS, HTTP_STATUS_OK } from '../main/Constants.js';
import theProvidersToolbar from '../providersToolbar/ProvidersToolbar.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the entry point of the application.

See theTravelNotes for the one and only one instance of this class
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TravelNotes {

	/**
	Guard to avoid a second upload
	@type {Boolean}
	*/

	#travelNotesLoaded = false;

	/**
	Load a travel from the server
	@param {String} travelUrl The url of the trv file to open
	*/

	async #loadDistantTravel ( travelUrl ) {
		const travelResponse = await fetch ( travelUrl );
		if ( HTTP_STATUS_OK === travelResponse.status && travelResponse.ok ) {
			new ViewerFileLoader ( ).openDistantFile ( await travelResponse.json ( ) );
		}
		else {
			theTravelNotesData.map.setView ( [ LAT_LNG.defaultValue, LAT_LNG.defaultValue ], TWO );
			document.title = 'Travel & Notes';
		}
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	This method load TravelNotes and open a read only map passed trought the url.
	This method can only be executed once. Others call will be ignored.
	@param {String} travelUrl The url of the trv file to open
	*/

	addReadOnlyMap ( travelUrl ) {

		if ( this.#travelNotesLoaded ) {
			return;
		}

		this.#travelNotesLoaded = true;

		theAttributionsUI.createUI ( );
		theMapLayersManager.setMapLayer ( 'OSM - Color' );
		this.#loadDistantTravel ( travelUrl );
	}

	/**
	This method load TravelNotes and open an empty read and write map.
	This method can only be executed once. Others call will be ignored.
	*/

	addControl ( ) {

		if ( this.#travelNotesLoaded ) {
			return;
		}

		this.#travelNotesLoaded = true;

		document.body.style [ 'font-size' ] = String ( theConfig.fontSize.initialValue ) + 'mm';

		// Loading the user interfaces...
		document.title = 'Travel & Notes';
		theTravelNotesData.map.on ( 'contextmenu', contextMenuEvent => new MapContextMenu ( contextMenuEvent ) .show ( ) );
		theTravelNotesData.map.setView ( [ theConfig.map.center.lat, theConfig.map.center.lng ], theConfig.map.zoom );

		// ... the attributions UI...
		theAttributionsUI.createUI ( );

		// ... the map layers toolbar UI...
		if ( theConfig.layersToolbarUI.haveLayersToolbarUI ) {
			theMapLayersToolbar.createUI ( );
		}
		theMapLayersManager.setMapLayer ( 'OSM - Color' );

		// ... the mouse UI
		if ( theConfig.mouseUI.haveMouseUI ) {
			theMouseUI.createUI ( );
			theMouseUI.saveStatus = SAVE_STATUS.saved;
		}

		theTravelNotesToolbar.createUI ( );

		theProvidersToolbar.createUI ( );

		// ...help UI
		theErrorsUI.showHelp (
			'<p>' + theTranslator.getText ( 'Help - Continue with interface1' ) + '</p>' +
			'<p>' + theTranslator.getText ( 'Help - Continue with interface2' ) + '</p>'
		);

		// Loading the Api keys
		theApiKeysManager.setKeysFromServerFile ( );

		// Loading a new empty travel
		theTravelNotesData.travel.jsonObject = new Travel ( ).jsonObject;

		if ( theConfig.travelEditor.startupRouteEdition ) {
			theRouteEditor.editRoute ( theTravelNotesData.travel.routes.first.objId );
		}

		theEventDispatcher.dispatch ( 'setrouteslist' );
		theEventDispatcher.dispatch ( 'roadbookupdate' );

		theFullScreenUI.show ( );

	}

	/**
	This method add a provider. Used by plugins.
	@param {class} providerClass The provider to add
	*/

	addProvider ( providerClass ) {
		theApiKeysManager.addProvider ( providerClass );
	}

	/**
	Show an info, using theErrorsUI. Used by plugins.
	@param {String} info The info to show
	*/

	showInfo ( info ) {
		theErrorsUI.showInfo ( info );
	}

	/**
	The overpassApi url to use by plugins
	@type {String}
	*/

	get overpassApiUrl ( ) { return theConfig.overpassApi.url; }

	/**
	The Leaflet map object
	@type {LeafletObject}
	*/

	get map ( ) { return theTravelNotesData.map; }

	/**
	theTravelNotes version
	@type {String}
	*/

	get version ( ) { return theAppVersion; }
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of TravelNotes class
@type {TravelNotes}

/* ------------------------------------------------------------------------------------------------------------------------- */

const theTravelNotes = new TravelNotes ( );

export default theTravelNotes;

/* --- End of file --------------------------------------------------------------------------------------------------------- */