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
	-v1.7.0:
		- modified way of working for myPointsDistance ( )
		- Issue ♯89 : Add elevation graph => new method getLatLngElevAtDist ( )
	- v1.9.0:
		- Issue ♯101 : Add a print command for a route
	- v1.13.0:
		- Issue ♯125 : Outphase osmSearch and add it to TravelNotes
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210914
Tests ...
*/

import theTravelNotesData from '../data/TravelNotesData.js';
import { DISTANCE, ZERO, ONE, TWO, DEGREES, LAT_LNG, EARTH_RADIUS } from '../main/Constants.js';
import { LatLngDistance, LatLngElevOnRoute } from '../coreLib/Containers.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class contains methods for geometry operations requiring call to Leaflet functions

See theGeometry for the one and only one instance of this class
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class Geometry {

	/**
	Simple constant for computation
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #HUNDRED ( ) { return 100; }

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Compute the latitude, longitude, elevation, ascent and distance of a point on a route when only the distance between
	the beginning of the route and the point is know
	@param {Route} route The route
	@param {Number} distance The distance (units: meter)
	@return {LatLngElevOnRoute} A LatLngElevOnRoute with the desired values
	*/

	getLatLngElevAtDist ( route, distance ) {
		if ( route.distance <= distance || ZERO >= distance ) {
			return null;
		}
		let nearestDistance = 0;
		const itineraryPointsIterator = route.itinerary.itineraryPoints.iterator;
		while ( nearestDistance < distance && ! itineraryPointsIterator.done ) {
			nearestDistance += itineraryPointsIterator.value.distance;
		}
		const previousItineraryPoint = itineraryPointsIterator.value;
		itineraryPointsIterator.done;
		const scale = ( previousItineraryPoint.distance - nearestDistance + distance ) / previousItineraryPoint.distance;

		return new LatLngElevOnRoute (
			previousItineraryPoint.lat + ( ( itineraryPointsIterator.value.lat - previousItineraryPoint.lat ) * scale ),
			previousItineraryPoint.lng + ( ( itineraryPointsIterator.value.lng - previousItineraryPoint.lng ) * scale ),
			distance,
			previousItineraryPoint.elev + ( ( itineraryPointsIterator.value.elev - previousItineraryPoint.elev ) * scale ),
			Geometry.#HUNDRED *
				( itineraryPointsIterator.value.elev - previousItineraryPoint.elev ) / 	previousItineraryPoint.distance
		);
	}

	/**
	This method search the nearest point on a route from a given point and compute the distance
	between the beginning of the route and the nearest point
	@param {Route} route The route object to be used
	@param {Array.<Number>} latLng The latitude and longitude of the point
	@return {LatLngDistance} An object with the latitude, longitude and distance
	*/

	getClosestLatLngDistance ( route, latLng ) {
		if ( ZERO === route.itinerary.itineraryPoints.length ) {
			return null;
		}
		const itineraryPointIterator = route.itinerary.itineraryPoints.iterator;
		itineraryPointIterator.done;
		let minDistance = Number.MAX_VALUE;

		// projections of points are made
		const point = window.L.Projection.SphericalMercator.project (
			window.L.latLng ( latLng [ ZERO ], latLng [ ONE ] ) );
		let point1 = window.L.Projection.SphericalMercator.project (
			window.L.latLng ( itineraryPointIterator.value.lat, itineraryPointIterator.value.lng )
		);
		let closestLatLng = null;
		let closestDistance = DISTANCE.defaultValue;
		let endSegmentDistance = itineraryPointIterator.value.distance;
		while ( ! itineraryPointIterator.done ) {
			const point2 = window.L.Projection.SphericalMercator.project (
				window.L.latLng ( itineraryPointIterator.value.lat, itineraryPointIterator.value.lng )
			);
			let distance = window.L.LineUtil.pointToSegmentDistance ( point, point1, point2 );
			if ( distance < minDistance ) {
				minDistance = distance;
				closestLatLng = window.L.Projection.SphericalMercator.unproject (
					window.L.LineUtil.closestPointOnSegment ( point, point1, point2 )
				);
				closestDistance =
					endSegmentDistance -
					closestLatLng.distanceTo (
						window.L.latLng ( itineraryPointIterator.value.lat, itineraryPointIterator.value.lng )
					);
			}
			endSegmentDistance += itineraryPointIterator.value.distance;
			point1 = point2;
		}
		return new LatLngDistance ( closestLatLng.lat, closestLatLng.lng, closestDistance );
	}

	/**
	This method build a window.L.latLngBounds object from an array of points
	@param {Array.<Array.<number>>} latLngs the array of latitude and longitude
	@return {LeafletObject} a Leaflet latLngBounds object
	*/

	getLatLngBounds ( latLngs ) {
		const sw = window.L.latLng ( [ LAT_LNG.maxLat, LAT_LNG.maxLng ] );
		const ne = window.L.latLng ( [ LAT_LNG.minLat, LAT_LNG.minLng ] );
		latLngs.forEach (
			latLng => {
				sw.lat = Math.min ( sw.lat, latLng [ ZERO ] );
				sw.lng = Math.min ( sw.lng, latLng [ ONE ] );
				ne.lat = Math.max ( ne.lat, latLng [ ZERO ] );
				ne.lng = Math.max ( ne.lng, latLng [ ONE ] );
			}
		);
		return window.L.latLngBounds ( sw, ne );
	}

	/**
	This method returns a window.L.latLngBounds that represents a square
	@param {Array.<Number>} latLngCenter The latitude and longitude of the center of the square
	@param {Number} dimension The half length of the square side in meter.
	*/

	getSquareBoundingBox ( latLngCenter, dimension ) {
		const latCenterRad = latLngCenter [ ZERO ] * DEGREES.toRadians;
		const deltaLat = ( dimension / EARTH_RADIUS ) * DEGREES.fromRadians;
		const deltaLng =
			Math.acos (
				( Math.cos ( dimension / EARTH_RADIUS ) - ( Math.sin ( latCenterRad ) ** TWO ) ) /
				( Math.cos ( latCenterRad ) ** TWO )
			) * DEGREES.fromRadians;
		return window.L.latLngBounds (
			window.L.latLng ( [ latLngCenter [ ZERO ] - deltaLat, latLngCenter [ ONE ] - deltaLng ] ),
			window.L.latLng ( [ latLngCenter [ ZERO ] + deltaLat, latLngCenter [ ONE ] + deltaLng ] )
		);
	}

	/**
	This method transforms a lat lng coordinate to pixel coordinate relative to the CRS origin using the Leaflet
	method map.project
	@param {Array.<Number>} latLng The latitude and longitude of the point
	@param {Number} zoom The zoom factor to use
	@return {Array.<Number>} An array with the projected point
	*/

	project ( latLng, zoom ) {
		const projection = theTravelNotesData.map.project ( window.L.latLng ( latLng ), zoom );
		return [ projection.x, projection.y ];
	}

	/**
	Transform a screen coordinate to a latLng using the Leaflet map.containerPointToLatLng method
	@param {Number} xScreen  The x screen coordinate
	@param {Number} yScreen  The y screen coordinate
	@return {Array.<Number>} The latitude and longitude of the point
	*/

	screenCoordToLatLng ( xScreen, yScreen ) {
		const latLng = theTravelNotesData.map.containerPointToLatLng ( window.L.point ( xScreen, yScreen ) );
		return [ latLng.lat, latLng.lng ];
	}

	/**
	Add two points
	@param {Array.<Number>} point1 the first point to add
	@param {Array.<Number>} point2 the second point to add
	@return {Array.<Number>}  The result point
	*/

	addPoints ( point1, point2 ) {
		return [
			point1 [ ZERO ] + point2 [ ZERO ],
			point1 [ ONE ] + point2 [ ONE ]
		];
	}

	/**
	Subtrack two points
	@param {Array.<Number>} point1 the first point
	@param {Array.<Number>} point2 the point to subtrack
	@return {Array.<Number>} The result point
	*/

	subtrackPoints ( point1, point2 ) {
		return [
			point1 [ ZERO ] - point2 [ ZERO ],
			point1 [ ONE ] - point2 [ ONE ]
		];
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of Geometry class
@type {Geometry}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theGeometry = new Geometry ( );

export default theGeometry;

/* --- End of file --------------------------------------------------------------------------------------------------------- */