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
	- v1.0.0:
		- created
	- v1.3.0:
		- changed message
	- v1.4.0:
		- Replacing DataManager with TravelNotesData, Config, Version and DataSearchEngine
		- added reset button for address
		- added svg icons
		- reviewed code
		- added language for TravelNotesDialogXX.json file
	- v1.6.0:
		- Issue ♯65 : Time to go to ES6 modules?
		- Issue ♯66 : Work with promises for dialogs
		- Issue ♯68 : Review all existing promises.
		- Issue ♯76 : Add a devil button in the noteDialog.
	- v1.11.0:
		- Issue ♯110 : Add a command to create a SVG icon from osm for each maneuver
	- v1.12.0:
		- Issue ♯120 : Review the UserInterface
	- v2.0.0:
		- Issue ♯135 : Remove innerHTML from code
		- Issue ♯138 : Protect the app - control html entries done by user.
		- Issue ♯144 : Add an error message when a bad json file is loaded from the noteDialog
	- v2.2.0:
		- Issue ♯64 : Improve geocoding
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
	- v 4.0.0:
		- Issue ♯48 : Review the dialogs
Doc reviewed 20210913
Tests ...
*/

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A simple container to store the lat, lng and route needed to build a map icon
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class MapIconData {

	/**
	The lat and lng
	@type {Array.<Number>}
	*/

	#latLng;

	/**
	The route
	@type {Route}
	*/

	#route;

	/**
	The constructor
	@param {Array.<Number>} latLng The lat and lng
	@param {Route} route The route
	*/

	constructor ( latLng, route ) {
		Object.freeze ( this );
		this.#latLng = latLng;
		this.#route = route;
	}

	/**
	The lat and lng
	@type {Array.<Number>}
	*/

	get latLng ( ) { return this.#latLng; }

	/**
	The route
	@type {Route}
	*/

	get route ( ) { return this.#route; }
}

export default MapIconData;

/* --- End of file --------------------------------------------------------------------------------------------------------- */