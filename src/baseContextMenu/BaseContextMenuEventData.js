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
Doc reviewed 20220828
Tests ...
 */

import { ZERO, INVALID_OBJ_ID, LAT_LNG } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Simple container to share some data with the derived classes of BaseContextMenu
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class BaseContextMenuEventData {

	/**
	The X screen coordinate of the mouse event that have triggered the menu
	@type {Number}
	*/

	#clientX;

	/**
	The Y screen coordinate of the mouse event that have triggered the menu
	@type {Number}
	*/

	#clientY;

	/**
	The lat an lng at the mouse position for events triggered by the map
	@type {Array.<Number>}
	*/

	#latLng;

	/**
	The ObjId of the TravelObject on witch the mouse is positionned if any
	@type {Number}
	*/

	#targetObjId;

	/**
	A flag indicating when the menu must have a parent node. Menus triggered from leaflet objects don't have
	parentNode and then the menu is added to the document body
	@type {Boolean}
	*/

	#haveParentNode;

	/**
	The constructor
	@param {Event} contextMenuEvent The event that have triggered the menu
	@param {?HTMLElement} parentNode The parent node of the menu. Can be undefined for leaflet objects
	*/

	constructor ( contextMenuEvent, parentNode ) {
		Object.freeze ( this );
		this.#clientX = contextMenuEvent.clientX || contextMenuEvent.originalEvent.clientX || ZERO;
		this.#clientY = contextMenuEvent.clientY || contextMenuEvent.originalEvent.clientY || ZERO;
		this.#latLng = [
			contextMenuEvent.latlng ? contextMenuEvent.latlng.lat : LAT_LNG.defaultValue,
			contextMenuEvent.latlng ? contextMenuEvent.latlng.lng : LAT_LNG.defaultValue
		];
		this.#targetObjId =
			contextMenuEvent.target?.objId
			??
			( Number.parseInt ( contextMenuEvent?.currentTarget?.dataset?.tanObjId ) || INVALID_OBJ_ID );
		this.#haveParentNode = Boolean ( parentNode );
	}

	/**
	The X screen coordinate of the mouse event that have triggered the menu
	@type {Number}
	*/

	get clientX ( ) { return this.#clientX; }

	/**
	The Y screen coordinate of the mouse event that have triggered the menu
	@type {Number}
	*/

	get clientY ( ) { return this.#clientY; }

	/**
	The lat an lng at the mouse position for events triggered by the map
	@type {Array.<Number>}
	*/

	get latLng ( ) { return this.#latLng; }

	/**
	The ObjId of the TravelObject on witch the mouse is positionned if any
	@type {Number}
	*/

	get targetObjId ( ) { return this.#targetObjId; }

	/**
	A flag indicating when the menu must have a parent node. Menus triggered from leaflet objects don't have
	parentNode and then the menu is added to the document body
	@type {Boolean}
	*/

	get haveParentNode ( ) { return this.#haveParentNode; }
}

export default BaseContextMenuEventData;

/* --- End of file --------------------------------------------------------------------------------------------------------- */