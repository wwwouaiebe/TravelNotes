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
Doc reviewed 20210901
Tests ...
*/

import theHTMLSanitizer from '../coreLib/HTMLSanitizer.js';
import theTranslator from '../UILib/Translator.js';
import GeoCoder from '../coreLib/GeoCoder.js';
import theUtilities from '../UILib/Utilities.js';
import theNoteDialogToolbarData from '../dialogNotes/NoteDialogToolbarData.js';
import MapIconFromOsmFactory from '../coreMapIcon/MapIconFromOsmFactory.js';
import { ZERO } from '../main/Constants.js';

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

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
blur event listener for url input
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class UrlInputBlurEL {

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
	@param {Event} blurEvent The event to handle
	*/

	handleEvent ( blurEvent ) {
		blurEvent.stopPropagation ( );
		if ( '' === blurEvent.target.value ) {
			this.#noteDialog.hideError ( );
			return;
		}

		const verifyResult = theHTMLSanitizer.sanitizeToUrl ( blurEvent.target.value );
		if ( '' === verifyResult.errorsString ) {
			this.#noteDialog.hideError ( );
		}
		else {
			this.#noteDialog.showError ( theTranslator.getText ( 'UrlInputBlurEL - invalidUrl' ) );
		}
	}
}

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

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
click event listener for the edition buttons
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class EditionButtonsClickEL {

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
	@param {Event} clickEvent The event to handle
	*/

	handleEvent ( clickEvent ) {
		if ( ! this.#noteDialog.focusControl ) {
			return;
		}
		const button = clickEvent.currentTarget;
		let selectionStart = this.#noteDialog.focusControl.selectionStart;
		let selectionEnd = this.#noteDialog.focusControl.selectionEnd;

		this.#noteDialog.focusControl.value =
			this.#noteDialog.focusControl.value.slice ( ZERO, selectionStart ) +
			button.dataset.tanHtmlBefore +
			(
				ZERO === button.dataset.tanHtmlAfter.length
					?
					''
					:
					this.#noteDialog.focusControl.value.slice ( selectionStart, selectionEnd )
			) +
			button.dataset.tanHtmlAfter +
			this.#noteDialog.focusControl.value.slice ( selectionEnd );

		if ( selectionStart === selectionEnd || ZERO === button.dataset.tanHtmlAfter.length ) {
			selectionStart += button.dataset.tanHtmlBefore.length;
			selectionEnd = selectionStart;
		}
		else {
			selectionEnd += button.dataset.tanHtmlBefore.length + button.dataset.tanHtmlAfter.length;
		}
		this.#noteDialog.focusControl.setSelectionRange ( selectionStart, selectionEnd );
		this.#noteDialog.focusControl.focus ( );
		const noteData = {};
		noteData [ this.#noteDialog.focusControl.dataset.tanName ] = this.#noteDialog.focusControl.value;
		this.#noteDialog.updatePreview ( noteData );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
change event listener for the icon selector
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class IconSelectorChangeEL {

	/**
	A reference to the NoteDialog object
	@type {NoteDialog}
	*/

	#noteDialog;

	/**
	Helper method for the onIconSelectChange mehod
	@param {Object} noteData An object with the note properties to update
	*/

	#updatePreviewAndControls ( noteData )	{
		this.#noteDialog.setControlsValues ( noteData );
		this.#noteDialog.updatePreview ( noteData );
	}

	/**
	Svg Map icon creation
	*/

	#onMapIcon ( ) {
		const mapIconData = this.#noteDialog.mapIconData;
		if ( ! mapIconData.route ) {
			this.#noteDialog.showError (
				theTranslator.getText ( 'IconSelectorChangeEL - not possible to create a SVG icon for a travel note' )
			);
			return;
		}

		this.#noteDialog.showWait ( );
		new MapIconFromOsmFactory ( ).getIconAndAdressWithPromise ( mapIconData )
			.then (
				noteData => {
					this.#noteDialog.hideWait ( );
					this.#updatePreviewAndControls ( noteData );
				}
			)
			.catch (
				err => {
					if ( err instanceof Error ) {
						console.error ( err );
					}
					this.#noteDialog.hideWait ( );
					this.#noteDialog.showError (
						theTranslator.getText ( 'IconSelectorChangeEL - an error occurs when creating the SVG icon' )
					);
				}
			);
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
	Event listener method
	@param {Event} changeEvent The event to handle
	*/

	handleEvent ( changeEvent ) {
		changeEvent.stopPropagation ( );
		const preDefinedIcon = theNoteDialogToolbarData.preDefinedIconDataAt ( changeEvent.target.selectedIndex );

		if ( 'SvgIcon' === preDefinedIcon.icon ) {
			this.#onMapIcon ( );
			return;
		}

		this.#updatePreviewAndControls (
			{
				iconContent : preDefinedIcon.icon,
				iconHeight : preDefinedIcon.height,
				iconWidth : preDefinedIcon.width,
				tooltipContent : preDefinedIcon.tooltip
			}
		);
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
click event listener for the toogle button
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ToggleContentsButtonClickEL {

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
	@param {Event} clickEvent The event to handle
	*/

	handleEvent ( clickEvent ) {
		clickEvent.target.textContent = '▼' === clickEvent.target.textContent ? '▶' : '▼';
		this.#noteDialog.toogleContents ( );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
change event listener for the temp open file input
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class OpenFileInputChangeEL {

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
	@param {Event} changeEvent The event to handle
	*/

	handleEvent ( changeEvent ) {
		changeEvent.stopPropagation ( );
		const fileReader = new FileReader ( );
		fileReader.onload = ( ) => {
			try {
				theNoteDialogToolbarData.loadJson ( JSON.parse ( fileReader.result ) );
				this.#noteDialog.updateToolbar ( );
			}
			catch ( err ) {
				if ( err instanceof Error ) {
					console.error ( err );
				}
			}
		};
		fileReader.readAsText ( changeEvent.target.files [ ZERO ] );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
click event listener for the open file button
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class OpenFileButtonClickEL {

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
	@param {Event} clickEvent The event to handle
	*/

	handleEvent ( clickEvent ) {
		clickEvent.stopPropagation ( );
		theUtilities.openFile ( new OpenFileInputChangeEL ( this.#noteDialog ), '.json' );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A simple container for the NoteDialog event listeners
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class NoteDialogEventListeners {

	/**
	The focus control event listener
	@type {AllControlsFocusEL}
	*/

	#controlFocus;

	/**
	The input event listener
	@type {AllControlsInputEL}
	*/

	#controlInput;

	/**
	The address buton click event listener
	@type {AddressButtonClickEL}
	*/

	#addressButtonClick;

	/**
	The blur url input event listener
	@type {UrlInputBlurEL}
	*/

	#urlInputBlur;

	/**
	The edition button click event listener
	@type {EditionButtonsClickEL}
	*/

	#editionButtonsClick;

	/**
	The  icon selector change event listener
	@type {IconSelectorChangeEL}
	*/

	#iconSelectorChange;

	/**
	The toggle content button click event listener
	@type {ToggleContentsButtonClickEL}
	*/

	#toggleContentsButtonClick;

	/**
	The open file button click event listener
	@type {OpenFileButtonClickEL}
	*/

	#openFileButtonClick;

	/**
	The constructor
	@param {NoteDialog} noteDialog A reference to the NoteDialog object
	@param {Array.<Number>} noteLatLng The lat and lng of the note
	*/

	constructor ( noteDialog, noteLatLng ) {
		Object.freeze ( this );
		this.#controlFocus = new AllControlsFocusEL ( noteDialog );
		this.#controlInput = new AllControlsInputEL ( noteDialog );
		this.#addressButtonClick = new AddressButtonClickEL ( noteDialog, noteLatLng );
		this.#urlInputBlur = new UrlInputBlurEL ( noteDialog );
		this.#editionButtonsClick = new EditionButtonsClickEL ( noteDialog );
		this.#iconSelectorChange = new IconSelectorChangeEL ( noteDialog );
		this.#toggleContentsButtonClick = new ToggleContentsButtonClickEL ( noteDialog );
		this.#openFileButtonClick = new OpenFileButtonClickEL ( noteDialog );
	}

	/**
	Set all events listeners to nul and then release all references to the dialog
	*/

	destructor ( ) {
		this.#controlFocus = null;
		this.#controlInput = null;
		this.#addressButtonClick = null;
		this.#urlInputBlur = null;
		this.#editionButtonsClick = null;
		this.#iconSelectorChange = null;
		this.#toggleContentsButtonClick = null;
		this.#openFileButtonClick = null;
	}

	/**
	The focus control event listener
	@type {AllControlsFocusEL}
	*/

	get controlFocus ( ) { return this.#controlFocus; }

	/**
	The input event listener
	@type {AllControlsInputEL}
	*/

	get controlInput ( ) { return this.#controlInput; }

	/**
	The address buton click event listener
	@type {AddressButtonClickEL}
	*/

	get addressButtonClick ( ) { return this.#addressButtonClick; }

	/**
	The blur url input event listener
	@type {UrlInputBlurEL}
	*/

	get urlInputBlur ( ) { return this.#urlInputBlur; }

	/**
	The edition button click event listener
	@type {EditionButtonsClickEL}
	*/

	get editionButtonsClick ( ) { return this.#editionButtonsClick; }

	/**
	The  icon selector change event listener
	@type {IconSelectorChangeEL}
	*/

	get iconSelectorChange ( ) { return this.#iconSelectorChange; }

	/**
	The toggle content button click event listener
	@type {ToggleContentsButtonClickEL}
	*/

	get toggleContentsButtonClick ( ) { return this.#toggleContentsButtonClick; }

	/**
	The open file button click event listener
	@type {OpenFileButtonClickEL}
	*/

	get openFileButtonClick ( ) { return this.#openFileButtonClick; }
}

export {
	NoteDialogGeoCoderHelper,
	NoteDialogEventListeners
};

/* --- End of file --------------------------------------------------------------------------------------------------------- */