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

import theTravelNotesData from '../../../data/TravelNotesData.js';
import theWayPointEditor from '../../../core/WayPointEditor.js';
import TempWayPointMarkerELData from './TempWayPointMarkerELData.js';
import TempWayPointMarkerDragStartEL from './TempWayPointMarkerDragStartEL.js';
import TempWayPointMarkerContextMenuEL from './TempWayPointMarkerContextMenuEL.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
dragend event listener for the temp waypoint marker
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TempWayPointMarkerDragEndEL {

	/**
	Event listener method
	@param {Event} dragEndEvent The event to handle
	*/

	static handleEvent ( dragEndEvent ) {
		theWayPointEditor.addWayPointOnRoute (
			TempWayPointMarkerELData.initialLatLng,
			[ dragEndEvent.target.getLatLng ( ).lat, dragEndEvent.target.getLatLng ( ).lng ]
		);
		if ( TempWayPointMarkerELData.marker ) {
			TempWayPointMarkerELData.marker.off ( 'dragstart', TempWayPointMarkerDragStartEL.handleEvent );
			TempWayPointMarkerELData.marker.off ( 'dragend', TempWayPointMarkerDragEndEL.handleEvent );
			TempWayPointMarkerELData.marker.off ( 'contextmenu', TempWayPointMarkerContextMenuEL.handleEvent );
			theTravelNotesData.map.removeLayer ( TempWayPointMarkerELData.marker );
			TempWayPointMarkerELData.marker = null;
		}
	}
}

export default TempWayPointMarkerDragEndEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */