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
	- v1.0.0:
		- created
	- v1.4.0:
		- Replacing DataManager with TravelNotesData, Config, Version and DataSearchEngine
		- Working with Promise
		- returning the complete Nominatim responce in place of a computed address
	- v1.6.0:
		- Issue ♯65 : Time to go to ES6 modules?
		- Issue ♯68 : Review all existing promises.
	- v1.12.0:
		- Issue ♯120 : Review the UserInterface
	- v2.0.0:
		- Issue ♯138 : Protect the app - control html entries done by user.
		- Issue ♯148 : Nominatim gives bad responses for cities... find a temporary solution.
	- v2.2.0:
		- Issue ♯64 : Improve geocoding
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210914
Tests ...

-----------------------------------------------------------------------------------------------------------------------
*/

/* ---------------------------------------------------------------------------------------------------------------------------*/
/**
@typedef {Object} GeoCoderAddress
An address
@property {String} name The name of the point or an empty string
@property {String} street The house number and the street of the point or an empty string
@property {String} city The city of the point or an empty string
@property {Boolean} statusOk A status indicating that all the requests are executed correctly
*/
/* ---------------------------------------------------------------------------------------------------------------------------*/

import theConfig from '../data/Config.js';
import OverpassAPIDataLoader from '../coreLib/OverpassAPIDataLoader.js';
import NominatimDataLoader from '../coreLib/NominatimDataLoader.js';
import theHTMLSanitizer from '../coreLib/HTMLSanitizer.js';

import { ZERO, ONE } from '../main/Constants.js';

/* ---------------------------------------------------------------------------------------------------------------------------*/
/**
This class call Nominatim and parse the response
*/
/* ---------------------------------------------------------------------------------------------------------------------------*/

class GeoCoder {

	/**
	The distance used in the OverpassAPI query for places
	@type {Number}
	*/

	static get #queryDistance ( ) {
		return Math.max (
			theConfig.geoCoder.distances.hamlet,
			theConfig.geoCoder.distances.village,
			theConfig.geoCoder.distances.city,
			theConfig.geoCoder.distances.town
		);
	}

	/**
	The Lat and Lng for thr geocoding
	@type {Array.<Number>}
	*/

	#latLng;

	/**
	The OverpassAPIDataLoader object
	@type {OverpassAPIDataLoader}
	*/

	#overpassAPIDataLoader;

	/**
	The NominatimDataLoader object
	@type {NominatimDataLoader}
	*/

	#nominatimDataLoader;

	/**
	this method merge the data from Nominatim and theOverpassAPI
	*/

	#mergeData ( ) {
		let city =
			this.#nominatimDataLoader.city
			||
			this.#nominatimDataLoader.country
			||
			'';

		const place = this.#overpassAPIDataLoader.place;
		if ( place && place !== city ) {
			city += ' (' + place + ')';
		}

		let street = ( this.#nominatimDataLoader.street || '' ).replaceAll ( ';', ' ' );

		let nominatimName = this.#nominatimDataLoader.name || '';

		if ( street.includes ( nominatimName ) || city.includes ( nominatimName ) ) {
			nominatimName = '';
		}

		return Object.freeze (
			{
				name : theHTMLSanitizer.sanitizeToJsString ( nominatimName ),
				street : theHTMLSanitizer.sanitizeToJsString ( street ),
				city : theHTMLSanitizer.sanitizeToJsString ( city )
			}
		);
	}

	/**
	This method get the Overpass query
	*/

	#getOverpassQueries ( ) {
		return [

			/* 'is_in(' + this.#latLng [ ZERO ] + ',' + this.#latLng [ ONE ] +
			')->.e;area.e[admin_level][boundary="administrative"];out;' +*/

			'node(around:' + GeoCoder.#queryDistance + ',' + this.#latLng [ ZERO ] + ',' + this.#latLng [ ONE ] +
			')[place];out;'
		];
	}

	/**
	This method search the address
	*/

	async #getAddressAsync ( ) {

		await this.#overpassAPIDataLoader.loadData ( this.#getOverpassQueries ( ), this.#latLng );
		await this.#nominatimDataLoader.loadData ( this.#latLng );
		return this.#mergeData ( );
	}

	/**
	This method is executed by the Promise to search an address. The #getAddressAsync return always a response,
	eventually with empty strings, so the onError function is never called
	@param {function} onOk The ok handler
	@param {function} onError The error handler
	*/

	// eslint-disable-next-line no-unused-vars
	async #getAddressWithPromise ( onOk, onError ) {
		onOk ( await this.#getAddressAsync ( ) );
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#overpassAPIDataLoader = new OverpassAPIDataLoader (
			{ searchWays : false, searchRelations : false, setGeometry : true }
		);
		this.#nominatimDataLoader = new NominatimDataLoader (
			{
				searchPlaces : true,
				searchWays : false,
				searchRelations : false,
				setGeometry : false
			}
		);
	}

	/**
	This async method search an address from a latitude and longitude
	@param {Array.<Number>} latLng the latitude and longitude to be used to search the address
	@return {GeoCoderAddress} the address at the given point. The GeoCoderAddress.statusOk must be verified
	before using the data.
	*/

	async getAddressAsync ( latLng ) {
		this.#latLng = latLng;
		return this.#getAddressAsync ( );
	}

	/**
	This method search an address from a latitude and longitude with a Promise.
	@param {Array.<Number>} latLng the latitude and longitude to be used to search the address
	@return {Promise} A promise that fulfill with the address at the given point.
	*/

	getAddressWithPromise ( latLng ) {
		this.#latLng = latLng;
		return new Promise ( ( onOk, onError ) => this.#getAddressWithPromise ( onOk, onError ) );
	}

}
export default GeoCoder;

/* --- End of file -----------------------------------------------------------------------------------------------------------*/