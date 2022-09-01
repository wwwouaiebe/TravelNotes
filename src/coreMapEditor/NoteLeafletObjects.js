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
	- v1.6.0:
		- created from MapEditor
	- v1.8.0:
		- Issue ♯97 : Improve adding a new waypoint to a route
	- v1.12.0:
		- Issue ♯120 : Review the UserInterface
	- v2.0.0:
		- Issue ♯142 : Transform the layer object to a class as specified in the layersToolbarUI.js
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
	- v3.2.0:
		- Issue ♯4 : Line type and line width for routes are not adapted on the print views
	- v4.0.0:
		- Issue # 44 : Always some problems with geo location on android
Doc reviewed 20210914
Tests ...
*/

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A simple container with all the Leaflet objects for a note created by the MapEditorViewer.addNote ( )
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class NoteLeafletObjects {

	/**
	The marker of the note (= a L.Marker object)
	@type {LeafletObject}
	*/

	#marker;

	/**
	The polyline of the note (= a L.Polyline object)
	@type {LeafletObject}
	*/

	#polyline;

	/**
	The bullet of the note (= a L.Marker object)
	@type {LeafletObject}
	*/

	#bullet;

	/**
	The constructor
	@param {LeafletObject} marker The marker of the note
	@param {LeafletObject} polyline The polyline of the note
	@param {LeafletObject} bullet The bullet of the note
	*/

	constructor ( marker, polyline, bullet ) {
		Object.freeze ( this );
		this.#marker = marker;
		this.#polyline = polyline;
		this.#bullet = bullet;
	}

	/**
	The marker of the note (= a L.Marker object)
	@type {LeafletObject}
	*/

	get marker ( ) { return this.#marker; }

	/**
	The polyline of the note (= a L.Polyline object)
	@type {LeafletObject}
	*/

	get polyline ( ) { return this.#polyline; }

	/**
	The bullet of the note (= a L.Marker object)
	@type {LeafletObject}
	*/

	get bullet ( ) { return this.#bullet; }

}

export default NoteLeafletObjects;

/* --- End of file --------------------------------------------------------------------------------------------------------- */