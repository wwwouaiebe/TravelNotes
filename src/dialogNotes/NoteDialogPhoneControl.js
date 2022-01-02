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

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the phone control of the NoteDialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class NoteDialogPhoneControl {

	/**
	The header container
	@type {HTMLElement}
	*/

	#phoneHeaderDiv;

	/**
	The input container
	@type {HTMLElement}
	*/

	#phoneInputDiv;

	/**
	The phone input
	@type {HTMLElement}
	*/

	#phoneInput;

	/**
	The constructor
	@param {NoteDialogEventListeners} eventListeners A reference to the eventListeners object of the NoteDialog
	*/

	constructor ( eventListeners ) {

		Object.freeze ( this );

		// HTMLElements creation
		this.#phoneHeaderDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-NoteDialog-DataDiv'
			}
		);

		theHTMLElementsFactory.create (
			'text',
			{
				value : '\u00a0' + theTranslator.getText ( 'NoteDialogPhoneControl - Phone' )
			},
			this.#phoneHeaderDiv
		);

		this.#phoneInputDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-NoteDialog-DataDiv'
			}
		);

		this.#phoneInput = theHTMLElementsFactory.create (
			'input',
			{
				type : 'text',
				className : 'TravelNotes-NoteDialog-InputText',
				dataset : { Name : 'phone' }
			},
			this.#phoneInputDiv
		);

		// event listeners
		this.#phoneInput.addEventListener ( 'focus', eventListeners.controlFocus );
		this.#phoneInput.addEventListener ( 'input', eventListeners.controlInput );
	}

	/**
	Remove event listeners
	@param {NoteDialogEventListeners} eventListeners A reference to the eventListeners object of the NoteDialog
	*/

	destructor ( eventListeners ) {
		this.#phoneInput.removeEventListener ( 'focus', eventListeners.controlFocus );
		this.#phoneInput.removeEventListener ( 'input', eventListeners.controlInput );
	}

	/**
	An array with the HTMLElements of the control
	@type {Array.<HTMLElement>}
	*/

	get HTMLElements ( ) { return [ this.#phoneHeaderDiv, this.#phoneInputDiv ]; }

	/**
	The phone number in the control
	@type {String}
	*/

	get phone ( ) { return this.#phoneInput.value; }

	set phone ( Value ) { this.#phoneInput.value = Value; }

}

export default NoteDialogPhoneControl;

/* --- End of file --------------------------------------------------------------------------------------------------------- */