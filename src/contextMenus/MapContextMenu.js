/*
Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/

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
	- v1.12.0:
		- Issue ♯120 : Review the UserInterface
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210913
Tests ...
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@file MapContextMenu.js
@copyright Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/
@license GNU General Public License
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@module contextMenus
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

import { BaseContextMenu, MenuItem } from '../contextMenus/BaseContextMenu.js';
import theWayPointEditor from '../core/WayPointEditor.js';
import theTranslator from '../UILib/Translator.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import theNoteEditor from '../core/NoteEditor.js';
import theRouteEditor from '../core/RouteEditor.js';
import AboutDialog from '../dialogs/AboutDialog.js';
import Zoomer from '../core/Zoomer.js';

import { LAT_LNG, INVALID_OBJ_ID } from '../main/Constants.js';

/**
@--------------------------------------------------------------------------------------------------------------------------

@classdesc this class implements the BaseContextMenu class for the map

@--------------------------------------------------------------------------------------------------------------------------
*/

class MapContextMenu extends BaseContextMenu {

	/**
	The constructor
	@param {Event} contextMenuEvent The event that have triggered the menu
	@param {HTMLElement} parentNode The parent node of the menu. Can be null for leaflet objects
	*/

	constructor ( contextMenuEvent, parentNode ) {
		super ( contextMenuEvent, parentNode );
	}

	/* eslint-disable no-magic-numbers */

	/**
	Perform the action selected by the user. Implementation of the base class doAction method
	@param {!number} selectedItemObjId The id of the item selected by the user
	*/

	doAction ( selectedItemObjId ) {
		switch ( selectedItemObjId ) {
		case 0 :
			theWayPointEditor.setStartPoint ( this.eventData.latLng );
			break;
		case 1 :
			theWayPointEditor.addWayPoint ( this.eventData.latLng );
			break;
		case 2 :
			theWayPointEditor.setEndPoint ( this.eventData.latLng );
			break;
		case 3 :
			theRouteEditor.addRoute ( );
			break;
		case 4 :
			theRouteEditor.hideRoutes ( );
			break;
		case 5 :
			theRouteEditor.showRoutes ( );
			break;
		case 6 :
			theNoteEditor.newTravelNote ( this.eventData.latLng );
			break;
		case 7 :
			theNoteEditor.hideNotes ( );
			break;
		case 8 :
			theNoteEditor.showNotes ( );
			break;
		case 9 :
			new Zoomer ( ).zoomToTravel ( );
			break;
		case 10 :
			new AboutDialog ( ).show ( )
				.catch ( ( ) => {} );
			break;
		default :
			break;
		}
	}

	/* eslint-enable no-magic-numbers */

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
					( LAT_LNG.defaultValue === theTravelNotesData.travel.editedRoute.wayPoints.first.lat )
			),
			new MenuItem (
				theTranslator.getText ( 'MapContextMenu - Select this point as way point' ),
				( INVALID_OBJ_ID !== theTravelNotesData.editedRouteObjId )
			),
			new MenuItem (
				theTranslator.getText ( 'MapContextMenu - Select this point as end point' ),
				( INVALID_OBJ_ID !== theTravelNotesData.editedRouteObjId )
					&&
					( LAT_LNG.defaultValue === theTravelNotesData.travel.editedRoute.wayPoints.last.lat )
			),
			new MenuItem ( theTranslator.getText ( 'MapContextMenu - Add a route' ),
				true
			),
			new MenuItem (
				theTranslator.getText ( 'MapContextMenu - Hide all routes' ),
				true
			),
			new MenuItem (
				theTranslator.getText ( 'MapContextMenu - Show all routes' ),
				true
			),
			new MenuItem (
				theTranslator.getText ( 'MapContextMenu - New travel note' ),
				true
			),
			new MenuItem (
				theTranslator.getText ( 'MapContextMenu - Hide all notes' ),
				true
			),
			new MenuItem (
				theTranslator.getText ( 'MapContextMenu - Show all notes' ),
				true
			),
			new MenuItem (
				theTranslator.getText ( 'MapContextMenu - Zoom to travel' ),
				true
			),
			new MenuItem (
				theTranslator.getText ( 'MapContextMenu - About Travel & Notes' ),
				true
			)
		];
	}
}

export default MapContextMenu;

/*
--- End of MapContextMenu.js file ---------------------------------------------------------------------------------------------
*/