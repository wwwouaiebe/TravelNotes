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

import BaseContextMenu from './baseContextMenu/BaseContextMenu.js';
import MenuItem from './baseContextMenu/MenuItem.js';
import theConfig from '../data/Config.js';
import theNoteEditor from '../core/NoteEditor.js';
import theRouteEditor from '../core/RouteEditor.js';
import theWayPointEditor from '../core/WayPointEditor.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import theTranslator from '../core/uiLib/Translator.js';
import Zoomer from '../core/Zoomer.js';
import theProfileDialogsManager from '../core/ProfileDialogsManager.js';
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
		this.#route = theDataSearchEngine.getRoute ( this.targetObjId );
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
					( this.targetObjId !== theTravelNotesData.travel.editedRoute.objId )
					&&
					( ROUTE_EDITION_STATUS.editedChanged !== theTravelNotesData.travel.editedRoute.editionStatus )
				),
				( ) => theRouteEditor.editRoute ( this.targetObjId )

			),
			new MenuItem (
				theTranslator.getText ( 'RouteContextMenu - Delete this route' ),
				(
					( this.targetObjId !== theTravelNotesData.travel.editedRoute.objId )
					||
					( ROUTE_EDITION_STATUS.editedChanged !== theTravelNotesData.travel.editedRoute.editionStatus )
				),
				( ) => theRouteEditor.removeRoute ( this.targetObjId )

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
				theTravelNotesData.travel.editedRoute.objId !== this.targetObjId,
				( ) => {
					if ( this.#route.hidden ) {
						theRouteEditor.showRoute ( this.targetObjId );
					}
					else {
						theRouteEditor.hideRoute ( this.targetObjId );
					}
				}
			),
			new MenuItem (
				theTranslator.getText ( 'RouteContextMenu - Properties' ),
				! this.#route.hidden,
				( ) => theRouteEditor.routeProperties ( this.targetObjId )
			),
			new MenuItem (
				theTranslator.getText ( 'RouteContextMenu - Zoom to route' ),
				! this.#route.hidden,
				( ) => new Zoomer ( ).zoomToRoute ( this.targetObjId )
			),
			new MenuItem (
				theTranslator.getText ( 'RouteContextMenu - View the elevation' ),
				this.#route.itinerary.hasProfile,
				( ) => theProfileDialogsManager.showProfile ( this.targetObjId )
			),
			new MenuItem (
				theTranslator.getText ( 'RouteContextMenu - Print route map' ),
				theConfig.printRouteMap.isEnabled,
				( ) => theRouteEditor.printRouteMap ( this.targetObjId )
			),
			new MenuItem (
				theTranslator.getText ( 'RouteContextMenu - Save this route in a GPX file' ),
				( ZERO < this.#route.itinerary.itineraryPoints.length ),
				( ) => theRouteEditor.saveGpx ( this.targetObjId )
			),
			new MenuItem (
				theTranslator.getText ( 'RouteContextMenu - Invert waypoints' ),
				theTravelNotesData.travel.editedRoute.objId === this.targetObjId,
				( ) => theWayPointEditor.reverseWayPoints ( )
			),
			new MenuItem (
				theTranslator.getText ( 'RouteContextMenu - Add a note on the route' ),
				! this.haveParentNode,
				( ) => theNoteEditor.newRouteNote ( this.targetObjId, this.latLng )
			),
			new MenuItem (
				theTranslator.getText ( 'RouteContextMenu - Create a note for each route maneuver' ),
				! this.#route.hidden,
				( ) => new AllManeuverNotesBuilder ( ).addAllManeuverNotes ( this.targetObjId )
			),
			new MenuItem (
				theTranslator.getText ( 'RouteContextMenu - Save modifications on this route' ),
				theTravelNotesData.travel.editedRoute.objId === this.targetObjId,
				( ) => theRouteEditor.saveEdition ( )
			),
			new MenuItem (
				theTranslator.getText ( 'RouteContextMenu - Cancel modifications on this route' ),
				theTravelNotesData.travel.editedRoute.objId === this.targetObjId,
				( ) => theRouteEditor.cancelEdition ( )
			)
		];
	}
}

export default RouteContextMenu;

/* --- End of file --------------------------------------------------------------------------------------------------------- */