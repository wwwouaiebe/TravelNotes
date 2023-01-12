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
A simple container with the user choices in the SaveAsDialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class SaveAsDialogData {

	/**
	A flag indicating that the travel notes have to be removed
	@type {Boolean}
	*/

	#removeTravelNotes;

	/**
	A flag indicating that the route notes have to be removed
	@type {Boolean}
	*/

	#removeRoutesNotes;

	/**
	A flag indicating that the maneuvers have to be removed
	@type {Boolean}
	*/

	#removeManeuvers;

	/**
	The constructor
	@param {Boolean} removeTravelNotes A flag indicating that the travel notes have to be removed
	@param {Boolean} removeRoutesNotes A flag indicating that the route notes have to be removed
	@param {Boolean} removeManeuvers A flag indicating that the maneuvers have to be removed
	*/

	constructor ( removeTravelNotes, removeRoutesNotes, removeManeuvers ) {
		Object.freeze ( this );
		this.#removeTravelNotes = removeTravelNotes;
		this.#removeRoutesNotes = removeRoutesNotes;
		this.#removeManeuvers = removeManeuvers;
	}

	/**
	A flag indicating that the travel notes have to be removed
	@type {Boolean}
	*/

	get removeTravelNotes ( ) { return this.#removeTravelNotes; }

	/**
	A flag indicating that the route notes have to be removed
	@type {Boolean}
	*/

	get removeRoutesNotes ( ) { return this.#removeRoutesNotes; }

	/**
	A flag indicating that the maneuvers have to be removed
	@type {Boolean}
	*/

	get removeManeuvers ( ) { return this.#removeManeuvers; }
}

export default SaveAsDialogData;

/* --- End of file --------------------------------------------------------------------------------------------------------- */