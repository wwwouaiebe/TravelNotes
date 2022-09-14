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
import UrlInputBlurEL from './UrlInputBlurEL.js';
import EditionButtonsEL from './EditionButtonsEL.js';
import IconSelectorEL from './IconSelectorEL.js';
import OpenCfgFileButtonEL from './OpenCfgFileButtonEL.js';

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
	The blur url input event listener
	@type {UrlInputBlurEL}
	*/

	#urlInputBlur;

	/**
	The edition button event listener
	@type {EditionButtonsEL}
	*/

	#editionButtonsEL;

	/**
	The  icon selector change event listener
	@type {IconSelectorEL}
	*/

	#iconSelectorEL;

	/**
	The open file button click event listener
	@type {OpenCfgFileButtonEL}
	*/

	#openCfgFileButtonEL;

	/**
	The constructor
	@param {NoteDialog} noteDialog A reference to the NoteDialog object
	*/

	constructor ( noteDialog ) {
		Object.freeze ( this );
		this.#controlFocus = new AllControlsFocusEL ( noteDialog );
		this.#controlInput = new AllControlsInputEL ( noteDialog );
		this.#urlInputBlur = new UrlInputBlurEL ( noteDialog );
		this.#editionButtonsEL = new EditionButtonsEL ( noteDialog );
		this.#iconSelectorEL = new IconSelectorEL ( noteDialog );
		this.#openCfgFileButtonEL = new OpenCfgFileButtonEL ( noteDialog );
	}

	/**
	Set all events listeners to nul and then release all references to the dialog
	*/

	destructor ( ) {
		this.#controlFocus = null;
		this.#controlInput = null;
		this.#urlInputBlur = null;
		this.#editionButtonsEL = null;
		this.#iconSelectorEL = null;
		this.#openCfgFileButtonEL = null;
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
	The blur url input event listener
	@type {UrlInputBlurEL}
	*/

	get urlInputBlur ( ) { return this.#urlInputBlur; }

	/**
	The edition button click event listener
	@type {EditionButtonsEL}
	*/

	get editionButtonsEL ( ) { return this.#editionButtonsEL; }

	/**
	The  icon selector change event listener
	@type {IconSelectorEL}
	*/

	get iconSelectorEL ( ) { return this.#iconSelectorEL; }

	/**
	The open file button click event listener
	@type {OpenCfgFileButtonEL}
	*/

	get openCfgFileButtonEL ( ) { return this.#openCfgFileButtonEL; }
}

export default NoteDialogEventListeners;

/* --- End of file --------------------------------------------------------------------------------------------------------- */