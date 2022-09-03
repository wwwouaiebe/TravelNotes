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

import AddressButtonClickEL from './ResetAddressButtonClickEL.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A simple container for the WayPointProperties event listeners
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class WayPointPropertiesDialogEventListeners {

	/**
	The address buton click event listener
	@type {ResetAddressButtonClickEL}
	*/

	#addressButtonClick;

	/**
	The constructor
	@param {WayPointPropertiesDialog} wayPointPropertiesDialog A reference to the NoteDialog object
	*/

	constructor ( wayPointPropertiesDialog ) {
		Object.freeze ( this );
		this.#addressButtonClick = new AddressButtonClickEL ( wayPointPropertiesDialog );
	}

	/**
	Set all events listeners to nul and then release all references to the dialog
	*/

	destructor ( ) {
		this.#addressButtonClick = null;
	}

	/**
	The address buton click event listener
	@type {AddressButtonClickEL}
	*/

	get addressButtonClick ( ) { return this.#addressButtonClick; }

}

export default WayPointPropertiesDialogEventListeners;

/* --- End of file --------------------------------------------------------------------------------------------------------- */