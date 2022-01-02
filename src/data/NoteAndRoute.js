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
	- v3.1.0:
		- Created
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210913
Tests ...
*/

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A container with a note and the route to witch the note is linked
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class NoteAndRoute {

	/**
	The Note
	@type {?Note}
	*/

	#note;

	/**
	The route
	@type {?Route}
	*/

	#route;

	/**
	The constructor
	@param {Note} note The note to store
	@param {Route} route The route to store
	*/

	constructor ( note, route ) {
		Object.freeze ( this );
		this.#note = note;
		this.#route = route;
	}

	/**
	The Note
	@type {?Note}
	*/

	get note ( ) { return this.#note; }

	/**
	The route
	@type {?Route}
	*/

	get route ( ) { return this.#route; }
}

export default NoteAndRoute;

/* --- End of file --------------------------------------------------------------------------------------------------------- */