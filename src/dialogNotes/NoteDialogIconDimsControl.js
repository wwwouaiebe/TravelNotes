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
Doc reviewed 20210914
Tests ...
*/

import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import theTranslator from '../UILib/Translator.js';
import { ICON_DIMENSIONS } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the icnWidth and iconHeight control of the NoteDialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class NoteDialogIconDimsControl {

	/**
	The control container
	@type {HTMLElement}
	*/

	#iconDimsDiv = null;

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
	The constructor
	@param {NoteDialogEventListeners} eventListeners A reference to the eventListeners object of the NoteDialog
	*/

	constructor ( eventListeners ) {

		Object.freeze ( this );

		// HTMLElements creation
		this.#iconDimsDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-NoteDialog-DataDiv'
			}
		);
		theHTMLElementsFactory.create (
			'text',
			{
				value : theTranslator.getText ( 'NoteDialogIconDimsControl - Icon width' )
			},
			this.#iconDimsDiv
		);
		this.#iconWidthInput = theHTMLElementsFactory.create (
			'input',
			{
				type : 'number',
				className : 'TravelNotes-NoteDialog-NumberInput',
				value : ICON_DIMENSIONS.width,
				dataset : { Name : 'iconWidth' }
			},
			this.#iconDimsDiv
		);

		theHTMLElementsFactory.create (
			'text',
			{
				value : theTranslator.getText ( 'NoteDialogIconDimsControl - Icon height' )
			},
			this.#iconDimsDiv
		);
		this.#iconHeightInput = theHTMLElementsFactory.create (
			'input',
			{
				type : 'number',
				className : 'TravelNotes-NoteDialog-NumberInput',
				value : ICON_DIMENSIONS.height,
				dataset : { Name : 'iconHeight' }
			},
			this.#iconDimsDiv
		);

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
	}

	/**
	An array with the HTML elements of the control
	@type {Array.<HTMLElement>}
	*/

	get HTMLElements ( ) { return [ this.#iconDimsDiv ]; }

	/**
	The icon width value in the control
	@type {Number}
	*/

	get iconWidth ( ) { return Number.parseInt ( this.#iconWidthInput.value ); }

	set iconWidth ( Value ) { this.#iconWidthInput.value = Value; }

	/**
	The icon width height in the control
	@type {Number}
	*/

	get iconHeight ( ) { return Number.parseInt ( this.#iconHeightInput.value ); }

	set iconHeight ( Value ) { this.#iconHeightInput.value = Value; }

}

export default NoteDialogIconDimsControl;

/* --- End of file --------------------------------------------------------------------------------------------------------- */