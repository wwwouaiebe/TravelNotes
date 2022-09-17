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
import theTranslator from '../core/uiLib/Translator.js';
import theNoteEditor from '../core/NoteEditor.js';
import Zoomer from '../core/Zoomer.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
this class implements the BaseContextMenu class for the profiles
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ProfileContextMenu extends BaseContextMenu {

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
				theTranslator.getText ( 'ProfileContextMenu - Add a note to the route at this point' ),
				true,
				( ) => theNoteEditor.newRouteNote ( this.targetObjId, this.latLng )
			),
			new MenuItem (
				theTranslator.getText ( 'ProfileContextMenu - Zoom to this point' ),
				true,
				( ) => new Zoomer ( ).zoomToLatLng ( this.latLng )
			)
		];
	}
}

export default ProfileContextMenu;

/* --- End of file --------------------------------------------------------------------------------------------------------- */