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
	- v1.9.0:
		- created
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
	- v3.4.0:
		- Issue ♯24 : Review the print process
Doc reviewed 20210914
Tests ...
*/

import { ZERO } from '../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
An object to store the PrintRouteMapDialog options
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class PrintRouteMapOptions {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.seal ( this );
	}

	/**
	The paper width option
	@type {Number}
	*/

	paperWidth = ZERO;

	/**
	The paper height option
	@type {Number}
	*/

	paperHeight = ZERO;

	/**
	The border width option
	@type {Number}
	*/

	borderWidth = ZERO;

	/**
	The zoom factor option
	@type {Number}
	*/

	zoomFactor = ZERO;

	/**
	The print notes option
	@type {Boolean}
	*/

	printNotes = false;

	/**
	The used browser ( true = firefox; false = others browsers )
	@type {Boolean}
	 */

	firefoxBrowser = true;
}

export default PrintRouteMapOptions;

/* --- End of file --------------------------------------------------------------------------------------------------------- */