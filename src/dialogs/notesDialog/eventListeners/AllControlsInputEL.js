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
input event listener for all control
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class AllControlsInputEL {

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
	@param {Event} inputUpdatedEvent The event to handle
	*/

	handleEvent ( inputUpdatedEvent ) {
		inputUpdatedEvent.stopPropagation ( );
		const noteData = {};
		if (
			'iconWidth' === inputUpdatedEvent.target.dataset.tanName
			||
			'iconHeight' === inputUpdatedEvent.target.dataset.tanName
		) {
			noteData [ inputUpdatedEvent.target.dataset.tanName ] = Number.parseInt ( inputUpdatedEvent.target.value );
		}
		else {
			noteData [ inputUpdatedEvent.target.dataset.tanName ] = inputUpdatedEvent.target.value;
		}
		this.#noteDialog.updatePreview ( noteData );
	}
}

export default AllControlsInputEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */