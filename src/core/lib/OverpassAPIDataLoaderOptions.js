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

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
An object to store the options for the OverpassAPIDataLoader
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class OverpassAPIDataLoaderOptions {

	/**
	A flag indicating that the OSM places have to be searched
	@type {Boolean}
	*/

	searchPlaces = true;

	/**
	A flag indicating that the OSM ways have to be searched
	@type {Boolean}
	*/

	searchWays = true;

	/**
	A flag indicating that the OSM relations have to be searched
	@type {Boolean}
	*/

	searchRelations = true;

	/**
	A flag indicating that the geometry for ways and relations have to be searched
	@type {Boolean}
	*/

	setGeometry = true;

	/**
	The constructor
	*/

	constructor ( ) {
		Object.seal ( this );
	}
}

export default OverpassAPIDataLoaderOptions;

/* --- End of file --------------------------------------------------------------------------------------------------------- */