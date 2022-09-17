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

import { ICON_POSITION, INVALID_OBJ_ID, ZERO } from '../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
An object with data shared between the differents objects that are building the note ( TranslationRotationFinder,
ArrowAndTooltipFinder, StreetFinder and SvgBuilder )
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ComputeDataForMapIcon {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.seal ( this );
	}

	/**
	The objId of the nearest itinerary point
	@type {Number}
	*/

	nearestItineraryPointObjId = INVALID_OBJ_ID;

	/**
	the route for witch the note will be created
	@type {Route}
	*/

	route = null;

	/**
	The position on the Route. Must be a property of the ICON_POSITION enum
	@type {Number}
	*/

	positionOnRoute = ICON_POSITION.onRoute;

	/**
	The direction to follow ( = the angle of the outgoing street after the rotation of the svg icon )
	@type {String}
	*/

	direction = null;

	/**
	The arrow to display in the address
	@type {String}
	*/

	directionArrow = ' ';

	/**
	The rcnRef number for bike ( when a bike network exists near the note position )
	@type {String}
	*/

	rcnRef = '';

	/**
	The rotation of the svg icon needed to have the incoming street oriented from the bottom of the icon
	@type {Number}
	*/

	rotation = ZERO;

	/**
	The translation needed to have the note position at the center of the svg icon ( = the translation in
	pixel from the map origin.)
	@type {Array.<Number>}
	*/

	translation = [ ZERO, ZERO ];
}

export default ComputeDataForMapIcon;

/* --- End of file --------------------------------------------------------------------------------------------------------- */