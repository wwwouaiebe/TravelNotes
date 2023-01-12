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

import { ZERO, LAT_LNG } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A container with data found when searching the nearest route from a point
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class DataSearchEngineNearestRouteData {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.seal ( this );
	}

	/**
	The distance between the given point and the nearest point on the route
	@type {Number}
	*/

	distance = Number.MAX_VALUE;

	/**
	The route on witch the point was found
	@type {Route}
	*/

	route = null;

	/**
	The distance between the beginning of the route and the nearest point
	@type {Number}
	*/

	distanceOnRoute = ZERO;

	/**
	The lat and lng of the nearest point on the route
	@type {Array.<Number>}
	*/

	latLngOnRoute = [ LAT_LNG.defaultValue, LAT_LNG.defaultValue ];
}

export default DataSearchEngineNearestRouteData;

/* --- End of file --------------------------------------------------------------------------------------------------------- */