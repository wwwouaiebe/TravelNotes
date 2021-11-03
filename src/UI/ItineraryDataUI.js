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
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210915
Tests ...
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@file ItineraryDataUI.js
@copyright Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/
@license GNU General Public License

@------------------------------------------------------------------------------------------------------------------------------
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@module itineraryPaneUI

@------------------------------------------------------------------------------------------------------------------------------
*/

import theRouteHTMLViewsFactory from '../viewsFactories/RouteHTMLViewsFactory.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import NoteContextMenu from '../contextMenus/NoteContextMenu.js';
import ManeuverContextMenu from '../contextMenus/ManeuverContextMenu.js';
import theEventDispatcher from '../coreLib/EventDispatcher.js';

/**
@------------------------------------------------------------------------------------------------------------------------------

@class ManeuverContextMenuEL
@classdesc contextmenu event listener for the maneuvers
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class ManeuverContextMenuEL {

	/**
	A reference to the HTMLElement in witch the data have to be added
	@type {HTMLElement}
	*/

	#paneData = null;

	/*
	constructor
	*/

	constructor ( paneData ) {
		this.#paneData = paneData;
	}

	/**
	Event listener method
	*/

	handleEvent ( contextMenuEvent ) {
		contextMenuEvent.stopPropagation ( );
		contextMenuEvent.preventDefault ( );
		new ManeuverContextMenu ( contextMenuEvent, this.#paneData ).show ( );
	}
}

/**
@------------------------------------------------------------------------------------------------------------------------------

@class NoteContextMenuEL
@classdesc contextmenu event listener for the notes
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class NoteContextMenuEL {

	/**
	A reference to the HTMLElement in witch the data have to be added
	@type {HTMLElement}
	*/

	#paneData = null;

	/*
	constructor
	*/

	constructor ( paneData ) {
		Object.freeze ( this );
		this.#paneData = paneData;
	}

	/**
	Event listener method
	*/

	handleEvent ( contextMenuEvent ) {
		contextMenuEvent.stopPropagation ( );
		contextMenuEvent.preventDefault ( );
		new NoteContextMenu ( contextMenuEvent, this.#paneData ).show ( );
	}
}

/**
@------------------------------------------------------------------------------------------------------------------------------

@class ManeuverMouseEnterEL
@classdesc mouseenter event listener for maneuvers
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class ManeuverMouseEnterEL {

	/*
	constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	*/

	handleEvent ( mouseEvent ) {
		mouseEvent.stopPropagation ( );
		theEventDispatcher.dispatch (
			'additinerarypointmarker',
			{
				objId : Number.parseInt ( mouseEvent.target.dataset.tanMarkerObjId ),
				latLng :
					theTravelNotesData.travel.editedRoute.itinerary.itineraryPoints.getAt (
						theTravelNotesData.travel.editedRoute.itinerary.maneuvers.getAt (
							Number.parseInt ( mouseEvent.target.dataset.tanObjId )
						).itineraryPointObjId
					).latLng
			}
		);
	}
}

/**
@------------------------------------------------------------------------------------------------------------------------------

@class NoteMouseEnterEL
@classdesc mouseenter event listener for notes
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class NoteMouseEnterEL {

	/*
	constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	*/

	handleEvent ( mouseEvent ) {
		mouseEvent.stopPropagation ( );
		theEventDispatcher.dispatch (
			'additinerarypointmarker',
			{
				objId : Number.parseInt ( mouseEvent.target.dataset.tanMarkerObjId ),
				latLng :
					theTravelNotesData.travel.editedRoute.notes.getAt (
						Number.parseInt ( mouseEvent.target.dataset.tanObjId )
					).latLng
			}
		);
	}
}

/**
@------------------------------------------------------------------------------------------------------------------------------

@class NoteOrManeuverMouseLeaveEL
@classdesc mouseleave event listener notes and maneuvers
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class NoteOrManeuverMouseLeaveEL {

	/*
	constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	*/

	handleEvent ( mouseEvent ) {
		mouseEvent.stopPropagation ( );
		theEventDispatcher.dispatch (
			'removeobject',
			{ objId : Number.parseInt ( mouseEvent.target.dataset.tanMarkerObjId ) }
		);
	}
}

/**
@------------------------------------------------------------------------------------------------------------------------------

@class ItineraryDataUI
@classdesc This class manages the dataPane for the itineraries
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class ItineraryDataUI {

	/**
	A reference to the HTMLElement in witch the data have to be added
	@type {HTMLElement}
	*/

	#paneData = null;

	/**
	An HTMLElement with notes and maneuvers for the edited route
	@type {HTMLElement}
	*/

	#routeManeuversAndNotesHTML = null;

	/**
	maneuver contextmenu event listener
	@type {ManeuverContextMenuEL}
	*/

	#maneuverContextMenuEL = null;

	/**
	note contextmenu event listener
	@type {NoteContextMenuEL}
	*/

	#noteContextMenuEL = null;

	/**
	maneuver mouseenter event listener
	@type {ManeuverMouseEnterEL}
	*/

	#maneuverMouseEnterEL = null;

	/**
	note mouseenter event listener
	@type {NoteMouseEnterEL}
	*/

	#noteMouseEnterEL = null;

	/**
	maneuver or note mouseleave event listener
	@type {NoteOrManeuverMouseLeaveEL}
	*/

	#noteOrManeuverMouseLeaveEL = null;

	/**
	toggle the visibility of notes or maneuvers
	@param {String} objType The objType of objects to toggle
	*/

	#toggleNotesOrManeuver ( objType ) {
		this.#routeManeuversAndNotesHTML.childNodes.forEach (
			routeOrManeuverHTML => {
				if ( objType === routeOrManeuverHTML.dataset.tanObjType ) {
					routeOrManeuverHTML.classList.toggle ( 'TravelNotes-Hidden' );
				}
			}
		);
	}

	/*
	constructor
	@param {HTMLElement} paneData The HTMLElement in witch the data have to be added
	*/

	constructor ( paneData ) {

		Object.freeze ( this );

		this.#paneData = paneData;

		this.#maneuverContextMenuEL = new ManeuverContextMenuEL ( this.#paneData );
		this.#noteContextMenuEL = new NoteContextMenuEL ( this.#paneData );
		this.#maneuverMouseEnterEL = new ManeuverMouseEnterEL ( );
		this.#noteMouseEnterEL = new NoteMouseEnterEL ( );
		this.#noteOrManeuverMouseLeaveEL = new NoteOrManeuverMouseLeaveEL ( );
	}

	/**
	Show or hide the notes
	*/

	toggleNotes ( ) {
		this.#toggleNotesOrManeuver ( 'Note' );
	}

	/**
	Show or hide the maneuvers
	*/

	toggleManeuvers ( ) {
		this.#toggleNotesOrManeuver ( 'Maneuver' );
	}

	/**
	Add the notes and maneuvers for the edited route to the paneData
	*/

	addData ( ) {
		this.#routeManeuversAndNotesHTML = theRouteHTMLViewsFactory.getRouteManeuversAndNotesHTML (
			'TravelNotes-ItineraryPaneUI-',
			theTravelNotesData.travel.editedRoute,
			true
		);
		this.#routeManeuversAndNotesHTML.childNodes.forEach (
			routeOrManeuverHTML => {
				if ( 'Maneuver' === routeOrManeuverHTML.dataset.tanObjType ) {
					routeOrManeuverHTML.addEventListener ( 'contextmenu', this.#maneuverContextMenuEL );
					routeOrManeuverHTML.addEventListener ( 'mouseenter', this.#maneuverMouseEnterEL );
					routeOrManeuverHTML.addEventListener ( 'mouseleave', this.#noteOrManeuverMouseLeaveEL );
				}
				else if ( 'Note' === routeOrManeuverHTML.dataset.tanObjType ) {
					routeOrManeuverHTML.addEventListener ( 'contextmenu', this.#noteContextMenuEL );
					routeOrManeuverHTML.addEventListener ( 'mouseenter', this.#noteMouseEnterEL );
					routeOrManeuverHTML.addEventListener ( 'mouseleave', this.#noteOrManeuverMouseLeaveEL );
				}
			}
		);
		this.#paneData.appendChild ( this.#routeManeuversAndNotesHTML );
	}

	/**
	Remove the notes and maneuvers for the edited route from the paneData
	*/

	clearData ( ) {
		if ( this.#routeManeuversAndNotesHTML ) {
			this.#routeManeuversAndNotesHTML.childNodes.forEach (
				routeOrManeuverHTML => {
					if ( 'Maneuver' === routeOrManeuverHTML.dataset.tanObjType ) {
						routeOrManeuverHTML.removeEventListener ( 'contextmenu', this.#maneuverContextMenuEL );
						routeOrManeuverHTML.removeEventListener ( 'mouseenter', this.#maneuverMouseEnterEL );
						routeOrManeuverHTML.removeEventListener ( 'mouseleave', this.#noteOrManeuverMouseLeaveEL );
					}
					else if ( 'Note' === routeOrManeuverHTML.dataset.tanObjType ) {
						routeOrManeuverHTML.removeEventListener ( 'contextmenu', this.#noteContextMenuEL );
						routeOrManeuverHTML.removeEventListener ( 'mouseenter', this.#noteMouseEnterEL );
						routeOrManeuverHTML.removeEventListener ( 'mouseleave', this.#noteOrManeuverMouseLeaveEL );
					}
				}
			);
			this.#paneData.removeChild ( this.#routeManeuversAndNotesHTML );
		}
		this.#routeManeuversAndNotesHTML = null;
	}
}

export default ItineraryDataUI;

/*
@------------------------------------------------------------------------------------------------------------------------------

end of ItineraryDataUI.js file

@------------------------------------------------------------------------------------------------------------------------------
*/