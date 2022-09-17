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

import { LAT_LNG } from '../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
An object with data used to build the Note
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class NoteDataForMapIcon {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.seal ( this );
	}

	/**
	The icon content ( = the outerHTML of the SVG with streets itinerary and rcnRef number )
	@type {String}
	*/

	iconContent = '';

	/**
	The tooltip ( = the direction to follow + indications on roundabout, rcnRef and start point or end point )
	@type {String}
	*/

	tooltipContent = '';

	/**
	The address ( = streets names at the note position and city and hamlet )
	@type {String}
	*/

	address = '';

	/**
	The lat and lng of the note
	@type {Array.<Number>}
	*/

	latLng = [ LAT_LNG.defaultValue, LAT_LNG.defaultValue ];
}

export default NoteDataForMapIcon;

/* --- End of file --------------------------------------------------------------------------------------------------------- */