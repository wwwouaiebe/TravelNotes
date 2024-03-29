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

import GeoCoderHelper from './GeoCoderHelper.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Click event listener for the AddressButtonClickEL class
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class AddressButtonClickEL {

	/**
	A reference to the NoteDialog object
	@type {ModalBaseDialog}
	*/

	#dialog;

	/**
	The lat and lng for witch the address must be found
	@type {Array.<Number>}
	*/

	#latLng;

	/**
	The constructor
	@param {ModalBaseDialog} dialog A reference to the dialog object
	@param {Array.<Number>} latLng The lat and lng for witch the address must be found
	*/

	constructor ( dialog, latLng ) {
		Object.freeze ( this );
		this.#dialog = dialog;
		this.#latLng = latLng;
	}

	/**
	Event listener method
	@param {Event} clickEvent The event to handle
	*/

	handleEvent ( clickEvent ) {
		clickEvent.stopPropagation ( );
		new GeoCoderHelper ( this.#dialog ).setAddressWithGeoCoder ( this.#latLng );
	}
}

export default AddressButtonClickEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */