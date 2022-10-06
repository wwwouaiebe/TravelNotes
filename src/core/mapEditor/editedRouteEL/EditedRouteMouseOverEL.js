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

import theConfig from '../../../data/Config.js';
import theTravelNotesData from '../../../data/TravelNotesData.js';
import theTranslator from '../../../core/uiLib/Translator.js';
import theDataSearchEngine from '../../../data/DataSearchEngine.js';
import theGeometry from '../../../core/lib/Geometry.js';
import theUtilities from '../../../core/uiLib/Utilities.js';

import TempWayPointMarkerELData from '../TempWayPointMarkerEL/TempWayPointMarkerELData.js';
import TempWayPointMarkerMouseOutEL from '../TempWayPointMarkerEL/TempWayPointMarkerMouseOutEL.js';
import TempWayPointMarkerDragStartEL from '../TempWayPointMarkerEL/TempWayPointMarkerDragStartEL.js';
import TempWayPointMarkerContextMenuEL from '../TempWayPointMarkerEL/TempWayPointMarkerContextMenuEL.js';
import TempWayPointMarkerClickEL from '../TempWayPointMarkerEL/TempWayPointMarkerClickEL.js';
import TempWayPointMarkerDragEndEL from '../TempWayPointMarkerEL/TempWayPointMarkerDragEndEL.js';

import { NOT_FOUND, ZERO, ONE, TWO, WAY_POINT_ICON_SIZE } from '../../../main/Constants.js';

import { LeafletDivIcon, LeafletMarker, LeafletDomEvent } from '../../../leaflet/LeafletImports.js';

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
	@param {Event} mouseEvent The event to handle
	*/

	static handleEvent ( mouseEvent ) {
		const route = theDataSearchEngine.getRoute ( mouseEvent.target.objId );
		TempWayPointMarkerELData.initialLatLng = [ mouseEvent.latlng.lat, mouseEvent.latlng.lng ];
		if ( TempWayPointMarkerELData.marker ) {
			TempWayPointMarkerELData.marker.setLatLng ( mouseEvent.latlng );
		}
		else {

			// a leaflet marker is created...
			TempWayPointMarkerELData.marker = new LeafletMarker (
				mouseEvent.latlng,
				{
					icon : new LeafletDivIcon (
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
			let distance = theGeometry.getClosestLatLngDistance ( route, [ mouseEvent.latlng.lat, mouseEvent.latlng.lng ] )
				.distance;
			distance += route.chainedDistance;
			tooltipText += theUtilities.formatDistance ( distance );

			TempWayPointMarkerELData.marker.bindTooltip ( tooltipText );
			TempWayPointMarkerELData.marker.getTooltip ( ).options.offset = [ ZERO, ZERO ];

			// adding marker to the map
			TempWayPointMarkerELData.marker.addTo ( theTravelNotesData.map );

			// adding event listeners on the marker
			LeafletDomEvent.on (
				TempWayPointMarkerELData.marker,
				'mouseout',
				TempWayPointMarkerMouseOutEL.handleEvent
			);
			LeafletDomEvent.on (
				TempWayPointMarkerELData.marker,
				'dragstart',
				TempWayPointMarkerDragStartEL.handleEvent
			);
			LeafletDomEvent.on (
				TempWayPointMarkerELData.marker,
				'dragend',
				TempWayPointMarkerDragEndEL.handleEvent
			);
			LeafletDomEvent.on (
				TempWayPointMarkerELData.marker,
				'contextmenu',
				TempWayPointMarkerContextMenuEL.handleEvent
			);
			LeafletDomEvent.on (
				TempWayPointMarkerELData.marker,
				'click',
				TempWayPointMarkerClickEL.handleEvent
			);
		}
	}
}

export default EditedRouteMouseOverEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */