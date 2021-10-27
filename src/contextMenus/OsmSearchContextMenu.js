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
	- v1.12.0:
		- created
	- v1.13.0:
		- Issue ♯126 : Add a command "select as start/end/intermediate point" in the osmSearch context menu
		- Issue ♯128 : Unify osmSearch and notes icons and data
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210913
Tests ...
*/

import { BaseContextMenu, MenuItem } from '../contextMenus/BaseContextMenu.js';
import theNoteEditor from '../core/NoteEditor.js';
import Zoomer from '../core/Zoomer.js';
import theTranslator from '../UILib/Translator.js';
import theWayPointEditor from '../core/WayPointEditor.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import { LAT_LNG, INVALID_OBJ_ID } from '../main/Constants.js';

/**
@--------------------------------------------------------------------------------------------------------------------------

@classdesc this class implements the BaseContextMenu class for the OsmSearch data

@--------------------------------------------------------------------------------------------------------------------------
*/

class OsmSearchContextMenu extends BaseContextMenu {

	/**
	The osmElement for witch the context menu is displayed
	@type {Object}
	*/

	#osmElement;

	/**
	The lat and lng of the osmElement
	@type {Array.<number>}
	*/

	#latLng;

	/**
	The constructor
	@param {Event} contextMenuEvent The event that have triggered the menu
	@param {HTMLElement} parentNode The parent node of the menu. Can be null for leaflet objects
	*/

	constructor ( contextMenuEvent, parentNode ) {
		super ( contextMenuEvent, parentNode );
		this.#osmElement =
			theTravelNotesData.searchData [ Number.parseInt ( contextMenuEvent.currentTarget.dataset.tanElementIndex ) ];
		this.#latLng = [ this.#osmElement.lat, this.#osmElement.lon ];
	}

	/* eslint-disable no-magic-numbers */

	/**
	Perform the action selected by the user. Implementation of the base class doAction method
	@param {!number} selectedItemObjId The id of the item selected by the user
	*/

	doAction ( selectedItemObjId ) {
		switch ( selectedItemObjId ) {
		case 0 :
			theWayPointEditor.setStartPoint ( this.#latLng );
			break;
		case 1 :
			theWayPointEditor.addWayPoint ( this.#latLng );
			break;
		case 2 :
			theWayPointEditor.setEndPoint ( this.#latLng );
			break;
		case 3 :
			theNoteEditor.newSearchRouteNote ( this.#osmElement );
			break;
		case 4 :
			theNoteEditor.newSearchTravelNote ( this.#osmElement );
			break;
		case 5 :
			theNoteEditor.changeOsmSearchNoteDialog ( );
			break;
		case 6 :
			new Zoomer ( ).zoomToPoi (
				{
					latLng : this.#latLng,
					geometry : this.#osmElement.geometry
				}
			);
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
				INVALID_OBJ_ID !== theTravelNotesData.editedRouteObjId
			),
			new MenuItem (
				theTranslator.getText ( 'MapContextMenu - Select this point as end point' ),
				( INVALID_OBJ_ID !== theTravelNotesData.editedRouteObjId )
				&&
				( LAT_LNG.defaultValue === theTravelNotesData.travel.editedRoute.wayPoints.last.lat )
			),
			new MenuItem (
				theTranslator.getText ( 'OsmSearchContextMenu - Create a route note with this result' ),
				true
			),
			new MenuItem (
				theTranslator.getText ( 'OsmSearchContextMenu - Create a travel note with this result' ),
				true
			),
			new MenuItem (
				theTranslator.getText (
					theNoteEditor.osmSearchNoteDialog
						?
						'OsmSearchContextMenu - Hide note dialog'
						:
						'OsmSearchContextMenu - Show note dialog'
				),
				true
			),
			new MenuItem (
				theTranslator.getText ( 'OsmSearchContextMenu - Zoom to this result' ),
				true
			)
		];
	}
}

export default OsmSearchContextMenu;

/*
--- End of OsmSearchContextMenu.js file ---------------------------------------------------------------------------------------
*/