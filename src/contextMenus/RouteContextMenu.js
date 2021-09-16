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

/**
@------------------------------------------------------------------------------------------------------------------------------

@file RouteContextMenu.js
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

import { ROUTE_EDITION_STATUS, ZERO, LAT, LNG } from '../main/Constants.js';

/**
@--------------------------------------------------------------------------------------------------------------------------

@class RouteContextMenu
@classdesc this class implements the BaseContextMenu class for the routes
@extends BaseContextMenu
@hideconstructor

@--------------------------------------------------------------------------------------------------------------------------
*/

class RouteContextMenu extends BaseContextMenu {

	/**
	The route for witch the context menu is displayed
	@type {Route}
	@private
	*/

	#route = null;

	/*
	constructor
	@param {Event} contextMenuEvent. The event that have triggered the menu
	@param {HTMLElement} parentNode The parent node of the menu. Can be null for leaflet objects
	*/

	constructor ( contextMenuEvent, parentNode = null ) {
		super ( contextMenuEvent, parentNode );
		this.#route = theDataSearchEngine.getRoute ( this.eventData.targetObjId );
	}

	/* eslint-disable no-magic-numbers */

	/**
	Perform the action selected by the user. Implementation of the base class doAction method
	@param {!number} selectedItemObjId The id of the item selected by the user
	*/

	doAction ( selectedItemObjId ) {
		switch ( selectedItemObjId ) {
		case 0 :
			theRouteEditor.editRoute ( this.eventData.targetObjId );
			break;
		case 1 :
			theRouteEditor.removeRoute ( this.eventData.targetObjId );
			break;
		case 2 :
			if ( this.#route.hidden ) {
				theRouteEditor.showRoute ( this.eventData.targetObjId );
			}
			else {
				theRouteEditor.hideRoute ( this.eventData.targetObjId );
			}
			break;
		case 3 :
			theRouteEditor.routeProperties ( this.eventData.targetObjId );
			break;
		case 4 :
			new Zoomer ( ).zoomToRoute ( this.eventData.targetObjId );
			break;
		case 5 :
			theProfileWindowsManager.showProfile ( this.eventData.targetObjId );
			break;
		case 6 :
			theRouteEditor.printRouteMap ( this.eventData.targetObjId );
			break;
		case 7 :
			theRouteEditor.saveGpx ( this.eventData.targetObjId );
			break;
		case 8 :
			theWayPointEditor.reverseWayPoints ( );
			break;
		case 9 :
			theNoteEditor.newRouteNote (
				{
					routeObjId : this.eventData.targetObjId,
					lat : this.eventData.latLng [ LAT ],
					lng : this.eventData.latLng [ LNG ]
				}
			);
			break;
		case 10 :
			new AllManeuverNotesBuilder ( ).addAllManeuverNotes ( this.eventData.targetObjId );
			break;
		case 11 :
			theRouteEditor.saveEdition ( );
			break;
		case 12 :
			theRouteEditor.cancelEdition ( );
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
				itemText : theTranslator.getText ( 'RouteContextMenu - Edit this route' ),
				isActive :
					(
						( this.eventData.targetObjId !== theTravelNotesData.travel.editedRoute.objId )
						&&
						( ROUTE_EDITION_STATUS.editedChanged !== theTravelNotesData.travel.editedRoute.editionStatus )
					)
			},
			{
				itemText : theTranslator.getText ( 'RouteContextMenu - Delete this route' ),
				isActive :
					(
						( this.eventData.targetObjId !== theTravelNotesData.travel.editedRoute.objId )
						||
						( ROUTE_EDITION_STATUS.editedChanged !== theTravelNotesData.travel.editedRoute.editionStatus )
					)
			},
			{
				itemText :
					theTranslator.getText (
						this.#route.hidden
							?
							'RouteContextMenu - Show this route'
							:
							'RouteContextMenu - Hide this route'
					),
				isActive :
					this.#route.hidden
					||
					theTravelNotesData.travel.editedRoute.objId !== this.eventData.targetObjId
			},
			{
				itemText : theTranslator.getText ( 'RouteContextMenu - Properties' ),
				isActive : ! this.#route.hidden
			},
			{
				itemText : theTranslator.getText ( 'RouteContextMenu - Zoom to route' ),
				isActive : ! this.#route.hidden
			},
			{
				itemText : theTranslator.getText ( 'RouteContextMenu - View the elevation' ),
				isActive : this.#route.itinerary.hasProfile
			},
			{
				itemText : theTranslator.getText ( 'RouteContextMenu - Print route map' ),
				isActive : theConfig.printRouteMap.isEnabled
			},
			{
				itemText : theTranslator.getText ( 'RouteContextMenu - Save this route in a GPX file' ),
				isActive : ( ZERO < this.#route.itinerary.itineraryPoints.length )
			},
			{
				itemText : theTranslator.getText ( 'RouteContextMenu - Invert waypoints' ),
				isActive : theTravelNotesData.travel.editedRoute.objId === this.eventData.targetObjId
			},
			{
				itemText : theTranslator.getText ( 'RouteContextMenu - Add a note on the route' ),
				isActive : ! this.eventData.haveParentNode
			},
			{
				itemText : theTranslator.getText ( 'RouteContextMenu - Create a note for each route maneuver' ),
				isActive : ! this.#route.hidden
			},
			{
				itemText : theTranslator.getText ( 'RouteContextMenu - Save modifications on this route' ),
				isActive : theTravelNotesData.travel.editedRoute.objId === this.eventData.targetObjId
			},
			{
				itemText : theTranslator.getText ( 'RouteContextMenu - Cancel modifications on this route' ),
				isActive : theTravelNotesData.travel.editedRoute.objId === this.eventData.targetObjId
			}
		];
	}
}

export default RouteContextMenu;

/*
--- End of RouteContextMenu.js file -------------------------------------------------------------------------------------------
*/