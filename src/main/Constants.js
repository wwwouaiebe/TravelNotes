/*
Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/

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

/* ---------------------------------------------------------------------------------------------------------------------------*/
/**
@enum {Object}
Enum for the ColorControl
@property {Number} minColorValue
@property {Number} maxColorValue
@property {Number} rowsNumber
@property {Number} cellsNumber
@property {Number} deltaColor
@property {Number} sliderMaxValue
@property {Number} sliderStep
@property {Number} initialRed

@------------------------------------------------------------------------------------------------------------------------------
 */

export const COLOR_CONTROL = Object.freeze ( {
	minColorValue : 0,
	maxColorValue : 255,
	rowsNumber : 6,
	cellsNumber : 6,
	deltaColor : 51,
	sliderMaxValue : 100,
	sliderStep : 20,
	initialRed : 0
} );

/* ---------------------------------------------------------------------------------------------------------------------------*/
/**
@enum {Object}
Enum for the save status displayed with the coordinates and zoom values
@property {String} notSaved The string to display when the travel is modified since more than 5 minutes
@property {String} modified The string to display when the travel is modified since less than 5 minutes
@property {String} saved The string to display when the travel is not modified
*/
/* ---------------------------------------------------------------------------------------------------------------------------*/

export const SAVE_STATUS = Object.freeze ( {
	notSaved : '🔴', // red circle
	modified : '🟡', // yellow circle
	saved : '🟢' // green circle
} );

/* ---------------------------------------------------------------------------------------------------------------------------*/
/**
@enum {Object}
Enum for distances
@property {Number} fixed The decimal length used for distances
@property {Number} invalid The distance is invalid
@property {Number} defaultValue Default value for distances
*/
/* ---------------------------------------------------------------------------------------------------------------------------*/

export const DISTANCE = Object.freeze ( {
	fixed : 2,
	invalid : -1,
	defaultValue : 0,
	metersInKm : 1000
} );

/* ---------------------------------------------------------------------------------------------------------------------------*/
/**
@enum {Object}
Enum for geolocation status
@property {Number} refusedByUser The user don't accept to be localized
@property {Number} disabled The geolocation is not available (disabled in the browser or unsecure context)
@property {Number} inactive The geolocation is inactive
@property {Number} active the geolocation is active
*/
/* ---------------------------------------------------------------------------------------------------------------------------*/

export const GEOLOCATION_STATUS = Object.freeze ( {
	refusedByUser : -1,
	disabled : 0,
	inactive : 1,
	active : 2
} );

/* ---------------------------------------------------------------------------------------------------------------------------*/
/**
@enum {Object}
Enum for id's for panes in thePaneManagerUI
@property {String} invalidPane The current pane is invalid
@property {String} itineraryPane The itinerary pane
@property {String} travelNotesPane The travel notes pane
@property {String} searchPane The search pane
*/
/* ---------------------------------------------------------------------------------------------------------------------------*/

export const PANE_ID = Object.freeze ( {
	invalidPane : '43a6a53e-008a-4910-80a6-7a87d301ea15',
	itineraryPane : '8fbf0da7-4e6f-4bc7-8e20-1388461ccde7',
	travelNotesPane : 'dffe782b-07df-4b81-a318-f287c0cf5ec6',
	searchPane : '228f00d7-43a8-4c13-897d-70400cb6dd58'
} );

/* ---------------------------------------------------------------------------------------------------------------------------*/
/**
@enum {Object}
Enum for elevations
@property {Number} fixed The decimal length used for elevation
@property {Number} defaultValue Default value for elevation
*/
/* ---------------------------------------------------------------------------------------------------------------------------*/

export const ELEV = Object.freeze ( {
	fixed : 2,
	defaultValue : 0
} );

/* ---------------------------------------------------------------------------------------------------------------------------*/
/**
@enum {Object}
Enum for latitude and longitude
@property {Number} fixed The decimal length used for latitude and longitude
@property {Number} defaultValue Default value for latitude and longitude
*/
/* ---------------------------------------------------------------------------------------------------------------------------*/

export const LAT_LNG = Object.freeze ( {
	defaultValue : 0,
	fixed : 6,
	maxLat : 90,
	minLat : -90,
	maxLng : 180,
	minLng : -180
} );

/* ---------------------------------------------------------------------------------------------------------------------------*/
/**
@enum {Object}
Enum for edition status of a route
@property {Number} notEdited The route is currently not edited
@property {Number} editedNoChange The route is currently edited but without changes
@property {Number} editedChanged The route is currently edited and changed
*/
/* ---------------------------------------------------------------------------------------------------------------------------*/

export const ROUTE_EDITION_STATUS = Object.freeze ( {
	notEdited : 0,
	editedNoChange : 1,
	editedChanged : 2
} );

/* ---------------------------------------------------------------------------------------------------------------------------*/
/**
@enum {Object}
Enum for default icon dimensions
@property {Number} width The default width
@property {Number} height The default height
*/
/* ---------------------------------------------------------------------------------------------------------------------------*/

export const ICON_DIMENSIONS = Object.freeze ( {
	width : 40,
	height : 40,
	svgViewboxDim : 200
} );

/* ---------------------------------------------------------------------------------------------------------------------------*/
/**
@enum {Object}
Enum for angular operations
*/
/* ---------------------------------------------------------------------------------------------------------------------------*/

export const DEGREES = Object.freeze ( {
	d0 : 0,
	d90 : 90,
	d180 : 180,
	d270 : 270,
	d360 : 360,
	d540 : 540,
	toRadians : Math.PI / 180,
	fromRadians : 180 / Math.PI
} );

/* ---------------------------------------------------------------------------------------------------------------------------*/
/**
@enum {Object}
Enum for map svg icons
*/
/* ---------------------------------------------------------------------------------------------------------------------------*/

export const ICON_POSITION = Object.freeze ( {
	atStart : -1,
	onRoute : 0,
	atEnd : 1
} );

/**
An array with correction factors to use in the wheel event (wheelEvent.deltaX and wheelEvent.deltaY are dependant of
wheelEvent.deltaMode and deltaMode is browser dependant...)
*/

export const MOUSE_WHEEL_FACTORS = [ 0.3, 10, 1 ];

export const INVALID_OBJ_ID = -1;

export const NOT_FOUND = -1;

export const PREVIOUS = -1;

export const ZERO = 0;

export const LAT = 0;

export const ONE = 1;

export const NEXT = 1;

export const LNG = 1;

export const TWO = 2;

export const ELEVATION = 2;

export const THREE = 3;

export const HEXADECIMAL = 16;

export const HTTP_STATUS_OK = 200;

export const OSM_COUNTRY_ADMIN_LEVEL = '2';

export const SVG_NS = 'http://www.w3.org/2000/svg';

export const EARTH_RADIUS = 6371e3;

export const WAY_POINT_ICON_SIZE = 20;

export const DIALOG_DRAG_MARGIN = 20;

/* --- End of file -----------------------------------------------------------------------------------------------------------*/