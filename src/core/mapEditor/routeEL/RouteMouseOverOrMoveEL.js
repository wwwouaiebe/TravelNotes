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
Doc reviewed 202208
 */

import theDataSearchEngine from '../../../data/DataSearchEngine.js';
import theGeometry from '../../../core/lib/Geometry.js';
import theUtilities from '../../../core/uiLib/Utilities.js';
import theTravelNotesData from '../../../data/TravelNotesData.js';
import { ZERO } from '../../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
mouseover and mousemove event listener for the routes
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class RouteMouseOverOrMoveEL {

	/**
	Event listener method
	@param {Event} mapEvent The event to handle
	*/

	static handleEvent ( mapEvent ) {
		const route = theDataSearchEngine.getRoute ( mapEvent.target.objId );
		let distance = theGeometry.getClosestLatLngDistance ( route, [ mapEvent.latlng.lat, mapEvent.latlng.lng ] )
			.distance;
		distance += route.chainedDistance;
		distance = theUtilities.formatDistance ( distance );
		const polyline = theTravelNotesData.mapObjects.get ( mapEvent.target.objId );
		polyline.closeTooltip ( );
		let tooltipText = route.computedName;
		if ( ! theTravelNotesData.travel.readOnly ) {
			tooltipText += ( ZERO === tooltipText.length ? '' : ' - ' );
			tooltipText += distance;
		}
		polyline.setTooltipContent ( tooltipText );
		polyline.openTooltip ( mapEvent.latlng );
	}
}

export default RouteMouseOverOrMoveEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */