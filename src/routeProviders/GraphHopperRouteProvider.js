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

import PolylineEncoder from '../coreLib/PolylineEncoder.js';
import ItineraryPoint from '../data/ItineraryPoint.js';
import Maneuver from '../data/Maneuver.js';
import BaseRouteProvider from '../routeProviders/BaseRouteProvider.js';

import { ZERO, TWO, LAT, LNG, ELEVATION, LAT_LNG, HTTP_STATUS_OK, DISTANCE } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class implements the BaseRouteProvider interface for Graphhopper.
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class GraphHopperRouteProvider extends BaseRouteProvider {

	/**
	The provider key. Will be set by TravelNotes
	@type {String}
	*/

	#providerKey;

	/**
	A reference to the edited route
	@type {Route}
	*/

	#route;

	/**
	The round value used by PolylineEncoder
	@type {Number}
	*/
	// eslint-disable-next-line no-magic-numbers
	static get #ROUND_VALUE ( ) { return 5; }

	/**
	Enum for icons
	@type {Array.<String>}
	*/

	static get #ICON_LIST ( ) {
		return [
			'kUndefined',
			'kTurnSharpLeft', // TURN_SHARP_LEFT = -3
			'kTurnLeft', // TURN_LEFT = -2
			'kTurnSlightLeft', // TURN_SLIGHT_LEFT = -1
			'kContinueStraight', // CONTINUE_ON_STREET = 0
			'kTurnSlightRight', // TURN_SLIGHT_RIGHT = 1
			'kTurnRight', // TURN_RIGHT = 2
			'kTurnSharpRight', // TURN_SHARP_RIGHT = 3
			'kArriveDefault', // FINISH = 4
			'kArriveDefault', // VIA_REACHED = 5
			'kRoundaboutRight' // USE_ROUNDABOUT = 6
		];
	}

	/**
	Parse the response from the provider and add the received itinerary to the route itinerary
	@param {JsonObject} response the itinerary received from the provider
	@param {function} onOk a function to call when the response is parsed correctly
	@param {function} onError a function to call when an error occurs
	*/

	#parseResponse ( response, onOk, onError ) {

		if ( ZERO === response.paths.length ) {
			onError ( 'Route not found' );
			return;
		}

		const polylineEncoder = new PolylineEncoder ( );
		this.#route.itinerary.itineraryPoints.removeAll ( );
		this.#route.itinerary.maneuvers.removeAll ( );
		this.#route.itinerary.hasProfile = true;
		this.#route.itinerary.ascent = ZERO;
		this.#route.itinerary.descent = ZERO;
		response.paths.forEach (
			path => {
				path.points = polylineEncoder.decode (
					path.points,
					[ GraphHopperRouteProvider.#ROUND_VALUE, GraphHopperRouteProvider.#ROUND_VALUE, TWO ]
				);
				/* eslint-disable-next-line camelcase */
				path.snapped_waypoints = polylineEncoder.decode (
					path.snapped_waypoints,
					[ GraphHopperRouteProvider.#ROUND_VALUE, GraphHopperRouteProvider.#ROUND_VALUE, TWO ]
				);
				const itineraryPoints = [];
				for ( let pointsCounter = ZERO; pointsCounter < path.points.length; pointsCounter ++ ) {
					const itineraryPoint = new ItineraryPoint ( );
					itineraryPoint.lat = path.points [ pointsCounter ] [ LAT ];
					itineraryPoint.lng = path.points [ pointsCounter ] [ LNG ];
					itineraryPoint.elev = path.points [ pointsCounter ] [ ELEVATION ];
					itineraryPoints.push ( itineraryPoint );
					this.#route.itinerary.itineraryPoints.add ( itineraryPoint );
				}

				let previousIconName = '';
				path.instructions.forEach (
					instruction => {
						const maneuver = new Maneuver ( );
						// eslint-disable-next-line no-magic-numbers
						maneuver.iconName = GraphHopperRouteProvider.#ICON_LIST [ instruction.sign + 4 || ZERO ];
						if ( 'kArriveDefault' === previousIconName && 'kContinueStraight' === maneuver.iconName ) {
							maneuver.iconName = 'kDepartDefault';
						}
						previousIconName = maneuver.iconName;
						maneuver.instruction = instruction.text || '';
						maneuver.duration = instruction.time / DISTANCE.metersInKm;
						maneuver.distance = instruction.distance;
						maneuver.itineraryPointObjId = itineraryPoints [ instruction.interval [ ZERO ] ].objId;
						this.#route.itinerary.maneuvers.add ( maneuver );

					}
				);

				const wayPointsIterator = this.#route.wayPoints.iterator;
				path.snapped_waypoints.forEach (
					latLngElev => {
						if ( ! wayPointsIterator.done ) {
							wayPointsIterator.value.lat = latLngElev [ LAT ];
							wayPointsIterator.value.lng = latLngElev [ LNG ];
						}
					}
				);
			}
		);

		onOk ( this.#route );
	}

	/**
	Gives the url to call
	@return {String} a string with the url, wayPoints, transitMode, user language and API key
	*/

	#getUrl ( ) {
		let wayPointsString = null;
		this.#route.wayPoints.forEach (
			wayPoint => {
				wayPointsString = wayPointsString ? wayPointsString + '&' : '';
				wayPointsString +=
					'point=' +
					wayPoint.lat.toFixed ( LAT_LNG.fixed ) + ',' +
					wayPoint.lng.toFixed ( LAT_LNG.fixed );
			}
		);

		let vehicle = '';
		switch ( this.#route.itinerary.transitMode ) {
		case 'bike' :
			vehicle = 'bike';
			break;
		case 'pedestrian' :
			vehicle = 'foot';
			break;
		case 'car' :
			vehicle = 'car';
			break;
		default :
			break;
		}

		return 'https://graphhopper.com/api/1/route?' + wayPointsString +
			'&instructions=true&elevation=true&type=json&key=' + this.#providerKey + '&locale=' + this.userLanguage +
			'&vehicle=' + vehicle;
	}

	/**
	Overload of the base class #getRoute ( ) method
	@param {function} onOk the Promise Success handler
	@param {function} onError the Promise Error handler
	*/

	#getRoute ( onOk, onError ) {
		fetch ( this.#getUrl ( ) )
			.then (
				response => {
					if ( HTTP_STATUS_OK === response.status && response.ok ) {
						response.json ( )
							.then ( result => this.#parseResponse ( result, onOk, onError ) );
					}
					else {
						onError ( new Error ( 'Invalid status ' + response.status ) );
					}
				}
			)
			.catch (

				// calling onError without parameters because fetch don't accecpt to add something as parameter :-(...
				( ) => { onError ( ); }
			);
	}

	/**
	The constructor
	*/

	constructor ( ) {
		super ( );
		this.#providerKey = '';
	}

	/**
	Call the provider, using the waypoints defined in the route and, on success,
	complete the route with the data from the provider
	@param {Route} route The route to witch the data will be added
	@return {Promise} A Promise. On success, the Route is completed with the data given by the provider.
	*/

	getPromiseRoute ( route ) {
		this.#route = route;
		return new Promise ( ( onOk, onError ) => this.#getRoute ( onOk, onError ) );
	}

	/**
	The icon used in the ProviderToolbarUI.
	Overload of the base class icon property
	@type {String}
	*/

	get icon ( ) {
		return '' +
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAIAAAC0Ujn1AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3' +
			'RJTUUH4AocDyYTxtPEYwAABGtJREFUSMedVU1MXFUUPue+9+bNAMMUZrCFVAsiDEGpJlpdtCY0sTU1xIA1QNSNIcYGuyAuxBp1oU' +
			'1DYu2iNlKsJopVYy2lkpiyoCCptLWF1DKFkpb/YShvmBmYX97/dUECw5sBpj2r97577pdzv3vud/BLzw8XF3s5ZGG9QAQA0CggAE' +
			'GgFDYLRVffsu/HUlcNAyQ5J0NApzGXXxwLKvNLhCNcbrqlNJvfYaWavjE7hyzLIUuTFYIskd2RByduRfu9im9pBed3ZG79oCzr9Q' +
			'KqrMtOgXLIrquDOBqcONQjeyIGXJoKTX/URyUtu6aIStoGhZOk4mpBeeL97kTelXB/dj3QPoYseThq5HD6yFV5Npq4xMadcvZof8' +
			'zlRwZTpUYTE7w0Fb4ya8CLi4vb2toGBgZ6enpqa2sBQAvLvtYRLaauR52gNaW+s/cMWGFhYUdHh9PpXP4tLy/Pz89vamqSugXze7' +
			'r8JJMCNcGl4YDkDq/BCGloaHA6nVPy3GnvhZvRYQdrq/n0QFrzqVgw8sQV03gh6lTfRBBEEO8F1YAYD9rt9sP1hyflB4cmm9oDPY' +
			'Lsd8XGjkyfsrxgB4DB367tztipUHUTaqqDNBMxNGxlZSUQOOO96JG9PDERJCwyZjSpqAPAqGd898xTKtE2o1Z1bUE0ZFRUVLiptz' +
			'96FyC+GVAcCy5/3fnr5nO2Ei1BE2K4w8Q3VlJSMhpzT8tzGHclakCUJkLLf5c6O19z7EnUhBhMg8ngDBnhaOSuOBlvBsTC+n9d7a' +
			'KhoaFnYAcibkjNoml7BqzNOd92PsyKqzsJKt6Y7+eRlQRZlsNTC9t4OwW6vtYULE9ncw5LPPj18eOuvluEEkAABH1Jnfn8XzUsx+' +
			'f4Zrx55hy6UV/rNG2nw7onN9A+vmq+kvLLmydyDjotpVm6rC92TkWuzxnOHvWHHivNAqDxV218jVSneY3PZ4+yo664N7lE58+ObO' +
			'T9MdnGWuka5kR70qmeTvb9/u6B8lch5WCBSSPmzTwEgAWmV/3vWPsnb5w72NxyWhAERVEopQzD8DwviqIgCIYtNmtmAOQU/BqARe' +
			'bY7I+Z7xQODAy4+m/3Xv67u6v7Wt9V1+3B6urqxPxtubmJNoLP3nk76QBbHkIFfN5e264XM0rzTA4GiFvwvOJ8ORQJGZIDiwsnY2' +
			'1/+LoYJMt704h53QGGgCrV7ovu+6L7O+HC8rQUml2JvEVFRVm2LYvBEKYiSLKZgap/Sfh2MHGlvr4+CpJXCcDaB5kqNTEznqP9VD' +
			'VKl5OTU1dXJ8i+McnziFVTSdtaXwZ5vAFvaWmxWq03wsMLagjhkaqmGiX56Sdv/PTxh422TBvP8w6Ho7W1taqqSqHKGV+7CblUOy' +
			'RpZLOZXxU3lGkF8x5he/7jAKBQ9YvZ78/5u8yEj++uNGLGUlcNC0yK1DpQC5r2btm13/ZSHueYleb/XOi9HOpnkVnbuGBCBhvd33' +
			'Qs/MMhAw8TPHIssirVJConsRSq1tr3/Q+O4QqEHeMWIQAAAABJRU5ErkJggg==';
	}

	/**
	The provider name.
	Overload of the base class name property
	@type {String}
	*/

	get name ( ) { return 'GraphHopper'; }

	/**
	The title to display in the ProviderToolbarUI button.
	Overload of the base class title property
	@type {String}
	*/

	get title ( ) { return 'GraphHopper'; }

	/**
	The possible transit modes for the provider.
	Overload of the base class transitModes property
	Must be a subarray of [ 'bike', 'pedestrian', 'car', 'train', 'line', 'circle' ]
	@type {Array.<String>}
	*/

	get transitModes ( ) { return [ 'bike', 'pedestrian', 'car' ]; }

	/**
	A boolean indicating when a provider key is needed for the provider.
	Overload of the base class providerKeyNeeded property
	@type {Boolean}
	*/

	get providerKeyNeeded ( ) { return true; }

	/**
	The provider key.
	Overload of the base class providerKey property
	*/

	set providerKey ( providerKey ) { this.#providerKey = providerKey; }
}

window.TaN.addProvider ( GraphHopperRouteProvider );

/* --- End of file --------------------------------------------------------------------------------------------------------- */