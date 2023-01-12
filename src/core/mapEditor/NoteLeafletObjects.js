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