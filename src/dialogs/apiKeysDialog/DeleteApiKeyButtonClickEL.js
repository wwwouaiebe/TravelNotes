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
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
	-v 4.0.0:
		- Issue ♯48 : Review the dialogs
Doc reviewed 20220827
Tests ...
*/

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Event listener for click event on the delete key button
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class DeleteApiKeyButtonClickEL {

	/**
	A reference to the control with the ApiKeys
	@type {ApiKeysControl}
	*/

	#apiKeysControl;

	/**
	The constructor
	@param {ApiKeysControl} apiKeysControl A reference to the control with the ApiKeys
	*/

	constructor ( apiKeysControl ) {
		Object.freeze ( this );
		this.#apiKeysControl = apiKeysControl;
	}

	/**
	The destructor
	*/

	destructor ( ) {
		this.#apiKeysControl = null;
	}

	/**
	Event listener method
	@param {Event} clickEvent The event to handle
	*/

	handleEvent ( clickEvent ) {
		clickEvent.preventDefault ( );
		clickEvent.stopPropagation ( );
		this.#apiKeysControl.deleteApiKey ( Number.parseInt ( clickEvent.target.dataset.tanObjId ) );
	}
}

export default DeleteApiKeyButtonClickEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */