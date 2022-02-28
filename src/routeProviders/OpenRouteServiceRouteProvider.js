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

import polylineEncoder from '../coreLib/PolylineEncoder.js';
import ItineraryPoint from '../data/ItineraryPoint.js';
import Maneuver from '../data/Maneuver.js';
import BaseRouteProvider from '../routeProviders/BaseRouteProvider.js';

import { ZERO, ONE, TWO, LAT, LNG, ELEVATION, LAT_LNG, HTTP_STATUS_OK } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class implements the BaseRouteProvider for OpenRouteService. It's not possible to instanciate
this class because the class is not exported from the module. Only one instance is created and added to the list
of Providers of TravelNotes
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class OpenRouteServiceRouteProvider extends BaseRouteProvider {

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
			'kTurnLeft',
			'kTurnRight',
			'kTurnSharpLeft',
			'kTurnSharpRight',
			'kTurnSlightLeft',
			'kTurnSlightRight',
			'kContinueStraight',
			'kRoundaboutRight',
			'kRoundaboutExit',
			'kUturnLeft',
			'kArriveDefault',
			'kDepartDefault',
			'kStayLeft',
			'kStayRight'
		];
	}

	/**
	Parse the response from the provider and add the received itinerary to the route itinerary
	@param {JsonObject} response the itinerary received from the provider
	@param {function} onOk a function to call when the response is parsed correctly
	@param {function} onError a function to call when an error occurs
	*/

	#parseResponse ( response, onOk, onError ) {

		if ( ! response.routes || ZERO === response.routes.length ) {
			onError ( new Error ( 'Route not found' ) );
			return;
		}
		response.routes [ ZERO ].geometry = new polylineEncoder ( ).decode (
			response.routes [ ZERO ].geometry,
			[ OpenRouteServiceRouteProvider.#ROUND_VALUE, OpenRouteServiceRouteProvider.#ROUND_VALUE, TWO ]
		);
		this.#route.itinerary.itineraryPoints.removeAll ( );
		this.#route.itinerary.maneuvers.removeAll ( );
		this.#route.itinerary.hasProfile = true;
		this.#route.itinerary.ascent = ZERO;
		this.#route.itinerary.descent = ZERO;

		let wayPointIndex = ZERO;
		let itineraryPoint = new ItineraryPoint ( );
		itineraryPoint.lat = response.routes [ ZERO ].geometry [ wayPointIndex ] [ LAT ];
		itineraryPoint.lng = response.routes [ ZERO ].geometry [ wayPointIndex ] [ LNG ];
		itineraryPoint.elev = response.routes [ ZERO ].geometry [ wayPointIndex ] [ ELEVATION ];
		this.#route.itinerary.itineraryPoints.add ( itineraryPoint );
		wayPointIndex ++;

		response.routes [ ZERO ].segments.forEach (
			segment => {
				segment.steps.forEach (
					step => {
						let maneuver = new Maneuver ( );
						maneuver.iconName = OpenRouteServiceRouteProvider.#ICON_LIST [ step.type ] || 'kUndefined';
						maneuver.instruction = step.instruction;
						maneuver.duration = step.duration;
						maneuver.distance = step.distance;
						maneuver.itineraryPointObjId = this.#route.itinerary.itineraryPoints.last.objId;
						this.#route.itinerary.maneuvers.add ( maneuver );
						while ( wayPointIndex <= step.way_points [ ONE ] ) {
							if (
								itineraryPoint.lat !== response.routes [ ZERO ].geometry [ wayPointIndex ] [ LAT ]
								||
								itineraryPoint.lng !== response.routes [ ZERO ].geometry [ wayPointIndex ] [ LNG ]
							) {
								itineraryPoint = new ItineraryPoint ( );
								itineraryPoint.lat = response.routes [ ZERO ].geometry [ wayPointIndex ] [ LAT ];
								itineraryPoint.lng = response.routes [ ZERO ].geometry [ wayPointIndex ] [ LNG ];
								itineraryPoint.elev = response.routes [ ZERO ].geometry [ wayPointIndex ] [ ELEVATION ];
								this.#route.itinerary.itineraryPoints.add ( itineraryPoint );
							}
							wayPointIndex ++;
						}
					}
				);
			}
		);
		const wayPointsIterator = this.#route.wayPoints.iterator;
		response.routes [ ZERO ].way_points.forEach (
			wayPoint => {
				if ( ! wayPointsIterator.done ) {
					wayPointsIterator.value.latLng = response.routes [ ZERO ].geometry [ wayPoint ];
				}
			}
		);

		onOk ( this.#route );
	}

	/**
	Gives the url to call
	@return {String} a string with the url, wayPoints, transitMode, user language and API key
	*/

	#getUrl ( ) {
		let requestString = 'https://api.openrouteservice.org/v2/directions/';
		switch ( this.#route.itinerary.transitMode ) {
		case 'car' :
			requestString += 'driving-car';
			break;
		case 'bike' :
			requestString += 'cycling-regular';
			break;
		case 'pedestrian' :
			requestString += 'foot-walking';
			break;
		default :
			return;
		}
		return requestString;
	}

	/**
	Gives the request headers
	@return {Array.<Object>} an array with the needed request headers
	*/

	#getRequestHeaders ( ) {

		const orsHeaders = new Headers ( );
		orsHeaders.append ( 'Accept', 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8' );
		orsHeaders.append ( 'Content-Type', 'application/json' );
		orsHeaders.append ( 'Authorization', this.#providerKey );

		return orsHeaders;
	}

	/**
	Gives the options and wayPoints for the request body
	@return {String} a string with the wayPoint coordinates, elevation param and language in JSON format
	*/

	#getBody ( ) {
		let wayPointsString = null;
		this.#route.wayPoints.forEach (
			wayPoint => {
				wayPointsString = wayPointsString ? wayPointsString + ',' : '{"coordinates":[';
				wayPointsString +=
					'[' + wayPoint.lng.toFixed ( LAT_LNG.fixed ) +
					',' + wayPoint.lat.toFixed ( LAT_LNG.fixed ) + ']';
			}
		);
		wayPointsString += '],"elevation":"true","language":"' + this.userLanguage + '"}';

		return wayPointsString;

	}

	/**
	Overload of the base class #getRoute ( ) method
	@param {function} onOk the Promise Success handler
	@param {function} onError the Promise Error handler
	*/

	#getRoute ( onOk, onError ) {
		fetch ( this.#getUrl ( ), { method : 'POST', headers : this.#getRequestHeaders ( ), body : this.#getBody ( ) } )
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
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QAzwBfAF8OMuGdAAAACXBIWX' +
			'MAAA7DAAAOwwHHb6hkAAAAB3RJTUUH4QoBEgIhgj0YgQAAAmdJREFUSMftlk9LYlEYxn+WinqdaWga0owaa9RWFS2iTZt27YJu5K' +
			'4bFNSqFkFEcaHvUNAmUjdCGdQHqE8QGVGRY1BpOZEFGepo+WcW43WySWYZAz6rc5/3HH7nfR84XJV/ZCTPO6iKd1IFXAFXwP8/WP' +
			'3a0FutmEURQ2sr5PMkgkEi6+ukr64A6HS5SvZnUilSoRBht5v09TVVgoDF6eRDeztqg4FMPE48EODH5ibP0ejbHWvq6vg2O4umpo' +
			'bvskxAltHW1mKbn0drMpUADyQJvyRxubKC0W6naWwMgObxcT739nK5vMzhxARXHg+1PT20TE2VH7VZFKnW6Yj4fDzd3vIcjRLx+V' +
			'Dr9ZgGBv4alwqIn5wAoLNYADC2tQEg2O3kczke/X4OJInAwkJ5sHIoeXZW9JS1UnupvErFx44OAH5eXPzef34OQIMo4lhcRHA4/p' +
			'2x2mgEIJtMFj1lrdQUvcz68fiYcOE7tLpKy/Q0+sZGDE1N2ObmeNjfJ+x2k43F3u5YgVQLQtGrLgAziUQJ2D86yvnSErlMhiqNhs' +
			'zDAwDPd3cEZJmwx8NTwfvU1cXXycnyo44HAsV8FAk2GwCJ09PSfPN5Ynt7XHu9GO12zENDf4q5HPe7u5zMzBDx+QAwWK3lwTdbW2' +
			'TTacyiiNZkQltfj3lwkEwqxc329ptZ3e/skAyHqevrQ2syYZNlOl0uarq7IZcrZq40Vbz46z8QXXMzDaKIodBpMhgksrFBKhQqyf' +
			'ZAkopnvvT3YxkeJnZ4SHhtDYvTieBwoBYEsskkj0dHRLxesvF4eXDlra6AK+AKuAIup1+E4uxBnFG6zQAAAABJRU5ErkJggg==';
	}

	/**
	The provider name.
	Overload of the base class name property
	@type {String}
	*/

	get name ( ) { return 'OpenRouteService'; }

	/**
	The title to display in the ProviderToolbarUI button.
	Overload of the base class title property
	@type {String}
	*/

	get title ( ) { return 'OpenRouteService'; }

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

window.TaN.addProvider ( OpenRouteServiceRouteProvider );

/* --- End of file --------------------------------------------------------------------------------------------------------- */