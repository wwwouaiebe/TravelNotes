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
import theNoteEditor from '../core/NoteEditor.js';
import Zoomer from '../core/Zoomer.js';
import theTranslator from '../core/uiLib/Translator.js';
import theWayPointEditor from '../core/WayPointEditor.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import PoiData from '../containers/PoiData.js';
import { LAT_LNG, INVALID_OBJ_ID } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
this class implements the BaseContextMenu class for the OsmSearch data
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class OsmSearchContextMenu extends BaseContextMenu {

	/**
	The osmElement for witch the context menu is displayed
	@type {OsmElement}
	*/

	#osmElement;

	/**
	The lat and lng of the osmElement
	@type {Array.<Number>}
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

	/**
	The list of menu items to use. Implementation of the BaseContextMenu.menuItems property
	@type {Array.<MenuItem>}
	*/

	get menuItems ( ) {
		return [
			new MenuItem (
				theTranslator.getText ( 'OsmSearchContextMenu - Select this point as start point' ),
				( INVALID_OBJ_ID !== theTravelNotesData.editedRouteObjId )
				&&
				( LAT_LNG.defaultValue === theTravelNotesData.travel.editedRoute.wayPoints.first.lat ),
				( ) => theWayPointEditor.setStartPoint ( this.#latLng )
			),
			new MenuItem (
				theTranslator.getText ( 'OsmSearchContextMenu - Select this point as way point' ),
				INVALID_OBJ_ID !== theTravelNotesData.editedRouteObjId,
				( ) => theWayPointEditor.addWayPoint ( this.#latLng )
			),
			new MenuItem (
				theTranslator.getText ( 'OsmSearchContextMenu - Select this point as end point' ),
				( INVALID_OBJ_ID !== theTravelNotesData.editedRouteObjId )
				&&
				( LAT_LNG.defaultValue === theTravelNotesData.travel.editedRoute.wayPoints.last.lat ),
				( ) => theWayPointEditor.setEndPoint ( this.#latLng )
			),
			new MenuItem (
				theTranslator.getText ( 'OsmSearchContextMenu - Create a route note with this result' ),
				true,
				( ) => theNoteEditor.newSearchRouteNote ( this.#osmElement )
			),
			new MenuItem (
				theTranslator.getText ( 'OsmSearchContextMenu - Create a travel note with this result' ),
				true,
				( ) => theNoteEditor.newSearchTravelNote ( this.#osmElement )
			),
			new MenuItem (
				theTranslator.getText (
					theNoteEditor.osmSearchNoteDialog
						?
						'OsmSearchContextMenu - Hide note dialog'
						:
						'OsmSearchContextMenu - Show note dialog'
				),
				true,
				( ) => theNoteEditor.changeOsmSearchNoteDialog ( )
			),
			new MenuItem (
				theTranslator.getText ( 'OsmSearchContextMenu - Zoom to this result' ),
				true,
				( ) => new Zoomer ( ).zoomToPoi ( new PoiData ( this.#latLng, this.#osmElement.geometry ) )
			)
		];
	}
}

export default OsmSearchContextMenu;

/* --- End of file --------------------------------------------------------------------------------------------------------- */