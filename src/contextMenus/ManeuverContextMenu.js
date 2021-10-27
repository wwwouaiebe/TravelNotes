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
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210913
Tests ...
*/

import { BaseContextMenu, MenuItem } from '../contextMenus/BaseContextMenu.js';
import Zoomer from '../core/Zoomer.js';
import theTranslator from '../UILib/Translator.js';

/**
@--------------------------------------------------------------------------------------------------------------------------

@classdesc this class implements the BaseContextMenu class for the maneuvers

@--------------------------------------------------------------------------------------------------------------------------
*/

class ManeuverContextMenu extends BaseContextMenu {

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
			new Zoomer ( ).zoomToManeuver ( this.eventData.targetObjId );
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
				theTranslator.getText ( 'ManeuverContextMenu - Zoom to this maneuver' ),
				true
			)
		];
	}
}

export default ManeuverContextMenu;

/*
--- End of ManeuverContextMenu.js file ----------------------------------------------------------------------------------------
*/