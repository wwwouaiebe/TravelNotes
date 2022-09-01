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

import theTranslator from '../../UILib/Translator.js';
import GeoCoder from '../../core/lib/GeoCoder.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Helper class for the address button
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class NoteDialogGeoCoderHelper {

	/**
	A reference to the NoteDialog object
	@type {NoteDialog}
	*/

	#noteDialog;

	/**
	Success handler for the geoCoder.getAddressWithPromise ( ) method
	@param {GeoCoderAddress} address The address found by the geocoder
	*/

	#onAddressUpdatedByGeoCoder ( address ) {
		this.#noteDialog.hideWait ( );
		let addressString = address.street;
		if ( '' !== address.city ) {
			addressString += ' <span class="TravelNotes-NoteHtml-Address-City">' + address.city + '</span>';
		}

		this.#noteDialog.setControlsValues ( { address : addressString } );
		this.#noteDialog.updatePreview ( { address : addressString } );
	}

	/**
	The constructor
	@param {NoteDialog} noteDialog A reference to the Notedialog object
	*/

	constructor ( noteDialog ) {
		Object.freeze ( this );
		this.#noteDialog = noteDialog;
	}

	/**
	Set the address in the dialog, using GeoCoder
	@param {Array.<Number>} latLng The lat and lng of the address to find
	*/

	setAddressWithGeoCoder ( latLng ) {
		this.#noteDialog.showWait ( );
		this.#noteDialog.hideError ( );
		new GeoCoder ( ).getAddressWithPromise ( latLng )
			.then ( address => { this.#onAddressUpdatedByGeoCoder ( address ); } )
			.catch (
				err => {
					if ( err ) {
						console.error ( err );
					}
					this.#noteDialog.hideWait ( );
					this.#noteDialog.showError (
						theTranslator.getText ( 'NoteDialogGeoCoderHelper - an error occurs when searching the adress' )
					);
				}
			);
	}
}

export default NoteDialogGeoCoderHelper;

/* --- End of file --------------------------------------------------------------------------------------------------------- */