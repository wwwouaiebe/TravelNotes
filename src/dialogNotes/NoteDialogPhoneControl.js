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
	- v 4.0.0:
		- Issue ♯48 : Review the dialogs
Doc reviewed 20210914
Tests ...
*/

import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import theTranslator from '../UILib/Translator.js';
import DialogControl from '../baseDialog/DialogControl.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the phone control of the NoteDialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class NoteDialogPhoneControl extends DialogControl {

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

		super ( );

		// HTMLElements creation
		theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-FlexRow',
				textContent : theTranslator.getText ( 'NoteDialogPhoneControl - Phone' )
			},
			this.HTMLElement
		);
		this.#phoneInput = theHTMLElementsFactory.create (
			'input',
			{
				type : 'text',
				className : 'TravelNotes-NoteDialog-InputText',
				dataset : { Name : 'phone' }
			},
			theHTMLElementsFactory.create (
				'div',
				{
					className : 'TravelNotes-BaseDialog-FlexRow'
				},
				this.HTMLElement
			)
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
	The phone number in the control
	@type {String}
	*/

	get phone ( ) { return this.#phoneInput.value; }

	set phone ( Value ) { this.#phoneInput.value = Value; }

}

export default NoteDialogPhoneControl;

/* --- End of file --------------------------------------------------------------------------------------------------------- */