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
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Tests ...
*/

import theTravelNotesData from '../data/TravelNotesData.js';
import ViewerFileLoader from '../core/ViewerFileLoader.js';
import theAttributionsUI from '../attributionsUI/AttributionsUI.js';
import theViewerLayersToolbarUI from '../viewerLayersToolbarUI/ViewerLayersToolbarUI.js';
import { TWO, LAT_LNG, HTTP_STATUS_OK } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the entry point of the viewer.<br>
See theTravelNotesViewer for the one and only one instance of this class.
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TravelNotesViewer {

	/**
	Guard to avoid a second upload
	@type {Boolean}
	*/

	#travelNotesLoaded;

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
		this.#travelNotesLoaded = false;
	}

	/**
	This method load the TravelNotes viewer and open a read only map passed trought the url.
	This method can only be executed once. Others call will be ignored.
	@param {String} travelUrl The url of the trv file to open
	@param {Boolean} addLayerToolbar A bollean indicating when the map layer toolbar must be visible
	*/

	addReadOnlyMap ( travelUrl, addLayerToolbar ) {

		if ( this.#travelNotesLoaded ) {
			return;
		}

		this.#travelNotesLoaded = true;

		theAttributionsUI.createUI ( );
		if ( addLayerToolbar ) {
			theViewerLayersToolbarUI.createUI ( );
		}

		theViewerLayersToolbarUI.setMapLayer ( 'OSM - Color' );
		if ( travelUrl ) {
			this.#loadDistantTravel ( travelUrl );
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of theTravelNotesViewer class
@type {TravelNotesViewer}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theTravelNotesViewer = new TravelNotesViewer ( );

export default theTravelNotesViewer;

/* --- End of file --------------------------------------------------------------------------------------------------------- */