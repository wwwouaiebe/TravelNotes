/*
Copyright - 2017 2023 - wwwouaiebe - Contact: https://www.ouaie.be/

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
	- v4.0.0:
		- created from v3.6.0
Doc reviewed 202208
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

export default LatLng;

/* --- End of file --------------------------------------------------------------------------------------------------------- */