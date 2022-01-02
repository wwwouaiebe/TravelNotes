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
	- v2.1.0:
		- Issue ♯150 : Merge travelNotes and plugins
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210915
Tests ...
*/

import theSphericalTrigonometry from '../coreLib/SphericalTrigonometry.js';
import ItineraryPoint from '../data/ItineraryPoint.js';
import Maneuver from '../data/Maneuver.js';
import BaseRouteProvider from '../routeProviders/BaseRouteProvider.js';

import { ZERO, ONE, TWO, LAT, LNG, DEGREES } from '../main/Constants.js';

/**
@ignore
*/

const OUR_HALF_PI = Math.PI / TWO;

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class implements the BaseRouteProvider for a polyline or circle. It's not possible to instanciate
this class because the class is not exported from the module. Only one instance is created and added to the list
of Providers of TravelNotes
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class PolylineRouteProvider extends BaseRouteProvider {

	/**
	A reference to the edited route
	@type {Route}
	*/

	#route;

	/**
	Translations for instructions
	@type {Object}
	*/

	static get #INSTRUCTIONS_LIST ( ) {
		return Object.freeze (
			{
				en : Object.freeze ( { kStart : 'Start', kContinue : 'Continue', kEnd : 'Stop' } ),
				fr : Object.freeze ( { kStart : 'Départ', kContinue : 'Continuer', kEnd : 'Arrivée' } )
			}
		);
	}

	/**
	Enum for icons names
	@type {Object}
	*/

	static get #ICON_NAMES ( ) {
		return Object.freeze (
			{
				kStart : 'kDepartDefault',
				kContinue : 'kContinueStraight',
				kEnd : 'kArriveDefault'
			}
		);
	}

	/**
	Add a maneuver to the itinerary
	@param {Number} itineraryPointObjId the objId of the itineraryPoint linked to the maneuver
	@param {String} position the position of the maneuver. Must be kStart or kEnd
	*/

	#addManeuver ( itineraryPointObjId, position ) {
		const maneuver = new Maneuver ( );

		maneuver.iconName = PolylineRouteProvider.#ICON_NAMES [ position ];
		maneuver.instruction =
			PolylineRouteProvider.#INSTRUCTIONS_LIST [ this.userLanguage ]
				?
				PolylineRouteProvider.#INSTRUCTIONS_LIST [ this.userLanguage ] [ position ]
				:
				PolylineRouteProvider.#INSTRUCTIONS_LIST.en [ position ];
		maneuver.duration = ZERO;
		maneuver.itineraryPointObjId = itineraryPointObjId;

		this.#route.itinerary.maneuvers.add ( maneuver );
	}

	/**
	Add a itineraryPoint to the itineraryPoints collection
	@param {Array.<Number>} latLng the position of the itineraryPoint
	@return {Number} the objId of the new itineraryPoint
	*/

	#addItineraryPoint ( latLng ) {
		const itineraryPoint = new ItineraryPoint ( );
		itineraryPoint.latLng = latLng;
		this.#route.itinerary.itineraryPoints.add ( itineraryPoint );
		return itineraryPoint.objId;
	}

	/**
	This method add 64 intermediates points on a stuff of great circle
	@param {WayPoint} startWayPoint the starting wayPoint
	@param {WayPoint} endWaypoint the ending wayPoint
	*/

	#addIntermediateItineraryPoints ( startWayPoint, endWaypoint ) {

		// first conversion to radian
		const latLngStartPoint = [
			startWayPoint.lat * DEGREES.toRadians,
			startWayPoint.lng * DEGREES.toRadians
		];
		const latLngEndPoint = [
			endWaypoint.lat * DEGREES.toRadians,
			endWaypoint.lng * DEGREES.toRadians
		];

		// searching the direction: from west to east or east to west...
		const WestEast =
			( endWaypoint.lng - startWayPoint.lng + DEGREES.d360 ) % DEGREES.d360 > DEGREES.d180
				?
				-ONE
				:
				ONE;

		// computing the distance
		const angularDistance = theSphericalTrigonometry.arcFromSummitArcArc (
			latLngEndPoint [ LNG ] - latLngStartPoint [ LNG ],
			OUR_HALF_PI - latLngStartPoint [ LAT ],
			OUR_HALF_PI - latLngEndPoint [ LAT ]
		);

		/* for short distances a single line is ok */
		/* eslint-disable-next-line no-magic-numbers */
		if ( 0.1 > angularDistance * DEGREES.fromRadians ) {
			return;
		}

		// and the direction at the start point
		const direction = theSphericalTrigonometry.summitFromArcArcArc (
			OUR_HALF_PI - latLngStartPoint [ LAT ],
			angularDistance,
			OUR_HALF_PI - latLngEndPoint [ LAT ]
		);

		const addedSegments = 64;
		const itineraryPoints = [];

		// loop to compute the added segments
		for ( let counter = 1; counter <= addedSegments; counter ++ ) {
			const partialDistance = angularDistance * counter / addedSegments;

			// computing the opposite arc to the start point
			const tmpArc = theSphericalTrigonometry.arcFromSummitArcArc (
				direction,
				OUR_HALF_PI - latLngStartPoint [ LAT ],
				partialDistance
			);

			// computing the lng
			const deltaLng = theSphericalTrigonometry.summitFromArcArcArc (
				OUR_HALF_PI - latLngStartPoint [ LAT ],
				tmpArc,
				partialDistance
			);

			// adding the itinerary point to a tmp array
			const itineraryPoint = new ItineraryPoint ( );
			itineraryPoint.latLng = [
				( OUR_HALF_PI - tmpArc ) * DEGREES.fromRadians,
				( latLngStartPoint [ LNG ] + ( WestEast * deltaLng ) ) * DEGREES.fromRadians
			];
			itineraryPoints.push ( itineraryPoint );
		}

		// last added itinerary point  is the same than the end waypoint, so we remove and we adapt the lng
		// of the end waypoint ( we can have a difference of 360 degree due to computing east or west
		endWaypoint.lng = itineraryPoints.pop ( ).lng;

		// adding itinerary points to the route
		itineraryPoints.forEach ( itineraryPoint => this.#route.itinerary.itineraryPoints.add ( itineraryPoint ) );
	}

	/**
	Set a stuff of great circle as itinerary
	*/

	#parseGreatCircle ( ) {
		let wayPointsIterator = this.#route.wayPoints.iterator;
		let previousWayPoint = null;
		while ( ! wayPointsIterator.done ) {
			if ( wayPointsIterator.first ) {

				// first point... adding an itinerary point and the start maneuver
				previousWayPoint = wayPointsIterator.value;
				this.#addManeuver (
					this.#addItineraryPoint ( wayPointsIterator.value.latLng ),
					'kStart'
				);
			}
			else {

				// next points.... adding intermediate points, itinerary point and maneuver
				this.#addIntermediateItineraryPoints (
					previousWayPoint,
					wayPointsIterator.value
				);
				this.#addManeuver (
					this.#addItineraryPoint ( wayPointsIterator.value.latLng ),
					wayPointsIterator.last ? 'kEnd' : 'kContinue'
				);
				previousWayPoint = wayPointsIterator.value;
			}
		}

		// moving complete travel if needed, so we are always near the origine
		let maxLng = -Number.MAX_VALUE;
		let itineraryPointsIterator = this.#route.itinerary.itineraryPoints.iterator;
		while ( ! itineraryPointsIterator.done ) {
			maxLng = Math.max ( maxLng, itineraryPointsIterator.value.lng );
		}
		const deltaLng = ( maxLng % DEGREES.d360 ) - maxLng;

		itineraryPointsIterator = this.#route.itinerary.itineraryPoints.iterator;
		while ( ! itineraryPointsIterator.done ) {
			itineraryPointsIterator.value.lng += deltaLng;
		}
		wayPointsIterator = this.#route.wayPoints.iterator;
		while ( ! wayPointsIterator.done ) {
			wayPointsIterator.value.lng += deltaLng;
		}
	}

	/**
	this function set a circle as itinerary
	*/

	#parseCircle ( ) {

		const centerPoint = [
			this.#route.wayPoints.first.lat * DEGREES.toRadians,
			this.#route.wayPoints.first.lng * DEGREES.toRadians
		];

		const distancePoint = [
			this.#route.wayPoints.last.lat * DEGREES.toRadians,
			this.#route.wayPoints.last.lng * DEGREES.toRadians
		];

		const angularDistance = theSphericalTrigonometry.arcFromSummitArcArc (
			centerPoint [ LNG ] - distancePoint [ LNG ],
			OUR_HALF_PI - centerPoint [ LAT ],
			OUR_HALF_PI - distancePoint [ LAT ]
		);

		const addedSegments = 360;
		const itineraryPoints = [];

		// loop to compute the added segments
		for ( let counter = 0; counter <= addedSegments; counter ++ ) {

			const direction = ( Math.PI / ( TWO * addedSegments ) ) + ( ( Math.PI * counter ) / addedSegments );

			const tmpArc = theSphericalTrigonometry.arcFromSummitArcArc (
				direction,
				angularDistance,
				OUR_HALF_PI - centerPoint [ LAT ]
			);

			const deltaLng = theSphericalTrigonometry.summitFromArcArcArc (
				OUR_HALF_PI - centerPoint [ LAT ],
				tmpArc,
				angularDistance
			);
			let itineraryPoint = new ItineraryPoint ( );
			itineraryPoint.latLng = [
				( OUR_HALF_PI - tmpArc ) * DEGREES.fromRadians,
				( centerPoint [ LNG ] + deltaLng ) * DEGREES.fromRadians
			];
			itineraryPoints.push ( itineraryPoint );

			itineraryPoint = new ItineraryPoint ( );
			itineraryPoint.latLng = [
				( OUR_HALF_PI - tmpArc ) * DEGREES.fromRadians,
				( centerPoint [ LNG ] - deltaLng ) * DEGREES.fromRadians
			];
			itineraryPoints.unshift ( itineraryPoint );
			if ( counter === addedSegments ) {
				this.#addManeuver ( itineraryPoint.objId, 'kStart' );
				itineraryPoint = new ItineraryPoint ( );
				itineraryPoint.latLng = [
					( OUR_HALF_PI - tmpArc ) * DEGREES.fromRadians,
					( centerPoint [ LNG ] - deltaLng ) * DEGREES.fromRadians
				];
				this.#addManeuver ( itineraryPoint.objId, 'kEnd' );
				itineraryPoints.push ( itineraryPoint );
			}
		}

		itineraryPoints.forEach ( itineraryPoint => this.#route.itinerary.itineraryPoints.add ( itineraryPoint ) );

	}

	/**
	Build a polyline (as stuff of a great circle) or a circle from the start and end wayPoints
	@param {function} onOk a function to call when the response is parsed correctly
	@param {function} onError a function to call when an error occurs
	*/

	#parseResponse ( onOk, onError ) {
		try {
			this.#route.itinerary.itineraryPoints.removeAll ( );
			this.#route.itinerary.maneuvers.removeAll ( );
			this.#route.itinerary.hasProfile = false;
			this.#route.itinerary.ascent = ZERO;
			this.#route.itinerary.descent = ZERO;

			switch ( this.#route.itinerary.transitMode ) {
			case 'line' :
				this.#parseGreatCircle ( );
				break;
			case 'circle' :
				this.#parseCircle ( );
				break;
			default :
				break;
			}
			onOk ( this.#route );
		}
		catch ( err ) { onError ( err ); }
	}

	/**
	The constructor
	*/

	constructor ( ) {
		super ( );
	}

	/**
	Call the provider, using the waypoints defined in the route and, on success,
	complete the route with the data from the provider
	@param {Route} route The route to witch the data will be added
	@return {Promise} A Promise. On success, the Route is completed with the data given by the provider.
	*/

	getPromiseRoute ( route ) {
		this.#route = route;
		return new Promise ( ( onOk, onError ) => this.#parseResponse ( onOk, onError ) );
	}

	/**
	The icon used in the ProviderToolbarUI.
	Overload of the base class icon property
	@type {String}
	*/

	get icon ( ) {
		return 'data:image/svg+xml;utf8,<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" > <circle cx="12" c' +
			'y="12" r="3" stroke="rgb(0,0,0)" fill="transparent" /> <line x1="5" y1="17" x2="11" y2="2" stroke="rgb(0,0,0)" ' +
			'/> <line x1="3" y1="6" x2="17" y2="9" stroke="rgb(191,0,0)" /> <line x1="3" y1="16" x2="17" y2="5" stroke="rgb(' +
			'255,204,0)" /> </svg>';
	}

	/**
	The provider name.
	Overload of the base class name property
	@type {String}
	*/

	get name ( ) { return 'Polyline'; }

	/**
	The title to display in the ProviderToolbarUI button.
	Overload of the base class title property
	@type {String}
	*/

	get title ( ) { return 'Polyline & Circle'; }

	/**
	The possible transit modes for the provider.
	Overload of the base class transitModes property
	Must be a subarray of [ 'bike', 'pedestrian', 'car', 'train', 'line', 'circle' ]
	@type {Array.<String>}
	*/

	get transitModes ( ) { return [ 'line', 'circle' ]; }

	/**
	A boolean indicating when a provider key is needed for the provider.
	Overload of the base class providerKeyNeeded property
	@type {Boolean}
	*/

	get providerKeyNeeded ( ) { return false; }
}

window.TaN.addProvider ( PolylineRouteProvider );

/* --- End of file --------------------------------------------------------------------------------------------------------- */