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
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v 4.0.0:
		- Issue ♯48 : Review the dialogs
Doc reviewed 20210901
Tests ...
*/

import NoteDialogGeoCoderHelper from '../notesDialog/NoteDialogToolbarData.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Click event listener for the AddressButtonClickEL class
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class AddressButtonClickEL {

	/**
	A reference to the NoteDialog object
	@type {NoteDialog}
	*/

	#noteDialog;

	/**
	The lat and lng for witch the address must be found
	@type {Array.<Number>}
	*/

	#latLng;

	/**
	The constructor
	@param {NoteDialog} noteDialog A reference to the Notedialog object
	@param {Array.<Number>} latLng The lat and lng for witch the address must be found
	*/

	constructor ( noteDialog, latLng ) {
		Object.freeze ( this );
		this.#noteDialog = noteDialog;
		this.#latLng = latLng;
	}

	/**
	Event listener method
	@param {Event} clickEvent The event to handle
	*/

	handleEvent ( clickEvent ) {
		clickEvent.stopPropagation ( );
		new NoteDialogGeoCoderHelper ( this.#noteDialog ).setAddressWithGeoCoder ( this.#latLng );
	}
}

export default AddressButtonClickEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */