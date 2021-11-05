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
import theOsrmTextInstructions from '../routeProviders/OsrmTextInstructions.js';
import { ICON_LIST } from '../routeProviders/IconList.js';
import { ZERO, ONE, LAT_LNG, HTTP_STATUS_OK } from '../main/Constants.js';

/* ---------------------------------------------------------------------------------------------------------------------------*/
/**
This class implements the BaseRouteProvider for Osrm. It's not possible to instanciate
this class because the class is not exported from the module. Only one instance is created and added to the list
of Providers of TravelNotes
*/
/* ---------------------------------------------------------------------------------------------------------------------------*/

class OsrmRouteProvider extends BaseRouteProvider {

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
	static get#ROUND_VALUE ( ) { return 6; }

	/**
	Parse the response from the provider and add the received itinerary to the route itinerary
	@param {Object} response the itinerary received from the provider
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

		this.#route.itinerary.itineraryPoints.removeAll ( );
		this.#route.itinerary.maneuvers.removeAll ( );
		this.#route.itinerary.hasProfile = false;
		this.#route.itinerary.ascent = ZERO;
		this.#route.itinerary.descent = ZERO;

		const polylineEncoder = new PolylineEncoder ( );
		response.routes [ ZERO ].geometry = polylineEncoder.decode (
			response.routes [ ZERO ].geometry,
			[ OsrmRouteProvider.#ROUND_VALUE, OsrmRouteProvider.#ROUND_VALUE ]
		);

		response.routes [ ZERO ].legs.forEach (
			leg => {
				let lastPointWithDistance = ZERO;
				leg.steps.forEach (
					step => {
						step.geometry = polylineEncoder.decode (
							step.geometry,
							[ OsrmRouteProvider.#ROUND_VALUE, OsrmRouteProvider.#ROUND_VALUE ]
						);
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

		// openstreetmap.de server
		let transitModeString = '';
		switch ( this.#route.itinerary.transitMode ) {
		case 'car' :
			transitModeString = 'routed-car';
			break;
		case 'bike' :
			transitModeString = 'routed-bike';
			break;
		case 'pedestrian' :
			transitModeString = 'routed-foot';
			break;
		default :
			return;
		}
		return 'https://routing.openstreetmap.de/' +
			transitModeString +
			'/route/v1/driving/' +
			wayPointsString +
			'?geometries=polyline6&overview=full&steps=true&annotations=distance';
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
			);
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
			'MAAA7DAAAOwwHHb6hkAAAAB3RJTUUH4QkaDwEMOImNWgAABTZJREFUSMftl21sFEUYx3+zu3ft9a7Q0tIXoKUCIkIVeYsECmgbBK' +
			'IIEVC0QEs0UIEghA+CEkkIaCyJBhFBBC00qHxoQClvhgLyEonyckhbFKS90iK0FAqFHr273R0/XNlCymEREr44X3by7DPzm5n9z8' +
			'x/hZRS8giKwiMqjwys3U/y/pIqdh0tp8RTS229F0yIaxtBz+R2jOjfhSFPJbW6L9Gab/zFdjfv5x/k2g0f4TYVISUCEJKmp8QfMG' +
			'jjsLNoShozxvR7MHD1VS+D53+Pp/oqmqJYoEBAxzQlQoKmCMJUJTgAwDQkye0j2f1JJvHRzvsH/3m+jqfn5IOUICWGYZIY5WTScz' +
			'1J751EYjsXArh45QZ73BV8W1RC7VUvNkVBEBzUoZXZPJEc03rwhboGkqettWYopeSb2SPIHPbkPZfvu6JSZizfidIExpQU5+eQ0M' +
			'7VOnDS9LVcvNKAkBDtDOf35ZOIj3K2SjSXrnoZNDOPuvqbCCA+yklxfs6/g3O3HOXd/ANoikCakvPrphEfFWG9P1R6ni+3n6Ck4h' +
			'JI6JUcS/YLqaQ/09nKuVx/kx6TVoGUmIZkYVYac18beG+wfeLnGIaBqZtseGckk59rXt7xH/5IwaHTRNjVO1Tt8wcY1b8rWxaPs3' +
			'J/OHiarKVbsKkqqoCLW+eFPkB2uD0EfAEAOsa67oC+tHgzW387iyNMQ0qJ1xfA6wsgpSTcprHX7eHFBZus/DFp3XksMRoAX0Bn16' +
			'9nQ4N3HT+H0FQApqb3suLbj5Sx7UgZihA0Bgxmje5HeV4Ong05zB7bn8aAjhCCfSfOUfjLGatd5vBUkGDXVPYeKQ8NdldcCu7FgM' +
			'HIPilWfMU2N2E2FVNK3pvwLLlvDqNzXBuS2rdh6dShfJCZhikldpvKmkK31e75vin4AjoAxWU1ocHV17zBimnS4bYtcKysGgC/T2' +
			'feK/1bKHTu+AF4G4OfyH2m2oonxrgwTGmpPSRYms11VRFWPaA3vZCSMFvL4z3MpnFLorrZ3IkixG19y9DgmMjwWy34+0qDFe/RqR' +
			'0AtjAbeUXFLcAbfjpJRHhwQI835QJU1zVYE4hqEx4anJocAwKEprK3uNKKZ6X3wjAlqiKYvXoP63c3wzfuKWHGil2oioJhSt7IaB' +
			'bl/hPnsNuCYu2ZEhd6Hxcc/ovxuYUoqqB7QhSnVmRZid1z1lFZcx0BGLqB36+DBIddw6YKhITEaCen8qZbbQbmfE1ZVR2GYbBuwc' +
			'uMHdrj7jMeN7CbVf+j8jI7jnmaBfbpZDrEuDClRFMVnA47LocdTVUwTUlctJPDK7Ot/KKj5ZSW1yIBw5R3QO/qQOaN7QcSNJvKq8' +
			'sKaWhSq8th5+xXb7F40mA6xUbScNPPDa+fjjGRLMwczOm86bR1hgFw06eT/dFWwuzBZZ45bkDrLglX5kp8fh0hITk2kpOfTcFhb5' +
			'1ZafTrDJqZx7mL1xAED4+qzXMQrfFcB5ZMQPcbAFTWXichazU/3ya2UOVQcRXdMldRUX0teFT6DQo/ntgCek8jsPO4h1GLCrDbNZ' +
			'ASv1+nX9d4sjJSyeidREJ00AhcqGtgn7uCjUUlHDt9AYdNQyDx+XQKlkxgxIAu9299jpbVMGT+JgzDsG4j2TQIacqgFhRBuKagCm' +
			'HlaIpgZ+7r9O2e8N/NXsAwmbVmD2u2ubFpKpoiWpo9JNIIGr63R/dhWU4Gmqo8uMsE8OsG64tK2X3cQ7Gnhsv1jShS0L5tOL2SY8' +
			'jok8Lk4anYm263h2Jv//+FeRjlHxKxS4in4X1YAAAAAElFTkSuQmCC';
	}

	/**
	The provider name.
	Overload of the base class name property
	@type {String}
	*/

	get name ( ) { return 'OSRM'; }

	/**
	The title to display in the ProviderToolbarUI button.
	Overload of the base class title property
	@type {String}
	*/

	get title ( ) { return 'OSRM'; }

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

	get providerKeyNeeded ( ) { return false; }

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

window.TaN.addProvider ( OsrmRouteProvider );

/* --- End of file -----------------------------------------------------------------------------------------------------------*/