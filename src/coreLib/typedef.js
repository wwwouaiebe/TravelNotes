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
	- v3.1.0:
		- created
Doc reviewed 20211108
*/

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
An address created by the GeoCoder
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

// eslint-disable-next-line no-unused-vars
class GeoCoderAddress {

	/**
	The name found in OSM by the GeoCoder or an empty string
	@type {String}
	*/

	name;

	/**
	The house number and the street found in OSM by the GeoCoder or an empty string
	@type {String}
	*/

	street;

	/**
	The city and eventually the place found in OSM by the GeoCoder or an empty string
	@type {String}
	*/

	city;

	/**
	A status indicating that all the requests are executed correctly
	@type {Boolean}
	*/

	statusOk;
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A simple container with all the Leaflet objects for a note created by the MapEditorViewer.addNote ( )
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

// eslint-disable-next-line no-unused-vars
class NoteLeafletObjects {

	/**
	The marker of the note (= a L.Marker object)
	@type {LeafletObject}
	*/

	marker;

	/**
	The polyline of the note (= a L.Polyline object)
	@type {LeafletObject}
	*/

	polyline;

	/**
	The bullet of the note (= a L.Marker object)
	@type {LeafletObject}
	*/

	bullet;
}

/* --- End of file --------------------------------------------------------------------------------------------------------- */