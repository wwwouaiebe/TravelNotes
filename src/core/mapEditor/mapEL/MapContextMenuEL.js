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

import theDevice from '../../lib/Device.js';
import theDataSearchEngine from '../../../data/DataSearchEngine.js';
import MapContextMenu from '../../../contextMenus/MapContextMenu.js';
import RouteContextMenu from '../../../contextMenus/RouteContextMenu.js';
import theTravelNotesData from '../../../data/TravelNotesData.js';
import { LAT, LNG } from '../../../main/Constants.js';
import theConfig from '../../../data/Config.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
context menu event listener for the map
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class MapContextMenuEL {

	/**
	Event listener method
	@param {Event} contextMenuEvent The event to handle
	*/

	static handleEvent ( contextMenuEvent ) {
		const nearestRouteData = theDataSearchEngine.getNearestRouteData (
			[ contextMenuEvent.latlng.lat, contextMenuEvent.latlng.lng ]
		);
		if ( ! nearestRouteData.route ) {
			new MapContextMenu ( contextMenuEvent ).show ( );
			return;
		}
		const routeLatLng = window.L.latLng (
			nearestRouteData.latLngOnRoute [ LAT ], nearestRouteData.latLngOnRoute [ LNG ]
		);
		const routeContainerPoint = theTravelNotesData.map.latLngToContainerPoint ( routeLatLng );
		const routeDistance = routeContainerPoint.distanceTo ( contextMenuEvent.containerPoint );
		const maxRouteDistance =
			theDevice.isTouch
				?
				theConfig.mapContextMenu.touchMaxRouteDistance
				:
				theConfig.mapContextMenu.mouseMaxRouteDistance;

		if ( routeDistance > maxRouteDistance ) {
			new MapContextMenu ( contextMenuEvent ).show ( );
			return;
		}
		const fakeRouteContextMenuEvent = Object.freeze (
			{
				clientX : routeContainerPoint.x,
				clientY : routeContainerPoint.y,
				latlng : routeLatLng,
				target : nearestRouteData.route
			}
		);
		new RouteContextMenu ( fakeRouteContextMenuEvent ).show ( );
	}

}

export default MapContextMenuEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */