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
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
	- v3.3.0:
		- Issue ♯17 :  Add a click event on the temp itinerary point of the edited route, so the popup of the route can be show
Doc reviewed 20210914
Tests 20210902
*/

import theConfig from '../data/Config.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import theTranslator from '../UILib/Translator.js';
import theDataSearchEngine from '../data/DataSearchEngine.js';
import theGeometry from '../coreLib/Geometry.js';
import theUtilities from '../UILib/Utilities.js';
import {
	TempWayPointMarkerELData,
	TempWayPointMarkerMouseOutEL,
	TempWayPointMarkerDragStartEL,
	TempWayPointMarkerContextMenuEL,
	TempWayPointMarkerClickEL,
	TempWayPointMarkerDragEndEL
} from '../coreMapEditor/TempWayPointMarkerEventListeners.js';
import { ROUTE_EDITION_STATUS, NOT_FOUND, ZERO, ONE, TWO, WAY_POINT_ICON_SIZE } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
mouseover event listeners for the edited route
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class EditedRouteMouseOverEL {

	/**
	A counter for the drag tooltip
	@type {Number}
	*/

	static #showDragTooltip = ONE;

	/**
	mouseover event listener
	@param {Event} mapEvent The event to handle
	*/

	static handleEvent ( mapEvent ) {
		const route = theDataSearchEngine.getRoute ( mapEvent.target.objId );
		if ( ROUTE_EDITION_STATUS.notEdited === route.editionStatus ) {
			return;
		}
		TempWayPointMarkerELData.initialLatLng = [ mapEvent.latlng.lat, mapEvent.latlng.lng ];
		if ( TempWayPointMarkerELData.marker ) {
			TempWayPointMarkerELData.marker.setLatLng ( mapEvent.latlng );
		}
		else {

			// a leaflet marker is created...
			TempWayPointMarkerELData.marker = window.L.marker (
				mapEvent.latlng,
				{
					icon : window.L.divIcon (
						{
							iconSize : [ WAY_POINT_ICON_SIZE, WAY_POINT_ICON_SIZE ],
							iconAnchor : [
								WAY_POINT_ICON_SIZE / TWO,
								WAY_POINT_ICON_SIZE
							],
							html : '<div class="TravelNotes-Map-WayPoint TravelNotes-Map-WayPointTmp' +
								'"></div><div class="TravelNotes-Map-WayPointText">?</div>',
							className : 'TravelNotes-Map-WayPointStyle'
						}
					),
					draggable : true
				}
			);

			// adding tooltip
			let tooltipText = '';
			if (
				NOT_FOUND === theConfig.route.showDragTooltip
				||
				EditedRouteMouseOverEL.#showDragTooltip <= theConfig.route.showDragTooltip
			) {
				EditedRouteMouseOverEL.#showDragTooltip ++;
				tooltipText = theTranslator.getText ( 'EditedRouteMouseOverEL - Drag and drop to add a waypoint' ) + ' - ';
			}
			tooltipText += route.computedName + ' - ';
			let distance = theGeometry.getClosestLatLngDistance ( route, [ mapEvent.latlng.lat, mapEvent.latlng.lng ] )
				.distance;
			distance += route.chainedDistance;
			tooltipText += theUtilities.formatDistance ( distance );

			TempWayPointMarkerELData.marker.bindTooltip ( tooltipText );
			TempWayPointMarkerELData.marker.getTooltip ( ).options.offset = [ ZERO, ZERO ];

			// adding marker to the map
			TempWayPointMarkerELData.marker.addTo ( theTravelNotesData.map );

			// adding event listeners on the marker
			window.L.DomEvent.on (
				TempWayPointMarkerELData.marker,
				'mouseout',
				TempWayPointMarkerMouseOutEL.handleEvent
			);
			window.L.DomEvent.on (
				TempWayPointMarkerELData.marker,
				'dragstart',
				TempWayPointMarkerDragStartEL.handleEvent
			);
			window.L.DomEvent.on (
				TempWayPointMarkerELData.marker,
				'dragend',
				TempWayPointMarkerDragEndEL.handleEvent
			);
			window.L.DomEvent.on (
				TempWayPointMarkerELData.marker,
				'contextmenu',
				TempWayPointMarkerContextMenuEL.handleEvent
			);
			window.L.DomEvent.on (
				TempWayPointMarkerELData.marker,
				'click',
				TempWayPointMarkerClickEL.handleEvent
			);
		}
	}
}

export default EditedRouteMouseOverEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */