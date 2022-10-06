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

import theDataSearchEngine from '../../../data/DataSearchEngine.js';
import theDevice from '../../lib/Device.js';
import theTravelNotesData from '../../../data/TravelNotesData.js';
import { LAT, LNG, ROUTE_EDITION_STATUS } from '../../../main/Constants.js';
import theConfig from '../../../data/Config.js';
import MapContextMenu from '../../../contextMenus/MapContextMenu.js';
import RouteContextMenu from '../../../contextMenus/RouteContextMenu.js';
import EditedRouteMouseOverEL from '../editedRouteEL/EditedRouteMouseOverEL.js';

import { LeafletLatLng } from '../../../leaflet/LeafletImports.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
click and contextmenu event listeners for the map
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class MapMouseELs {

	/**
	Search a route near the given event listener and create a fake event if a route
	is found near the event point
	@param {Event} clickOrContextMenuEvent The event to use
	*/

	static createFakeEvent ( clickOrContextMenuEvent ) {
		const nearestRouteData = theDataSearchEngine.getNearestRouteData (
			[ clickOrContextMenuEvent.latlng.lat, clickOrContextMenuEvent.latlng.lng ]
		);

		if ( ! nearestRouteData.route ) {
			return;
		}

		const routeLatLng = new LeafletLatLng (
			nearestRouteData.latLngOnRoute [ LAT ], nearestRouteData.latLngOnRoute [ LNG ]
		);
		const routeContainerPoint = theTravelNotesData.map.latLngToContainerPoint ( routeLatLng );
		const routeDistance = routeContainerPoint.distanceTo ( clickOrContextMenuEvent.containerPoint );
		const maxRouteDistance =
			theDevice.isTouch
				?
				theConfig.mapContextMenu.touchMaxRouteDistance
				:
				theConfig.mapContextMenu.mouseMaxRouteDistance;

		if ( routeDistance > maxRouteDistance ) {
			return;
		}

		return Object.freeze (
			{
				clientX : routeContainerPoint.x,
				clientY : routeContainerPoint.y,
				latlng : routeLatLng,
				target : nearestRouteData.route
			}
		);

	}

	/**
	Click event listener for the map. Search an edited route near the click point and add a
	temp way point if any
	@param {Event} clickEvent The event to handle
	*/

	static handleClickEvent ( clickEvent ) {
		const fakeEvent = MapMouseELs.createFakeEvent ( clickEvent );
		if (
			fakeEvent
			&&
			theDevice.isTouch
			&&
			fakeEvent.target.editionStatus !== ROUTE_EDITION_STATUS.notEdited
		) {
			EditedRouteMouseOverEL.handleEvent ( fakeEvent );
		}
	}

	/**
	Context event listener for the map. Search an edited route near the click point and show a
	route context menu if any, otherwise show a map context menu
	@param {Event} contextMenuEvent The event to handle
	*/

	static handleContextMenuEvent ( contextMenuEvent ) {

		const fakeEvent = MapMouseELs.createFakeEvent ( contextMenuEvent );
		if ( fakeEvent ) {
			new RouteContextMenu ( fakeEvent ).show ( );
		}
		else {
			new MapContextMenu ( contextMenuEvent ).show ( );
		}
	}

}

export default MapMouseELs;

/* --- End of file --------------------------------------------------------------------------------------------------------- */