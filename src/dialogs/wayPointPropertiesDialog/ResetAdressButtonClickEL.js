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

import GeoCoder from '../../core/lib/GeoCoder.js';
import theConfig from '../../data/Config.js';

/**
Click event listener for the reset address button
*/

class ResetAdressButtonClickEL {

	/**
	A reference to the dialog
	@type {WayPointPropertiesDialog}
	*/

	#wayPointPropertiesDialog;

	/**
	 the constructor
	 @param {WayPointPropertiesDialog} wayPointPropertiesDialog A reference to the dialog
	 */

	constructor ( wayPointPropertiesDialog ) {
		Object.freeze ( this );
		this.#wayPointPropertiesDialog = wayPointPropertiesDialog;
	}

	/**
	Destructor
	*/

	destructor ( ) {
		this.#wayPointPropertiesDialog = null;
	}

	/**
	Event listener method
	@param {Event} clickEvent the event to handle
	*/

	async handleEvent ( clickEvent ) {
		clickEvent.stopPropagation ( );
		if ( ! theConfig.wayPoint.reverseGeocoding ) {
			return;
		}
		this.#wayPointPropertiesDialog.showWait ( );
		const address = await new GeoCoder ( )
			.getAddressAsync ( this.#wayPointPropertiesDialog.wayPoint.latLng );
		this.#wayPointPropertiesDialog.hideWait ( );

		if ( theConfig.wayPoint.geocodingIncludeName ) {
			this.#wayPointPropertiesDialog.name = address.name;
		}

		let addressString = address.street;
		if ( '' !== address.city ) {
			addressString += ' ' + address.city;
		}
		this.#wayPointPropertiesDialog.address = addressString;
	}
}

export default ResetAdressButtonClickEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */