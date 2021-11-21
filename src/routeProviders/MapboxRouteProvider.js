/*
Copyright - 2017 - wwwouaiebe - Contact: http//www.ouaie.be/

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

-----------------------------------------------------------------------------------------------------------------------
*/

import PolylineEncoder from '../coreLib/PolylineEncoder.js';
import ItineraryPoint from '../data/ItineraryPoint.js';
import Maneuver from '../data/Maneuver.js';
import BaseRouteProvider from '../routeProviders/BaseRouteProvider.js';
import theOsrmTextInstructions from '../routeProviders/OsrmTextInstructions.js';
import { ICON_LIST } from '../routeProviders/IconList.js';
import { ZERO, ONE, TWO, LAT_LNG, HTTP_STATUS_OK } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class implements the BaseRouteProvider for Mapbox. It's not possible to instanciate
this class because the class is not exported from the module. Only one instance is created and added to the list
of Providers of TravelNotes
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class MapboxRouteProvider extends BaseRouteProvider {

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
	static get #ROUND_VALUE ( ) { return 6; }

	/**
	Parse the response from the provider and add the received itinerary to the route itinerary
	@param {JsonObject} response the itinerary received from the provider
	@param {function} onOk a function to call when the response is parsed correctly
	@param {function} onError a function to call when an error occurs
	*/

	#parseResponse ( response, onOk, onError ) {

		if ( 'Ok' !== response.code ) {
			onError ( new Error ( 'Response code not ok' ) );
			return;
		}

		if ( ZERO === response.routes.length ) {
			onError ( new Error ( 'Route not found' ) );
			return;
		}

		const polylineEncoder = new PolylineEncoder ( );
		this.#route.itinerary.itineraryPoints.removeAll ( );
		this.#route.itinerary.maneuvers.removeAll ( );
		this.#route.itinerary.hasProfile = false;
		this.#route.itinerary.ascent = ZERO;
		this.#route.itinerary.descent = ZERO;
		response.routes [ ZERO ].geometry = polylineEncoder.decode (
			response.routes [ ZERO ].geometry, [ MapboxRouteProvider.#ROUND_VALUE, MapboxRouteProvider.#ROUND_VALUE ]
		);
		response.routes [ ZERO ].legs.forEach (
			leg => {
				let lastPointWithDistance = ZERO;
				leg.steps.forEach (
					step => {
						step.geometry = polylineEncoder.decode (
							step.geometry,
							[ MapboxRouteProvider.#ROUND_VALUE, MapboxRouteProvider.#ROUND_VALUE ]
						);
						if (
							'arrive' === step.maneuver.type
							&&
							TWO === step.geometry.length
							&&
							step.geometry [ ZERO ] [ ZERO ] === step.geometry [ ONE ] [ ZERO ]
							&&
							step.geometry [ ZERO ] [ ONE ] === step.geometry [ ONE ] [ ONE ]
						) {
							step.geometry.pop ( );
						}

						const maneuver = new Maneuver ( );
						maneuver.iconName =
							ICON_LIST [ step.maneuver.type ]
								?
								ICON_LIST [ step.maneuver.type ] [ step.maneuver.modifier ]
								||
								ICON_LIST [ step.maneuver.type ] [ 'default' ]
								:
								ICON_LIST [ 'default' ] [ 'default' ];
						maneuver.instruction = theOsrmTextInstructions.compile ( this.userLanguage, step );
						maneuver.duration = step.duration;
						let distance = ZERO;
						for (
							let geometryCounter = ZERO;
							( ONE === step.geometry.length )
								?
								( ONE > geometryCounter )
								:
								( geometryCounter < step.geometry.length );
							geometryCounter ++ ) {
							const itineraryPoint = new ItineraryPoint ( );
							itineraryPoint.latLng = [
								step.geometry [ geometryCounter ] [ ZERO ],
								step.geometry [ geometryCounter ] [ ONE ]
							];

							itineraryPoint.distance =
								leg.annotation.distance [ lastPointWithDistance ]
									?
									leg.annotation.distance [ lastPointWithDistance ]
									:
									ZERO;
							this.#route.itinerary.itineraryPoints.add ( itineraryPoint );
							if ( geometryCounter !== step.geometry.length - ONE ) {
								distance += itineraryPoint.distance;
								lastPointWithDistance ++;
							}
							if ( ZERO === geometryCounter ) {
								maneuver.itineraryPointObjId = itineraryPoint.objId;
							}
						}
						maneuver.distance = distance;
						this.#route.itinerary.maneuvers.add ( maneuver );
					}
				);
			}
		);

		const wayPointsIterator = this.#route.wayPoints.iterator;
		response.waypoints.forEach (
			wayPoint => {
				if ( ! wayPointsIterator.done ) {
					wayPointsIterator.value.latLng = [ wayPoint.location [ ONE ], wayPoint.location [ ZERO ] ];
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
		let wayPointsString = null;
		this.#route.wayPoints.forEach (
			wayPoint => {
				wayPointsString = wayPointsString ? wayPointsString + ';' : '';
				wayPointsString +=
					wayPoint.lng.toFixed ( LAT_LNG.fixed ) + ',' +
					wayPoint.lat.toFixed ( LAT_LNG.fixed );
			}
		);

		let profile = '';
		switch ( this.#route.itinerary.transitMode ) {
		case 'car' :
			profile = 'mapbox/driving/';
			break;
		case 'bike' :
			profile = 'mapbox/cycling/';
			break;
		case 'pedestrian' :
			profile = 'mapbox/walking/';
			break;
		default :
			return;
		}
		return 'https://api.mapbox.com/directions/v5/' +
			profile +
			wayPointsString +
			'?geometries=polyline6&overview=full&steps=true&annotations=distance&access_token=' +
			this.#providerKey;
	}

	/**
	Implementation of the base class #getRoute ( )
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
	constructor
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
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWX' +
			'MAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AocEwcBrMn63AAAAk1JREFUSMftlj9oU1EUxn8neQ0thE6lgpO1TiptHhShJiIu2qHJA6' +
			'FudtBRUBcpouJUnRyqgpODVcG62LROHfzHexGiJWkEQbCr0IqVYKPStDkOpuYRfW1eTNCh33Tvufec717udz8ObOFfITqV3XA9Nj' +
			'n3W+xAMuO7pnhs7AQiwCqwpvBNVN47Vu8SQDSZwbFMqsexyUyHinQjtAEBwACyTiKyWM1heBzyMHDXdbplRCeiyexVCei8HTfpf5' +
			'gCwLFM9k/lEF3bpSIXgWNAm6vWceBercQrVfMwcBKhvVRcOwEst2zbXlldXQljGFeAoRpqbUjshSExgo9iM6kHLw7uUIDYTEr0ez' +
			'DuQeoJw7/8ZLRUCD/ZNz6/AFAqFDolWBr1WyVQh/C7JKgj6eFu0sPdSFBHgC6/RWq7sbCI0g60/gzoqWhy7v762LXzC/AR2NmQG6' +
			'tyE3jnCoUQHUN0DAi54m+BGw27sUAGyAOjZYUD9Fdty4vqLRX51Mg3bnUSkevAm6rc9XwFXtuWeafyHI0hDgCI6AXg8x/WlwTO+6' +
			'npS9V23HwKJMtW+ss+FCbsRORVU79TMdByFlhwhT60hELnmvqP+6dzpAf35BG9DBSBoqheej6w+2vsca55xC/jPei04sTN20AKsG' +
			'3LHN87cg17sKe5ztXHbFnHclrgDEDHwFGa41wuzMb7iCbncKzeHEBsKsuzQ74dsy6vxrF6K0pPROrqdOoibgT+O+LQJvONUFOul7' +
			'hmgCNlhzKArA/i+nK92tvN2t6/zd1C0/ADiOy3l0UZHxAAAAAASUVORK5CYII=';
	}

	/**
	The provider name.
	Overload of the base class name property
	@type {String}
	*/

	get name ( ) { return 'Mapbox'; }

	/**
	The title to display in the ProviderToolbarUI button.
	Overload of the base class title property
	@type {String}
	*/

	get title ( ) { return 'Mapbox'; }

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

	/**
	The user language. Overload of the base class userLanguage property.
	It's needed to overload the setter AND the getter otherwise the getter returns undefined
	@type {String}
	*/

	get userLanguage ( ) { return super.userLanguage; }
	set userLanguage ( userLanguage ) {
		super.userLanguage = theOsrmTextInstructions.loadLanguage ( userLanguage );
	}
}

window.TaN.addProvider ( MapboxRouteProvider );

/* --- End of file --------------------------------------------------------------------------------------------------------- */