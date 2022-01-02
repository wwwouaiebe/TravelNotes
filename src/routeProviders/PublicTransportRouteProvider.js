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

import { ZERO, LAT_LNG, HTTP_STATUS_OK } from '../main/Constants.js';
import { SelectOptionData, SelectDialog } from '../dialogs/SelectDialog.js';
import PublicTransportRouteBuilder from '../routeProviders/PublicTransportRouteBuilder.js';
import BaseRouteProvider from '../routeProviders/BaseRouteProvider.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class implements the BaseRouteProvider for PublicTransport. It's not possible to instanciate
this class because the class is not exported from the module. Only one instance is created and added to the list
of Providers of TravelNotes
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class PublicTransportRouteProvider extends BaseRouteProvider {

	/**
	A reference to the edited route
	@type {Route}
	*/

	#route;

	/**
	Parse the response from the provider and add the received itinerary to the route itinerary
	@param {Object} waysNodes The ways and nodes received from OSM
	@param {function} onOk a function to call when the response is parsed correctly
	@param {function} onError a function to call when an error occurs
	*/

	#parseResponse ( waysNodes, onOk, onError ) {
		new PublicTransportRouteBuilder ( this.#route ).buildRoute ( waysNodes, onOk, onError );
	}

	/**
	Get the url to obtains the ways and node Osm elements for the relation
	@param {Number} relationId The osm relation id
	@return {String} The complete url
	*/

	#getWaysNodesUrl ( relationId ) {
		return window.TaN.overpassApiUrl + '?data=[out:json];rel(' +
			relationId.toFixed ( ZERO ) +
			');way(r)->.e;way.e["railway"="rail"];(._;>;rel(' +
			relationId.toFixed ( ZERO ) +
			'););out;';
	}

	/**
	Show a SelectDialog with all the train relations between the start point and end point
	@param {Array.<Object>} relations The relations received from OSM
	@return {Promise} The Promise created by the selectDialog.show ( )
	*/

	#getDialogPromise ( relations ) {

		if ( ZERO === relations.elements.length ) {
			return Promise.reject ( new Error ( 'No relations found' ) );
		}

		const selectOptionsData = [];
		relations.elements.forEach (
			relationElement => {
				selectOptionsData.push ( new SelectOptionData ( relationElement.tags.name, relationElement.id ) );
			}
		);

		const selectDialog = new SelectDialog (
			{
				title : 'Relations',
				text : 'select a relation : ',
				selectOptionsData : selectOptionsData
			}
		);

		// baseDialog.show ( ) return a Promise...
		return selectDialog.show ( );

	}

	/**
	The url to use to have the relations between the start point and end point
	@type {String}
	*/

	get #relationsUrl ( ) {
		return window.TaN.overpassApiUrl +
			'?data=[out:json];node["public_transport"="stop_position"]["train"="yes"](around:400.0,' +
			this.#route.wayPoints.first.lat.toFixed ( LAT_LNG.fixed ) +
			',' +
			this.#route.wayPoints.first.lng.toFixed ( LAT_LNG.fixed ) +
			')->.s;rel(bn.s)->.s;node["public_transport"="stop_position"]["train"="yes"](around:400.0,' +
			this.#route.wayPoints.last.lat.toFixed ( LAT_LNG.fixed ) +
			',' +
			this.#route.wayPoints.last.lng.toFixed ( LAT_LNG.fixed ) +
			')->.e;rel(bn.e)->.e;rel.e.s;out tags;';
	}

	/**
	call the provider, wait for the response and then parse the provider response. Notice that we have two calls to the
	Provider: one for the relation list and one for the ways and nodes. Notice also the dialog box between the 2 calls.
	@param {function} onOk a function to pass to the ourParseResponse
	@param {function} onError a function to pass to ourParseResponse or to call when an error occurs
	*/

	#getRoute ( onOk, onError ) {
		fetch ( this.#relationsUrl )
			.then (
				responseRelations => {
					if ( HTTP_STATUS_OK === responseRelations.status && responseRelations.ok ) {
						responseRelations.json ( )
							.then ( relations => this.#getDialogPromise ( relations ) )
							.then ( relationId => fetch ( this.#getWaysNodesUrl ( relationId ) ) )
							.then (
								responseWaysNodes => {
									if ( HTTP_STATUS_OK === responseWaysNodes.status && responseWaysNodes.ok ) {
										responseWaysNodes.json ( )
											.then ( waysNodes => this.#parseResponse ( waysNodes, onOk, onError ) );
									}
									else {
										onError ( new Error ( 'An error occurs...' ) );
									}
								}
							)
							.catch ( ( ) => onError ( new Error ( 'An error occurs...' ) ) );
					}
					else {
						onError ( new Error ( 'An error occurs...' ) );
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
		return 'data:image/svg+xml;utf8,' +
			'<svg viewBox="-3 -3 20 20" xmlns="http://www.w3.org/2000/svg"> <g fill="rgb(128,0,0)">' +
			'<path d="M 5,0 C 3.025911,-0.0084 1,3 1,7 l 0,2 c 0,1 1,2 2,2 l 8,0 c 1,0 2,-1 2,-2 L 13,7 C 13,3 11,0 9,0 z m ' +
			'-1,3 6,0 c 0,0 1,1 1,3 L 3.03125,6 C 2.994661,3.9916 4,3 4,3 z M 3,8 6,8 6,9 3,9 z m 5,0 3,0 0,1 -3,0 z m -6,4 ' +
			'-1,2 3,0 1,-2 z m 7,0 1,2 3,0 -1,-2 z"/></g></svg>';
	}

	/**
	The provider name.
	Overload of the base class name property
	@type {String}
	*/

	get name ( ) { return 'PublicTransport'; }

	/**
	The title to display in the ProviderToolbarUI button.
	Overload of the base class title property
	@type {String}
	*/

	get title ( ) { return 'Public Transport on OpenStreetMap'; }

	/**
	The possible transit modes for the provider.
	Overload of the base class transitModes property
	Must be a subarray of [ 'bike', 'pedestrian', 'car', 'train', 'line', 'circle' ]
	@type {Array.<String>}
	*/

	get transitModes ( ) { return [ 'train' ]; }

	/**
	A boolean indicating when a provider key is needed for the provider.
	Overload of the base class providerKeyNeeded property
	@type {Boolean}
	*/

	get providerKeyNeeded ( ) { return false; }
}

window.TaN.addProvider ( PublicTransportRouteProvider );

/* --- End of file --------------------------------------------------------------------------------------------------------- */