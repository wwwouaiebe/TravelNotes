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

import theTranslator from '../../core/uiLib/Translator.js';
import GeoCoder from '../../core/lib/GeoCoder.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Helper class for the address button
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class GeoCoderHelper {

	/**
	A reference to the dialog object
	@type {ModalBaseDialog}
	*/

	#dialog;

	/**
	Success handler for the geoCoder.getAddressWithPromise ( ) method
	@param {GeoCoderAddress} address The address found by the geocoder
	*/

	#onAddressUpdatedByGeoCoder ( address ) {
		this.#dialog.hideWait ( );
		let addressString = address.street;
		if ( '' !== address.city ) {
			addressString += ' <span class="TravelNotes-NoteHtml-Address-City">' + address.city + '</span>';
		}

		this.#dialog.setControlsValues ( { address : addressString } );
		this.#dialog.updatePreview ( { address : addressString } );
	}

	/**
	The constructor
	@param {NoteDialog} noteDialog A reference to the Notedialog object
	*/

	constructor ( noteDialog ) {
		Object.freeze ( this );
		this.#dialog = noteDialog;
	}

	/**
	Set the address in the dialog, using GeoCoder
	@param {Array.<Number>} latLng The lat and lng of the address to find
	*/

	setAddressWithGeoCoder ( latLng ) {
		this.#dialog.showWait ( );
		this.#dialog.hideError ( );
		new GeoCoder ( ).getAddressWithPromise ( latLng )
			.then ( address => { this.#onAddressUpdatedByGeoCoder ( address ); } )
			.catch (
				err => {
					if ( err ) {
						console.error ( err );
					}
					this.#dialog.hideWait ( );
					this.#dialog.showError (
						theTranslator.getText ( 'NoteDialogGeoCoderHelper - an error occurs when searching the adress' )
					);
				}
			);
	}
}

export default GeoCoderHelper;

/* --- End of file --------------------------------------------------------------------------------------------------------- */