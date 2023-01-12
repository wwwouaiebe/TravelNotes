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

import theTravelNotesData from '../data/TravelNotesData.js';
import theGeometry from '../core/lib/Geometry.js';
import theSphericalTrigonometry from '../core/lib/SphericalTrigonometry.js';
import NoteAndRoute from '../data/NoteAndRoute.js';
import DataSearchEngineNearestRouteData from './DataSearchEngineNearestRouteData.js';

import { INVALID_OBJ_ID } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Class with helper methods to search data
See theDataSearchEngine for the one and only one instance of this class
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class DataSearchEngine {

	/**
	Helper method for the getNearestRouteData method
	@param {Route} route The route that must be treated
	@param {Array.<Number>} latLng The latitude and longitude of the nearest point on route
	@param {DataSearchEngineNearestRouteData} nearestRouteData the DataSearchEngineNearestRouteData object used
	*/

	#setNearestRouteData ( route, latLng, nearestRouteData ) {
		if ( route.objId !== theTravelNotesData.editedRouteObjId ) {
			const pointAndDistance = theGeometry.getClosestLatLngDistance ( route, latLng );
			if ( pointAndDistance ) {
				const distanceToRoute = theSphericalTrigonometry.pointsDistance (
					latLng,
					pointAndDistance.latLng
				);
				if ( distanceToRoute < nearestRouteData.distance ) {
					nearestRouteData.route = route;
					nearestRouteData.distance = distanceToRoute;
					nearestRouteData.latLngOnRoute = pointAndDistance.latLng;
					nearestRouteData.distanceOnRoute = pointAndDistance.distance;
				}
			}
		}
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	This method search route data for the nearest route of a given point
	@param {Array.<Number>} latLng The latitude and longitude of the point
	@return {DataSearchEngineNearestRouteData} A DataSearchEngineNearestRouteData object
	*/

	getNearestRouteData ( latLng ) {
		const nearestRouteData = new DataSearchEngineNearestRouteData ( );

		theTravelNotesData.travel.routes.forEach ( route => this.#setNearestRouteData ( route, latLng, nearestRouteData ) );
		if ( INVALID_OBJ_ID !== theTravelNotesData.editedRouteObjId ) {
			this.#setNearestRouteData ( theTravelNotesData.travel.editedRoute, latLng, nearestRouteData );
		}

		return Object.freeze ( nearestRouteData	);
	}

	/**
	Search a route with the route objId
	@param {Number} routeObjId the objId of the route to search
	@return {?Route} the searched route or null if not found
	*/

	getRoute ( routeObjId ) {
		let route = null;
		route = theTravelNotesData.travel.routes.getAt ( routeObjId );
		if ( ! route ) {
			if ( routeObjId === theTravelNotesData.travel.editedRoute.objId ) {
				route = theTravelNotesData.travel.editedRoute;
			}
		}
		return route;
	}

	/**
	Search a Note and a the Route to witch the Note is attached with the Note objId
	@param {Number} noteObjId the objId of the note to search
	@return {NoteAndRoute} a NoteAndRoute object with the route and note
	*/

	getNoteAndRoute ( noteObjId ) {
		let note = null;
		let route = null;
		note = theTravelNotesData.travel.notes.getAt ( noteObjId );
		if ( ! note ) {
			const routeIterator = theTravelNotesData.travel.routes.iterator;
			while ( ! ( routeIterator.done || note ) ) {
				note = routeIterator.value.notes.getAt ( noteObjId );
				if ( note ) {
					route = routeIterator.value;
				}
			}
			if ( ! note ) {
				note = theTravelNotesData.travel.editedRoute.notes.getAt ( noteObjId );
				if ( note ) {
					route = theTravelNotesData.travel.editedRoute;
				}
			}
		}
		return new NoteAndRoute ( note, route );
	}

	/**
	Search a WayPoint with the WayPoint objId
	@param {Number} wayPointObjId the objId of the WayPoint to search
	@return {WayPoint} a WayPoint
	*/

	getWayPoint ( wayPointObjId ) {
		let wayPoint = theTravelNotesData.travel.editedRoute.wayPoints.getAt ( wayPointObjId );
		if ( ! wayPoint ) {
			const routeIterator = theTravelNotesData.travel.routes.iterator;
			while ( ! ( routeIterator.done || wayPoint ) ) {
				wayPoint = routeIterator.value.wayPoints.getAt ( wayPointObjId );
			}
		}
		return wayPoint;
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of DataSearchEngine class
@type {DataSearchEngine}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theDataSearchEngine = new DataSearchEngine ( );

export default theDataSearchEngine;

/* --- End of file --------------------------------------------------------------------------------------------------------- */