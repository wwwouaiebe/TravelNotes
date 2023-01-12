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

/* eslint-disable no-magic-numbers */
/* eslint-disable max-classes-per-file */

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Enum for angular operations
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class DEGREES {

	/**
	0°
	@type {Number}
	*/

	static get d0 ( ) { return 0; }

	/**
	90°
	@type {Number}
	*/

	static get d90 ( ) { return 90; }

	/**
	180°
	@type {Number}
	*/

	static get d180 ( ) { return 180; }

	/**
	270°
	@type {Number}
	*/

	static get d270 ( ) { return 270; }

	/**
	360°
	@type {Number}
	*/

	static get d360 ( ) { return 360; }

	/**
	540°
	@type {Number}
	*/

	static get d540 ( ) { return 540; }

	/**
	Conversion ° to radians
	@type {Number}
	*/

	static get toRadians ( ) { return Math.PI / 180; }

	/**
	Conversion radians to °
	@type {Number}
	*/

	static get fromRadians ( ) { return 180 / Math.PI; }
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Enum for distances
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class DISTANCE {

	/**
	The decimal length used for distances
	@type {Number}
	*/

	static get fixed ( ) { return 2; }

	/**
	The distance is invalid
	@type {Number}
	*/

	static get invalid ( ) { return -1; }

	/**
	Default value for distances
	@type {Number}
	*/

	static get defaultValue ( ) { return 0; }

	/**
	Meters in one kilometer
	@type {Number}
	*/

	static get metersInKm ( ) { return 1000; }
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Enum for elevations
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ELEV {

	/**
	The decimal length used for elevation
	@type {Number}
	*/

	static get fixed ( ) { return 2; }

	/**
	Default value for elevation
	@type {Number}
	*/

	static get defaultValue ( ) { return 0; }
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Enum for geolocation status
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class GEOLOCATION_STATUS {

	/**
	The user don't accept to be localized
	@type {Number}
	*/

	static get refusedByUser ( ) { return -1; }

	/**
	The geolocation is not available (disabled in the browser or unsecure context)
	@type {Number}
	*/

	static get disabled ( ) { return 0; }

	/**
	The geolocation is inactive
	@type {Number}
	*/

	static get inactive ( ) { return 1; }

	/**
	The geolocation is active
	@type {Number}
	*/

	static get active ( ) { return 2; }
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Enum for default icon dimensions
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ICON_DIMENSIONS {

	/**
	The default width
	@type {Number}
	*/

	static get width ( ) { return 40; }

	/**
	The default height
	@type {Number}
	*/

	static get height ( ) { return 40; }

	/**
	The viewbox size for svg icons
	@type {Number}
	*/

	static get svgViewboxDim ( ) { return 200; }
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Enum for map svg icons
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ICON_POSITION {

	/**
	The icon is on the start point
	@type {Number}
	*/

	static get atStart ( ) { return -1; }

	/**
	The icon is between the start point and end point
	@type {Number}
	*/

	static get onRoute ( ) { return 0; }

	/**
	The icon is on the end point
	@type {Number}
	*/

	static get atEnd ( ) { return 1; }
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Enum for latitude and longitude
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class LAT_LNG {

	/**
	Default value for latitude and longitude
	@type {Number}
	*/

	static get defaultValue ( ) { return 0; }

	/**
	The decimal length used for latitude and longitude
	@type {Number}
	*/

	static get fixed ( ) { return 6; }

	/**
	The max possibe lat
	@type {Number}
	*/

	static get maxLat ( ) { return 90; }

	/**
	The min possibe lat
	@type {Number}
	*/

	static get minLat ( ) { return -90; }

	/**
	The max possibe lng
	@type {Number}
	*/

	static get maxLng ( ) { return 180; }

	/**
	The min possibe lng
	@type {Number}
	*/

	static get minLng ( ) { return -180; }
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Enum for edition status of a route
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ROUTE_EDITION_STATUS {

	/**
	The route is currently not edited
	@type {Number}
	*/

	static get notEdited ( ) { return 0; }

	/**
	The route is currently edited but without changes
	@type {Number}
	*/

	static get editedNoChange ( ) { return 1; }

	/**
	The route is currently edited and changed
	@type {Number}
	*/

	static get editedChanged ( ) { return 2; }
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Enum for the save status displayed with the coordinates and zoom values
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class SAVE_STATUS {

	/**
	The string to display when the travel is modified since more than 5 minutes
	@type {String}
	*/

	static get notSaved ( ) { return '🔴'; }

	/**
	The string to display when the travel is modified since less than 5 minutes
	@type {String}
	*/

	static get modified ( ) { return '🟡'; }

	/**
	The string to display when the travel is not modified
	@type {String}
	*/

	static get saved ( ) { return '🟢'; }
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Enum for the toolbars position
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TOOLBAR_POSITION {

	/**
	The toolbar will be displayed on the top left corner of the screen
	@type {String}
	*/

	static get topLeft ( ) { return 'TravelNotes-BaseToolbar-TopLeft'; }

	/**
	The toolbar will be displayed on the top right corner of the screen
	@type {String}
	*/

	static get topRight ( ) { return 'TravelNotes-BaseToolbar-TopRight'; }

	/**
	The toolbar will be displayed on the bottom left corner of the screen
	@type {String}
	*/

	static get bottomLeft ( ) { return 'TravelNotes-BaseToolbar-BottomLeft'; }

	/**
	The toolbar will be displayed on the bottom right corner of the screen
	@type {String}
	*/

	static get bottomRight ( ) { return 'TravelNotes-BaseToolbar-BottomRight'; }

}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The margin around the map where drag of dialogs is not possible
@type {Number}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const DIALOG_DRAG_MARGIN = 40;

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The max width of a dialog
@type {Number}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const DIALOG_MAX_WIDTH = 800;

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The earth radius
@type {Number}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const EARTH_RADIUS = 6371e3;

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A constant used to select the elev in arrays
@type {Number}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const ELEVATION = 2;

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The hexadecimal format
@type {Number}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const HEXADECIMAL = 16;

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The http status 200
@type {Number}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const HTTP_STATUS_OK = 200;

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A constant used for invalid objId
@type {Number}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const INVALID_OBJ_ID = -1;

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A constant used to select the lat in arrays
@type {Number}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const LAT = 0;

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A constant used to select the lng in arrays
@type {Number}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const LNG = 1;

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
An array with correction factors to use in the wheel event (wheelEvent.deltaX and wheelEvent.deltaY are dependant of
wheelEvent.deltaMode and deltaMode is browser dependant...)
@type {Array.<Number>}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const MOUSE_WHEEL_FACTORS = [ 0.3, 10, 1 ];

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A contant used to move in arrays
@type {Number}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const NEXT = 1;

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Used to compare with some results of Array and String methods
@type {Number}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const NOT_FOUND = -1;

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The number 1
@type {Number}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const ONE = 1;

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The OSM country admin level
@type {Number}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const OSM_COUNTRY_ADMIN_LEVEL = '2';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A contant used to move in arrays
@type {Number}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const PREVIOUS = -1;

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The svg namespace
@type {String}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const SVG_NS = 'http://www.w3.org/2000/svg';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The number 3
@type {Number}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const THREE = 3;

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The number 2
@type {Number}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const TWO = 2;

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The icon size for waypoints
@type {Number}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const WAY_POINT_ICON_SIZE = 20;

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The number 0
@type {Number}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const ZERO = 0;

/* ------------------------------------------------------------------------------------------------------------------------- */

/* eslint-enable no-magic-numbers */
/* eslint-enable max-classes-per-file */

export {
	DEGREES,
	DISTANCE,
	ELEV,
	GEOLOCATION_STATUS,
	ICON_DIMENSIONS,
	ICON_POSITION,
	LAT_LNG,
	ROUTE_EDITION_STATUS,
	SAVE_STATUS,
	TOOLBAR_POSITION,
	DIALOG_DRAG_MARGIN,
	DIALOG_MAX_WIDTH,
	EARTH_RADIUS,
	ELEVATION,
	HEXADECIMAL,
	HTTP_STATUS_OK,
	INVALID_OBJ_ID,
	LAT,
	LNG,
	MOUSE_WHEEL_FACTORS,
	NEXT,
	NOT_FOUND,
	ONE,
	OSM_COUNTRY_ADMIN_LEVEL,
	PREVIOUS,
	SVG_NS,
	THREE,
	TWO,
	WAY_POINT_ICON_SIZE,
	ZERO
};

/* --- End of file --------------------------------------------------------------------------------------------------------- */