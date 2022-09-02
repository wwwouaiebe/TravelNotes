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
		- created
Doc reviewed ...
Tests ...
*/

import theMapLayersCollection from '../data/MapLayersCollection.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import theEventDispatcher from '../core/lib/EventDispatcher.js';
import theAttributionsUI from '../uis/attributionsUI/AttributionsUI.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class change the background map
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class MapLayersManager {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Set a map layer as current map
	@param {string} mapLayerName The name of the layer to set
	*/

	setMapLayer ( mapLayerName ) {
		const mapLayer = theMapLayersCollection.getMapLayer ( mapLayerName );
		theEventDispatcher.dispatch ( 'layerchange', { layer : mapLayer } );
		theAttributionsUI.attributions = mapLayer.attribution;
		theTravelNotesData.travel.layerName = mapLayer.name;
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of MapLayersManager class
@type {MapLayersManager}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theMapLayersManager = new MapLayersManager ( );

export default theMapLayersManager;

/* --- End of file --------------------------------------------------------------------------------------------------------- */