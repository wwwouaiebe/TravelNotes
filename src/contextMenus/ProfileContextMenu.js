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

@file ProfileContextMenu.js
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

import BaseContextMenu from '../contextMenus/BaseContextMenu.js';
import theTranslator from '../UILib/Translator.js';
import theNoteEditor from '../core/NoteEditor.js';
import Zoomer from '../core/Zoomer.js';

import { LAT, LNG } from '../main/Constants.js';

/**
@--------------------------------------------------------------------------------------------------------------------------

@class ProfileContextMenu
@classdesc this class implements the BaseContextMenu class for the profiles
@extends BaseContextMenu
@hideconstructor

@--------------------------------------------------------------------------------------------------------------------------
*/

class ProfileContextMenu extends BaseContextMenu {

	/*
	constructor
	@param {Event} contextMenuEvent. The event that have triggered the menu
	@param {HTMLElement} parentNode The parent node of the menu. Can be null for leaflet objects
	*/

	constructor ( contextMenuEvent, parentNode = null ) {
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
			theNoteEditor.newRouteNote (
				{
					routeObjId : this.eventData.targetObjId,
					lat : this.eventData.latLng [ LAT ],
					lng : this.eventData.latLng [ LNG ]
				}
			);
			break;
		case 1 :
			new Zoomer ( ).zoomToLatLng ( [ this.eventData.latLng [ LAT ], this.eventData.latLng [ LNG ] ] );
			break;
		default :
			break;
		}
	}

	/* eslint-enable no-magic-numbers */

	/**
	menuItems getter. Implementation of the base class menuItem getter
	@readonly
	*/

	get menuItems ( ) {
		return [
			{
				itemText : theTranslator.getText ( 'ProfileContextMenu - Add a note to the route at this point' ),
				isActive : true
			},
			{
				itemText : theTranslator.getText ( 'ProfileContextMenu - Zoom to this point' ),
				isActive : true
			}
		];
	}
}

export default ProfileContextMenu;