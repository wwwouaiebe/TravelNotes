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
		- Issue ♯69 : ContextMenu and ContextMenuFactory are unclear.
	- v1.7.0:
		- Issue ♯89 : Add elevation graph
	- v1.8.0:
		- Issue ♯97 : Improve adding a new waypoint to a route
	- v1.9.0:
		- Issue ♯101 : Add a print command for a route
	- v1.11.0:
		- Issue ♯110 : Add a command to create a SVG icon from osm for each maneuver
	- v1.12.0:
		- Issue ♯120 : Review the UserInterface
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210913
Tests ...
*/

import { BaseContextMenu, MenuItem } from '../contextMenus/BaseContextMenu.js';
import theConfig from '../data/Config.js';
import theNoteEditor from '../core/NoteEditor.js';
import theRouteEditor from '../core/RouteEditor.js';
import theWayPointEditor from '../core/WayPointEditor.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import theTranslator from '../UILib/Translator.js';
import Zoomer from '../core/Zoomer.js';
import theProfileWindowsManager from '../core/ProfileWindowsManager.js';
import theDataSearchEngine from '../data/DataSearchEngine.js';
import AllManeuverNotesBuilder from '../core/AllManeuverNotesBuilder.js';

import { ROUTE_EDITION_STATUS, ZERO } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
this class implements the BaseContextMenu class for the routes
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class RouteContextMenu extends BaseContextMenu {

	/**
	The route for witch the context menu is displayed
	@type {Route}
	*/

	#route = null;

	/**
	The constructor
	@param {Event} contextMenuEvent The event that have triggered the menu
	@param {HTMLElement} parentNode The parent node of the menu. Can be null for leaflet objects
	*/

	constructor ( contextMenuEvent, parentNode ) {
		super ( contextMenuEvent, parentNode );
		if ( this.eventData ) {
			this.#route = theDataSearchEngine.getRoute ( this.eventData.targetObjId );
		}
	}

	/**
	The list of menu items to use. Implementation of the BaseContextMenu.menuItems property
	@type {Array.<MenuItem>}
	*/

	get menuItems ( ) {
		return [
			new MenuItem (
				theTranslator.getText ( 'RouteContextMenu - Edit this route' ),
				(
					( this.eventData.targetObjId !== theTravelNotesData.travel.editedRoute.objId )
					&&
					( ROUTE_EDITION_STATUS.editedChanged !== theTravelNotesData.travel.editedRoute.editionStatus )
				),
				( ) => theRouteEditor.editRoute ( this.eventData.targetObjId )

			),
			new MenuItem (
				theTranslator.getText ( 'RouteContextMenu - Delete this route' ),
				(
					( this.eventData.targetObjId !== theTravelNotesData.travel.editedRoute.objId )
					||
					( ROUTE_EDITION_STATUS.editedChanged !== theTravelNotesData.travel.editedRoute.editionStatus )
				),
				( ) => theRouteEditor.removeRoute ( this.eventData.targetObjId )

			),
			new MenuItem (
				theTranslator.getText (
					this.#route.hidden
						?
						'RouteContextMenu - Show this route'
						:
						'RouteContextMenu - Hide this route'
				),
				this.#route.hidden
				||
				theTravelNotesData.travel.editedRoute.objId !== this.eventData.targetObjId,
				( ) => {
					if ( this.#route.hidden ) {
						theRouteEditor.showRoute ( this.eventData.targetObjId );
					}
					else {
						theRouteEditor.hideRoute ( this.eventData.targetObjId );
					}
				}
			),
			new MenuItem (
				theTranslator.getText ( 'RouteContextMenu - Properties' ),
				! this.#route.hidden,
				( ) => theRouteEditor.routeProperties ( this.eventData.targetObjId )
			),
			new MenuItem (
				theTranslator.getText ( 'RouteContextMenu - Zoom to route' ),
				! this.#route.hidden,
				( ) => new Zoomer ( ).zoomToRoute ( this.eventData.targetObjId )
			),
			new MenuItem (
				theTranslator.getText ( 'RouteContextMenu - View the elevation' ),
				this.#route.itinerary.hasProfile,
				( ) => theProfileWindowsManager.showProfile ( this.eventData.targetObjId )
			),
			new MenuItem (
				theTranslator.getText ( 'RouteContextMenu - Print route map' ),
				theConfig.printRouteMap.isEnabled,
				( ) => theRouteEditor.printRouteMap ( this.eventData.targetObjId )
			),
			new MenuItem (
				theTranslator.getText ( 'RouteContextMenu - Save this route in a GPX file' ),
				( ZERO < this.#route.itinerary.itineraryPoints.length ),
				( ) => theRouteEditor.saveGpx ( this.eventData.targetObjId )
			),
			new MenuItem (
				theTranslator.getText ( 'RouteContextMenu - Invert waypoints' ),
				theTravelNotesData.travel.editedRoute.objId === this.eventData.targetObjId,
				( ) => theWayPointEditor.reverseWayPoints ( )
			),
			new MenuItem (
				theTranslator.getText ( 'RouteContextMenu - Add a note on the route' ),
				! this.eventData.haveParentNode,
				( ) => theNoteEditor.newRouteNote ( this.eventData.targetObjId, this.eventData.latLng )
			),
			new MenuItem (
				theTranslator.getText ( 'RouteContextMenu - Create a note for each route maneuver' ),
				! this.#route.hidden,
				( ) => new AllManeuverNotesBuilder ( ).addAllManeuverNotes ( this.eventData.targetObjId )
			),
			new MenuItem (
				theTranslator.getText ( 'RouteContextMenu - Save modifications on this route' ),
				theTravelNotesData.travel.editedRoute.objId === this.eventData.targetObjId,
				( ) => theRouteEditor.saveEdition ( )
			),
			new MenuItem (
				theTranslator.getText ( 'RouteContextMenu - Cancel modifications on this route' ),
				theTravelNotesData.travel.editedRoute.objId === this.eventData.targetObjId,
				( ) => theRouteEditor.cancelEdition ( )
			)
		];
	}
}

export default RouteContextMenu;

/* --- End of file --------------------------------------------------------------------------------------------------------- */