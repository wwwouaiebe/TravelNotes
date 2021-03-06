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
	- v1.6.0:
		- created
	- v1.12.0:
		- Issue ♯120 : Review the UserInterface
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210914
Tests ...
*/

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
@event providersadded
fired when the ProvidersToolbarUI must be updated with a new provider
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
@event removeallobjects
fired when all objects have to be removed from the map
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
@event routeupdated
fired when a route must be updated, added or removed on the map
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
@event noteupdated
fired when a note must be updated, added or removed on the map
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
@event travelnameupdated
fired when a file is loaded and the travel name updated on theTravelUI
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
@event layerchange
fired when the background map must be changed
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
@event setrouteslist
fired when the route list must be updated on theTravelUI
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
@event setprovider
fired when the provider must be updated on theProvidersToolbarUI
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
@event settransitmode
fired when the transit mode must be updated on theProvidersToolbarUI
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
@event showitinerary
fired when ItineraryPaneUI must be visible and updated
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
@event updateitinerary
fired when ItineraryPaneUI must be updated
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
@event showtravelnotes
fired when TravelNotesPaneUI must be visible and updated
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
@event updatetravelnotes
fired when TravelNotesPaneUI must be updated
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
@event showsearch
fired when OsmSearchPaneUI must be visible and updated
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
@event updatesearch
fired when OsmSearchPaneUI must be updated
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
@event roadbookupdate
fired when the roadbook must be updated
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
@event geolocationstatuschanged
fired when theTravelNotesToolbarUI must be updated, changing the geolocation button
and when the geolocation marker must be removed from the map
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
@event geolocationpositionchanged
fired when the map must be updated, changing the position on the map
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
@event additinerarypointmarker
fired when an ItineraryPoint marker must be added to the map
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
@event addrectangle
fired when a rectangle must be added to the map
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
@event addsearchpointmarker
fired when a SearchPoint marker must be added to the map
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
@event addwaypoint
fired when a WayPoint must be added to the map
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
@event removeobject
fired when an object must be removed from the map
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
@event routepropertiesupdated
fired when the properties of a route must be changed on the map
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
@event zoomto
fired when a zoom to a point or to an array of points must be performed on the map
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
@event profileclosed
fired when a profile window is closed
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
@event uipinned
fired when a the pin button in the UI is clicked
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class contains methods for dispatching events
See theEventDispatcher for the one and only one instance of this class
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class EventDispatcher {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Creates and dispatch an event to the correct target
	@param {String} eventName the name of the event
	@param {Object} eventData An object to set as data property of the event
	*/

	dispatch ( eventName, eventData ) {
		const dispatchedEvent = new Event ( eventName );
		if ( eventData ) {
			dispatchedEvent.data = eventData;
		}
		document.dispatchEvent ( dispatchedEvent );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of EventDispatcher class
@type {EventDispatcher}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theEventDispatcher = new EventDispatcher ( );

export default theEventDispatcher;

/* --- End of file --------------------------------------------------------------------------------------------------------- */