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
	- v4.0.0:
		- created from v3.6.0
Doc reviewed 202208
 */

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Focus event listener for all controls
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class AllControlsFocusEL {

	/**
	A reference to the NoteDialog object
	@type {NoteDialog}
	*/

	#noteDialog;

	/**
	The constructor
	@param {NoteDialog} noteDialog A reference to the Notedialog object
	*/

	constructor ( noteDialog ) {
		Object.freeze ( this );
		this.#noteDialog = noteDialog;
	}

	/**
	Event listener method
	@param {Event} focusEvent The event to handle
	*/

	handleEvent ( focusEvent ) {
		focusEvent.stopPropagation ( );
		if ( 'url' === focusEvent.target.dataset.tanName ) {
			this.#noteDialog.focusControl = null;
		}
		else {
			this.#noteDialog.focusControl = focusEvent.target;
		}
	}
}

export default AllControlsFocusEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */