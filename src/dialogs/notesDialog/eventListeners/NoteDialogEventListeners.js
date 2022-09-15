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

import AllControlsFocusEL from './AllControlsFocusEL.js';
import AllControlsInputEL from './AllControlsInputEL.js';
import AddressButtonClickEL from '../../../controls/addressControl/AddressButtonClickEL.js';
import UrlInputBlurEL from './UrlInputBlurEL.js';
import EditionButtonsClickEL from './EditionButtonsClickEL.js';
import IconSelectorChangeEL from './IconSelectorChangeEL.js';
import OpenCfgFileButtonClickEL from './OpenCfgFileButtonClickEL.js';

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
	The open file button click event listener
	@type {OpenCfgFileButtonClickEL}
	*/

	#openCfgFileButtonClick;

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
		this.#openCfgFileButtonClick = new OpenCfgFileButtonClickEL ( noteDialog );
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
		this.#openCfgFileButtonClick = null;
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
	The open file button click event listener
	@type {OpenCfgFileButtonClickEL}
	*/

	get openCfgFileButtonClick ( ) { return this.#openCfgFileButtonClick; }
}

export default NoteDialogEventListeners;

/* --- End of file --------------------------------------------------------------------------------------------------------- */