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

import BaseContextMenu from './baseContextMenu/BaseContextMenu.js';
import MenuItem from './baseContextMenu/MenuItem.js';
import theWayPointEditor from '../core/WayPointEditor.js';
import theTranslator from '../core/uiLib/Translator.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import theNoteEditor from '../core/NoteEditor.js';
import theRouteEditor from '../core/RouteEditor.js';
import Zoomer from '../core/Zoomer.js';

import { LAT, LNG, LAT_LNG, INVALID_OBJ_ID } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
this class implements the BaseContextMenu class for the map
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class MapContextMenu extends BaseContextMenu {

	/**
	The constructor
	@param {Event} contextMenuEvent The event that have triggered the menu
	@param {HTMLElement} parentNode The parent node of the menu. Can be null for leaflet objects
	*/

	constructor ( contextMenuEvent, parentNode ) {
		super ( contextMenuEvent, parentNode );
	}

	/**
	The list of menu items to use. Implementation of the BaseContextMenu.menuItems property
	@type {Array.<MenuItem>}
	*/

	get menuItems ( ) {
		return [
			new MenuItem (
				theTranslator.getText ( 'MapContextMenu - Select this point as start point' ),
				( INVALID_OBJ_ID !== theTravelNotesData.editedRouteObjId )
					&&
					( LAT_LNG.defaultValue === theTravelNotesData.travel.editedRoute.wayPoints.first.lat ),
				( ) => theWayPointEditor.setStartPoint ( this.latLng )
			),
			new MenuItem (
				theTranslator.getText ( 'MapContextMenu - Select this point as way point' ),
				( INVALID_OBJ_ID !== theTravelNotesData.editedRouteObjId ),
				( ) => theWayPointEditor.addWayPoint ( this.latLng )
			),
			new MenuItem (
				theTranslator.getText ( 'MapContextMenu - Select this point as end point' ),
				( INVALID_OBJ_ID !== theTravelNotesData.editedRouteObjId )
					&&
					( LAT_LNG.defaultValue === theTravelNotesData.travel.editedRoute.wayPoints.last.lat ),
				( ) => theWayPointEditor.setEndPoint ( this.latLng )
			),
			new MenuItem (
				theTranslator.getText ( 'MapContextMenu - Select this point as start and end point' ),
				( INVALID_OBJ_ID !== theTravelNotesData.editedRouteObjId )
					&&
					( LAT_LNG.defaultValue === theTravelNotesData.travel.editedRoute.wayPoints.first.lat )
					&&
					( LAT_LNG.defaultValue === theTravelNotesData.travel.editedRoute.wayPoints.last.lat ),
				( ) => theWayPointEditor.setStartAndEndPoint ( this.latLng )
			),
			new MenuItem ( theTranslator.getText ( 'MapContextMenu - Add a route' ),
				true,
				( ) => theRouteEditor.addRoute ( )
			),
			new MenuItem (
				theTranslator.getText ( 'MapContextMenu - Hide all routes' ),
				true,
				( ) => theRouteEditor.hideRoutes ( )
			),
			new MenuItem (
				theTranslator.getText ( 'MapContextMenu - Show all routes' ),
				true,
				( ) => theRouteEditor.showRoutes ( )
			),
			new MenuItem (
				theTranslator.getText ( 'MapContextMenu - New travel note' ),
				true,
				( ) => theNoteEditor.newTravelNote ( this.latLng )
			),
			new MenuItem (
				theTranslator.getText ( 'MapContextMenu - Hide all notes' ),
				true,
				( ) => theNoteEditor.hideNotes ( )
			),
			new MenuItem (
				theTranslator.getText ( 'MapContextMenu - Show all notes' ),
				true,
				( ) => theNoteEditor.showNotes ( )
			),
			new MenuItem (
				theTranslator.getText ( 'MapContextMenu - Zoom to travel' ),
				true,
				( ) => new Zoomer ( ).zoomToTravel ( )
			),
			new MenuItem (
				'What the fuck?',
				true,
				( ) => {
					const linkElement = document.createElement ( 'a' );
					linkElement.href =
						'https://www.openstreetmap.org/query?lat=' +
						this.latLng [ LAT ].toFixed ( LAT_LNG.fixed ) +
						'&lon=' +
						this.latLng [ LNG ].toFixed ( LAT_LNG.fixed ) +
						'#map=' +
						theTravelNotesData.map.getZoom ( ) +
						'/' +
						this.latLng [ LAT ].toFixed ( LAT_LNG.fixed ) +
						'/' +
						this.latLng [ LNG ].toFixed ( LAT_LNG.fixed );
					linkElement.target = '_blank';
					linkElement.click ( );
				}
			)
		];
	}
}

export default MapContextMenu;

/* --- End of file --------------------------------------------------------------------------------------------------------- */