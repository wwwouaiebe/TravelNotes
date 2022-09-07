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

import theConfig from '../../data/Config.js';
import theTravelNotesData from '../../data/TravelNotesData.js';
import theRouteEditor from '../../core/RouteEditor.js';
import theApiKeysManager from '../../core/ApiKeysManager.js';
import Travel from '../../data/Travel.js';
import ViewerFileLoader from '../../core/ViewerFileLoader.js';
import { theAppVersion } from '../../data/Version.js';
import theEventDispatcher from '../../core/lib/EventDispatcher.js';
import theMapLayersManager from '../../core/MapLayersManager.js';
import theMapLayersToolbar from '../../toolbars/mapLayersToolbar/MapLayersToolbar.js';
import theMouseUI from '../../uis/mouseUI/MouseUI.js';
import theAttributionsUI from '../../uis/attributionsUI/AttributionsUI.js';
import theTravelNotesToolbar from '../../toolbars/travelNotesToolbar/TravelNotesToolbar.js';
import theErrorsUI from '../../uis/errorsUI/ErrorsUI.js';
import theTranslator from '../../core/uiLib/Translator.js';
import theFullScreenUI from '../../uis/fullScreenUI/FullScreenUI.js';
import theProvidersToolbar from '../../toolbars/providersToolbar/ProvidersToolbar.js';
import MapMouseELs from '../../core/mapEditor/mapMouseELs/MapMouseELs.js';
import { LAT_LNG, TWO, SAVE_STATUS, HTTP_STATUS_OK } from '../Constants.js';

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

	async addReadOnlyTravel ( travelUrl ) {

		if ( this.#travelNotesLoaded ) {
			return;
		}

		this.#travelNotesLoaded = true;

		theAttributionsUI.createUI ( );
		theMapLayersManager.setMapLayer ( 'OSM - Color' );
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
	This method load TravelNotes and open an empty read and write map.
	This method can only be executed once. Others call will be ignored.
	*/

	addToolbarsMenusUIs ( ) {

		if ( this.#travelNotesLoaded ) {
			return;
		}

		this.#travelNotesLoaded = true;

		// Loading the user interfaces...
		document.title = 'Travel & Notes';
		theTravelNotesData.map.on ( 'contextmenu', MapMouseELs.handleContextMenuEvent );
		theTravelNotesData.map.on ( 'click', MapMouseELs.handleClickEvent );
		theTravelNotesData.map.setView ( [ theConfig.map.center.lat, theConfig.map.center.lng ], theConfig.map.zoom );

		// ... the attributions UI...
		theAttributionsUI.createUI ( );

		// ... the mouse UI
		theMouseUI.createUI ( );
		theMouseUI.saveStatus = SAVE_STATUS.saved;

		// ...help UI
		theErrorsUI.showHelp (
			'<p>' + theTranslator.getText ( 'Help - Continue with interface1' ) + '</p>' +
			'<p>' + theTranslator.getText ( 'Help - Continue with interface2' ) + '</p>'
		);

		// ... the map layers toolbar ...
		theMapLayersToolbar.createUI ( );
		theMapLayersManager.setMapLayer ( 'OSM - Color' );

		// ... the Travel & Notes toolbar
		theTravelNotesToolbar.createUI ( );

		// ...the providers toolbar
		theProvidersToolbar.createUI ( );

		// ... loading the Api keys
		theApiKeysManager.setKeysFromServerFile ( );

		// /// loading a new empty travel
		theTravelNotesData.travel.jsonObject = new Travel ( ).jsonObject;

		// ... start edition of the route
		if ( theConfig.travelNotes.startupRouteEdition ) {
			theRouteEditor.editRoute ( theTravelNotesData.travel.routes.first.objId );
		}

		// ...updating the route list and roadbook
		theEventDispatcher.dispatch ( 'setrouteslist' );
		theEventDispatcher.dispatch ( 'roadbookupdate' );

		// ... full screen UI
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