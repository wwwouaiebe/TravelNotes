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
	- v1.13.0:
		- Issue ♯126 : Add a command "select as start/end/intermediate point" in the osmSearch context menu
		- Issue ♯128 : Unify osmSearch and notes icons and data
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20220828
Tests ...
*/

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A simple container with the lat, lng and geometry of a point of interest
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class PoiData {

	/**
	The lat and lng of the POI
	@type {Array.<Number>}
	*/

	#latLng;

	/**
	The geometry of the POI  The lat and lng of the objects representing the POI on OSM ( POI can be a point ,
	a polyline or a relation ).
	@type {Array.<Array.<Array.<Number>>>}
	*/

	#geometry;

	/**
	The constructor
	@param {Array.<Number>} latLng The lat and lng of the POI
	@param {Array.<Array.<Array.<Number>>>} geometry
	*/

	constructor ( latLng, geometry ) {
		this.#latLng = latLng;
		this.#geometry = geometry;
	}

	/**
	The lat and lng of the POI
	@type {Array.<Number>} The geometry of the POI
	*/

	get latLng ( ) { return this.#latLng; }

	/**
	The geometry of the POI  The lat and lng of the objects representing the POI on OSM ( POI can be a point ,
	a polyline or a relation ).
	@type {Array.<Array.<Array.<Number>>>}
	*/

	get geometry ( ) { return this.#geometry; }

}

export default PoiData;

/* --- End of file --------------------------------------------------------------------------------------------------------- */