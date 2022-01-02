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
	- v1.12.0:
		- created
	- v2.0.0:
		- Issue ♯135 : Remove innerHTML from code
		- Issue ♯138 : Protect the app - control html entries done by user.
	-v2.2.0:
		- Issue ♯129 : Add an indicator when the travel is modified and not saved
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
Doc reviewed 20210901
Tests ...
*/

/* eslint no-magic-numbers: "off" */

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Enum for the ColorControl and Color classes
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class COLOR_CONTROL {

	/**
	The min value for a color
	@type {Number}
	*/

	static get minColorValue ( ) { return 0; }

	/**
	The max value for a color
	@type {Number}
	*/

	static get maxColorValue ( ) { return 255; }

	/**
	The number of rows of the color control
	@type {Number}
	*/

	static get rowsNumber ( ) { return 6; }

	/**
	The number of cells of the color control
	@type {Number}
	*/

	static get cellsNumber ( ) { return 6; }

	/**
	The delta of color between two cells
	@type {Number}
	*/

	static get deltaColor ( ) { return 51; }

	/**
	The max value of the red slider
	@type {Number}
	*/

	static get sliderMaxValue ( ) { return 100; }

	/**
	The value between each step of the red slider
	@type {Number}
	*/

	static get sliderStep ( ) { return 20; }

	/**
	The initial value of the red slider
	@type {Number}
	*/

	static get initialRed ( ) { return 0; }
}

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
Enum for id's for panes in thePaneManagerUI
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class PANE_ID {

	/**
	The current pane is invalid
	@type {String}
	*/

	static get invalidPane ( ) { return '43a6a53e-008a-4910-80a6-7a87d301ea15'; }

	/**
	The itinerary pane
	@type {String}
	*/

	static get itineraryPane ( ) { return '8fbf0da7-4e6f-4bc7-8e20-1388461ccde7'; }

	/**
	The travel notes pane
	@type {String}
	*/

	static get travelNotesPane ( ) { return 'dffe782b-07df-4b81-a318-f287c0cf5ec6'; }

	/**
	The search pane
	@type {String}
	*/

	static get searchPane ( ) { return '228f00d7-43a8-4c13-897d-70400cb6dd58'; }
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
The margin around the map where drag of dialogs is not possible
@type {Number}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const DIALOG_DRAG_MARGIN = 20;

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

export {
	COLOR_CONTROL,
	DEGREES, DISTANCE,
	ELEV,
	GEOLOCATION_STATUS,
	ICON_DIMENSIONS,
	ICON_POSITION,
	LAT_LNG, PANE_ID,
	ROUTE_EDITION_STATUS,
	SAVE_STATUS,
	DIALOG_DRAG_MARGIN,
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