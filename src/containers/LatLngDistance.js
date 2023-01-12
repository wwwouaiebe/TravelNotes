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

import LatLng from './LatLng.js';

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

export default LatLngDistance;

/* --- End of file --------------------------------------------------------------------------------------------------------- */