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

import theTravelNotesData from '../data/TravelNotesData.js';
import RouteContextMenu from '../contextMenus/RouteContextMenu.js';
import theWayPointEditor from '../core/WayPointEditor.js';

import { ZERO, ONE } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class contains shared data by the event listeners for the temp waypoint
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TempWayPointMarkerELData {

	/**
	A reference to the L.marker Object
	@type {LeafletObject}
	*/

	static marker = null;

	/**
	The initial lat and lng of the marker
	@type {Array.<Number>}
	*/

	static initialLatLng = null;
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
mouseout event listener for the temp waypoint marker
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TempWayPointMarkerMouseOutEL {

	/**
	Event listener method
	*/

	static handleEvent ( ) {
		if ( TempWayPointMarkerELData.marker ) {
			window.L.DomEvent.off ( TempWayPointMarkerELData.marker );
			theTravelNotesData.map.removeLayer ( TempWayPointMarkerELData.marker );
			TempWayPointMarkerELData.marker = null;
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
dragstart event listener for the temp waypoint marker
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TempWayPointMarkerDragStartEL {

	/**
	Event listener method
	*/

	static handleEvent ( ) {
		window.L.DomEvent.off (
			TempWayPointMarkerELData.marker,
			'mouseout',
			TempWayPointMarkerMouseOutEL.handleEvent
		);
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
click event listener for the temp waypoint marker
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TempWayPointMarkerClickEL {

	/**
	Event listener method
	@param {Event} clickEvent The event to handle
	*/

	static handleEvent ( clickEvent ) {
		theTravelNotesData.mapObjects.get ( theTravelNotesData.travel.editedRoute.objId ).openPopup ( clickEvent.latlng );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
contextmenu event listener for the temp waypoint marker
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TempWayPointMarkerContextMenuEL {

	/**
	Event listener method
	@param {Event} contextMenuEvent The event to handle
	*/

	static handleEvent ( contextMenuEvent ) {
		contextMenuEvent.latlng.lat = TempWayPointMarkerELData.initialLatLng [ ZERO ];
		contextMenuEvent.latlng.lng = TempWayPointMarkerELData.initialLatLng [ ONE ];
		contextMenuEvent.target.objId = theTravelNotesData.travel.editedRoute.objId;
		new RouteContextMenu ( contextMenuEvent ).show ( );
	}
}

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
			window.L.DomEvent.off (
				TempWayPointMarkerELData.marker,
				'dragstart',
				TempWayPointMarkerDragStartEL.handleEvent
			);
			window.L.DomEvent.off (
				TempWayPointMarkerELData.marker,
				'dragend',
				TempWayPointMarkerDragEndEL.handleEvent
			);
			window.L.DomEvent.off (
				TempWayPointMarkerELData.marker,
				'contextmenu',
				TempWayPointMarkerContextMenuEL.handleEvent
			);
			theTravelNotesData.map.removeLayer ( TempWayPointMarkerELData.marker );
			TempWayPointMarkerELData.marker = null;
		}
	}
}

export {
	TempWayPointMarkerELData,
	TempWayPointMarkerMouseOutEL,
	TempWayPointMarkerDragStartEL,
	TempWayPointMarkerContextMenuEL,
	TempWayPointMarkerClickEL,
	TempWayPointMarkerDragEndEL
};

/* --- End of file --------------------------------------------------------------------------------------------------------- */