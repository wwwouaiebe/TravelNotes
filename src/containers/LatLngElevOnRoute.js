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
	-v 4.0.0:
		- Issue ♯48 : Review the dialogs
Doc reviewed 20211108
*/

import LatLngDistance from './LatLngDistance.js';

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

export default LatLngElevOnRoute;

/* --- End of file --------------------------------------------------------------------------------------------------------- */