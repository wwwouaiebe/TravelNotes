/*
Copyright - 2017 2023 - wwwouaiebe - Contact: https://www.ouaie.be/

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

import theEventDispatcher from './lib/EventDispatcher.js';
import theDataSearchEngine from '../data/DataSearchEngine.js';
import theTravelNotesData from '../data/TravelNotesData.js';
import { INVALID_OBJ_ID } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class implements a zoom command on multiple objects
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class Zoomer {

	/**
	An array with the lat and lng of all the objects on witch the zoom have to be performed
	@type {Array.<Array.<Number>>}
	*/

	#geometry = [];

	/**
	This method push the latitude and longitude of a note in the #geometry array
	@param {Note} note the note to push
	*/

	#pushNoteGeometry ( note ) {
		this.#geometry.push ( note.latLng );
		this.#geometry.push ( note.iconLatLng );
	}

	/**
	This method push the latitude and longitude of a route in the #geometry array
	@param {Route} route the route to push
	*/

	#pushRouteGeometry ( route ) {
		route.itinerary.itineraryPoints.forEach ( itineraryPoint => this.#geometry.push ( itineraryPoint.latLng ) );
		route.notes.forEach (
			note => this.#pushNoteGeometry ( note )
		);
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Performs a zoom on a point
	@param {Array.<Number>} latLng The latitude and longitude of the point
	*/

	zoomToLatLng ( latLng ) {
		theEventDispatcher.dispatch ( 'zoomto', { latLng : latLng } );
	}

	/**
	Performs a zoom on a note
	@param {Number} noteObjId the objId of the note on witch the zoom must be performed
	*/

	zoomToNote ( noteObjId ) {
		this.#geometry = [];
		this.#pushNoteGeometry ( theDataSearchEngine.getNoteAndRoute ( noteObjId ).note );
		theEventDispatcher.dispatch (
			'zoomto',
			{
				geometry : [ this.#geometry ]
			}
		);
	}

	/**
	Performs a zoom on a route
	@param {Number} routeObjId the objId of the route on witch the zoom must be performed
	*/

	zoomToRoute ( routeObjId ) {
		this.#geometry = [];

		this.#pushRouteGeometry ( theDataSearchEngine.getRoute ( routeObjId ) );

		theEventDispatcher.dispatch (
			'zoomto',
			{
				geometry : [ this.#geometry ]
			}
		);
	}

	/**
	Performs a zoom on a complete travel
	*/

	zoomToTravel ( ) {
		this.#geometry = [];
		theTravelNotesData.travel.routes.forEach (
			route => this.#pushRouteGeometry ( route )
		);
		if ( INVALID_OBJ_ID !== theTravelNotesData.travel.editedRouteObjId ) {
			this.#pushRouteGeometry ( theTravelNotesData.travel.editedRoute );
		}
		theTravelNotesData.travel.notes.forEach (
			note => this.#pushNoteGeometry ( note )
		);
		theEventDispatcher.dispatch (
			'zoomto',
			{
				geometry : [ this.#geometry ]
			}
		);
	}

	/**
	Performs a zoom on a poi (point of interest = a search result from osm)
	@param {PoiData} poi Poi on witch the zoom must be performed
	*/

	zoomToPoi ( poi ) {
		theEventDispatcher.dispatch ( 'zoomto', poi );
	}
}

export default Zoomer;

/* --- End of file --------------------------------------------------------------------------------------------------------- */