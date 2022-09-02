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
	- v4.0.0:
		- created from v3.6.0
Doc reviewed 202208
 */

import theHTMLSanitizer from '../htmlSanitizer/HTMLSanitizer.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A simple container to store an address created by the geocoder
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class GeoCoderAddress {

	/**
	The name found in OSM by the GeoCoder or an empty string
	@type {String}
	*/

	#name;

	/**
	The house number and the street found in OSM by the GeoCoder or an empty string
	@type {String}
	*/

	#street;

	/**
	The city and eventually the place found in OSM by the GeoCoder or an empty string
	@type {String}
	*/

	#city;

	/**
	The constructor
	@param {String} nominatimName The name found in OSM
	@param {String} street The house number and the street found in OSM
	@param {String} city The city and eventually the place found in OSM
	*/

	constructor ( nominatimName, street, city ) {
		Object.freeze ( this );
		this.#name = theHTMLSanitizer.sanitizeToJsString ( nominatimName );
		this.#street = theHTMLSanitizer.sanitizeToJsString ( street );
		this.#city = theHTMLSanitizer.sanitizeToJsString ( city );
	}

	/**
	The name found in OSM by the GeoCoder or an empty string
	@type {String}
	*/

	get name ( ) { return this.#name; }

	/**
	The house number and the street found in OSM by the GeoCoder or an empty string
	@type {String}
	*/

	get street ( ) { return this.#street; }

	/**
	The city and eventually the place found in OSM by the GeoCoder or an empty string
	@type {String}
	*/

	get city ( ) { return this.#city; }

}

export default GeoCoderAddress;

/* --- End of file --------------------------------------------------------------------------------------------------------- */