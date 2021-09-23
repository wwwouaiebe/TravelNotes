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
Doc reviewed ...
Tests ...
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@file NominatimDataLoader.js
@copyright Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/
@license GNU General Public License
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@module coreLib
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

import theConfig from '../data/Config.js';

import { ZERO, ONE, HTTP_STATUS_OK } from '../main/Constants.js';

/**
@------------------------------------------------------------------------------------------------------------------------------

@class NominatimDataLoader
@classdesc This class search an address with Nominatim starting from a lat and lng
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class NominatimDataLoader {

	/** The status of the requests
	@private
	@type {boolean}
	*/

	#nominatimStatusOk = false;

	/**
	The name found by Nominatim
	@private
	@type {string}
	*/

	#name = '';

	/**
	The street found by Nominatim
	@private
	@type {string}
	*/

	#street = '';

	/**
	The city found by Nominatim
	@private
	@type {string}
	*/

	#city = '';

	/**
	The country found by Nominatim
	@private
	@type {string}
	*/

	#country = '';

	/**
	This method parse the data received from Nominatim
	@param {object} nominatimDataZoom10 the data received from Nomination using the zoom factor 10
	@param {object} nominatimDataZoom18 the data received from Nomination using the zoom factor 18
	@private
	*/

	#parseNominatimData ( nominatimDataZoom10, nominatimDataZoom18 ) {
		if ( nominatimDataZoom10.error || nominatimDataZoom18.error ) {
			this.#nominatimStatusOk = false;
		}
		else {
			this.#name = nominatimDataZoom18.namedetails.name;
			if ( nominatimDataZoom18.address.house_number ) {
				this.#street = nominatimDataZoom18.address.house_number + ' ';
			}
			if ( nominatimDataZoom18.address.road ) {
				this.#street += nominatimDataZoom18.address.road + ' ';
			}
			else if ( nominatimDataZoom18.address.pedestrian ) {
				this.#street += nominatimDataZoom18.address.pedestrian + ' ';
			}
			this.#city =
				nominatimDataZoom10.address.city
				||
				nominatimDataZoom10.address.town
				||
				nominatimDataZoom10.address.village
				||
				'';
			this.#country = nominatimDataZoom18.address.country;
			this.#nominatimStatusOk = true;
		}
	}

	/*
	constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	This method call Nominatim
	@param {Array.<number>} latLng The latitude and longitude of the point for witch the address is searched
	@async
	*/

	async loadData ( latLng ) {

		this.#nominatimStatusOk = false;

		// url
		const nominatimUrl =
			theConfig.nominatim.url + 'reverse?format=json&lat=' +
			latLng [ ZERO ] + '&lon=' + latLng [ ONE ];

		// We do a request with zoom factor 10 for city
		let nominatimUrlZoom10 =
			nominatimUrl + '&zoom=10&addressdetails=1&namedetails=0';

		// We do a request with zoom factor 18 for others data
		let nominatimUrlZoom18 =
			nominatimUrl + '&zoom=18&addressdetails=1&namedetails=1';

		// language
		const nominatimLanguage = theConfig.nominatim.language;
		if ( nominatimLanguage && '*' !== nominatimLanguage ) {
			nominatimUrlZoom10 += '&accept-language=' + nominatimLanguage;
			nominatimUrlZoom18 += '&accept-language=' + nominatimLanguage;
		}

		const nominatimHeaders = new Headers ( );
		if ( nominatimLanguage && '*' === nominatimLanguage ) {
			nominatimHeaders.append ( 'accept-language', '' );
		}

		// call to Nominatim
		const nominatimResponseZoom10 = await fetch ( nominatimUrlZoom10, { headers : nominatimHeaders } );
		const nominatimResponseZoom18 = await fetch ( nominatimUrlZoom18, { headers : nominatimHeaders } );
		if (
			HTTP_STATUS_OK === nominatimResponseZoom10.status
			&&
			nominatimResponseZoom10.ok
			&&
			HTTP_STATUS_OK === nominatimResponseZoom18.status
			&&
			nominatimResponseZoom18.ok
		) {
			this.#parseNominatimData (
				await nominatimResponseZoom10.json ( ),
				await nominatimResponseZoom18.json ( )
			);
		}
		else {
			this.#nominatimStatusOk = false;
		}
	}

	/**
	The name found by Nominatim. Null when an error occurs when calling Nomnatim
	*/

	get name ( ) { return this.#nominatimStatusOk ? this.#name : null; }

	/**
	The street found by Nominatim. Null when an error occurs when calling Nomnatim
	*/

	get street ( ) { return this.#nominatimStatusOk ? this.#street : null; }

	/**
	The city found by Nominatim. Null when an error occurs when calling Nomnatim
	*/

	get city ( ) { return this.#nominatimStatusOk ? this.#city : null; }

	/**
	The country found by Nominatim. Null when an error occurs when calling Nomnatim
	*/

	get country ( ) { return this.#nominatimStatusOk ? this.#country : null; }

}

export default NominatimDataLoader;

/*
@------------------------------------------------------------------------------------------------------------------------------

end of NominatimDataLoader.js file

@------------------------------------------------------------------------------------------------------------------------------
*/