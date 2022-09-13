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

import theHTMLElementsFactory from '../../../core/uiLib/HTMLElementsFactory.js';
import theTranslator from '../../../core/uiLib/Translator.js';
import { ICON_DIMENSIONS } from '../../../main/Constants.js';
import BaseControl from '../../../controls/baseControl/BaseControl.js';
import TouchInputEL from '../../../mouseAndTouchEL/TouchInputEL.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the icnWidth and iconHeight control of the NoteDialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class NoteDialogIconDimsControl extends BaseControl {

	/**
	The width input
	@type {HTMLElement}
	*/

	#iconWidthInput = null;

	/**
	The height input
	@type {HTMLElement}
	*/

	#iconHeightInput = null;

	/**
	The width and height input touch event listener
	@type {TouchInputEL}
	*/

	#touchInputEL;

	/**
	The constructor
	@param {NoteDialogEventListeners} eventListeners A reference to the eventListeners object of the NoteDialog
	*/

	constructor ( eventListeners ) {

		super ( );
		this.#touchInputEL = new TouchInputEL;

		// HTMLElements creation
		theHTMLElementsFactory.create (
			'text',
			{
				value : theTranslator.getText ( 'NoteDialogIconDimsControl - Icon width' )
			},
			this.controlHTMLElement
		);
		this.#iconWidthInput = theHTMLElementsFactory.create (
			'input',
			{
				type : 'number',
				className : 'TravelNotes-NoteDialog-NumberInput',
				value : ICON_DIMENSIONS.width,
				dataset : { Name : 'iconWidth' }
			},
			this.controlHTMLElement
		);
		this.#touchInputEL.addEventListeners ( this.#iconWidthInput );
		theHTMLElementsFactory.create (
			'text',
			{
				value : theTranslator.getText ( 'NoteDialogIconDimsControl - Icon height' )
			},
			this.controlHTMLElement
		);
		this.#iconHeightInput = theHTMLElementsFactory.create (
			'input',
			{
				type : 'number',
				className : 'TravelNotes-NoteDialog-NumberInput',
				value : ICON_DIMENSIONS.height,
				dataset : { Name : 'iconHeight' }
			},
			this.controlHTMLElement
		);
		this.#touchInputEL.addEventListeners ( this.#iconHeightInput );

		// event listeners
		this.#iconWidthInput.addEventListener ( 'input', eventListeners.controlInput );
		this.#iconHeightInput.addEventListener ( 'input', eventListeners.controlInput );
	}

	/**
	Remove event listeners
	@param {NoteDialogEventListeners} eventListeners A reference to the eventListeners object of the NoteDialog
	*/

	destructor ( eventListeners ) {
		this.#iconWidthInput.removeEventListener ( 'input', eventListeners.controlInput );
		this.#iconHeightInput.removeEventListener ( 'input', eventListeners.controlInput );
		this.#touchInputEL.removeEventListeners ( this.#iconWidthInput );
		this.#touchInputEL.removeEventListeners ( this.#iconHeightInput );
		this.#touchInputEL = null;
	}

	/**
	The icon width value in the control
	@type {Number}
	*/

	get iconWidth ( ) { return Number.parseInt ( this.#iconWidthInput.value ); }

	set iconWidth ( value ) { this.#iconWidthInput.value = value; }

	/**
	The icon width height in the control
	@type {Number}
	*/

	get iconHeight ( ) { return Number.parseInt ( this.#iconHeightInput.value ); }

	set iconHeight ( value ) { this.#iconHeightInput.value = value; }

}

export default NoteDialogIconDimsControl;

/* --- End of file --------------------------------------------------------------------------------------------------------- */