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
	- v3.1.0:
		- created
Doc reviewed 20211108
*/

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A simple container to store a latitude and longitude
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class LatLng {

	/**
	The lat
	@type {Number}
	*/

	#lat;

	/**
	The lng
	@type {Number}
	*/

	#lng;

	/**
	The constructor
	@param {Number} lat The lat
	@param {Number} lng The lng
	*/

	constructor ( lat, lng ) {
		Object.freeze ( this );
		this.#lat = lat;
		this.#lng = lng;
	}

	/**
	Create a new LatLng object from another object that have a lat and lng property ( the given object
	can be any other class... )
	@param {Object} something An object with a lat and a lng property
	*/

	static clone ( something ) {
		return new LatLng ( something.lat, something.lng );
	}

	/**
	The lat and lng
	@type {Array.<Number>}
	*/

	get latLng ( ) { return [ this.#lat, this.#lng ]; }

	/**
	The lat
	@type {Number}
	*/

	get lat ( ) { return this.#lat; }

	/**
	The lng
	@type {Number}
	*/

	get lng ( ) { return this.#lng; }
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A simple container to store a latitude, longitude and distance
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class LatLngDistance extends LatLng {

	/**
	The distance
	@type {Number}
	*/

	#distance;

	/**
	The constructor
	@param {Number} lat The lat
	@param {Number} lng The lng
	@param {Number} distance The distance
	*/

	constructor ( lat, lng, distance ) {
		super ( lat, lng );
		this.#distance = distance;
	}

	/**
	The distance
	@type {Number}
	*/

	get distance ( ) { return this.#distance; }

}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A simple container to store the latitude, longitude, elevation, ascent and distance
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class LatLngElevOnRoute extends LatLngDistance {

	/**
	The elevation
	@type {Number}
	*/

	#elev;

	/**
	The ascent
	@type {Number}
	*/

	#ascent;

	/**
	The constructor
	@param {Number} lat The lat
	@param {Number} lng The lng
	@param {Number} distance The distance
	@param {Number} elev The elevation
	@param {Number} ascent The ascent
	*/

	// eslint-disable-next-line max-params
	constructor ( lat, lng, distance, elev, ascent ) {
		super ( lat, lng, distance );
		this.#elev = elev;
		this.#ascent = ascent;
	}

	/**
	The elevation
	@type {Number}
	*/

	get elev ( ) { return this.#elev; }

	/**
	The ascent
	@type {Number}
	*/

	get ascent ( ) { return this.#ascent; }
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A simple container to store a provider name and a provider API key
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class APIKey {

	/**
	The provider name
	@type {String}
	*/

	#providerName;

	/**
	The provider API key
	@type {String}
	*/

	#providerKey;

	/**
	The constructor
	@param {String} providerName The provider name
	@param {String} providerKey The provider API key
	*/

	constructor ( providerName, providerKey ) {
		Object.freeze ( this );
		this.#providerName = 'string' === typeof ( providerName ) ? providerName : '';
		this.#providerKey = 'string' === typeof ( providerKey ) ? providerKey : '';
	}

	/**
	The provider name
	@type {String}
	*/

	get providerName ( ) { return this.#providerName; }

	/**
	The provider API key
	@type {String}
	*/

	get providerKey ( ) { return this.#providerKey; }

}

export { LatLng, LatLngDistance, LatLngElevOnRoute, APIKey };

/* --- End of file --------------------------------------------------------------------------------------------------------- */