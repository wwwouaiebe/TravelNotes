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

import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import theTranslator from '../UILib/Translator.js';
import DialogControl from '../baseDialog/DialogControl.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the address control of the NoteDialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class NoteDialogAddressControl extends DialogControl {

	/**
	The address input
	@type {HTMLElement}
	*/

	#addressInput;

	/**
	The reset address buton
	@type {HTMLElement}
	*/

	#addressButton;

	/**
	The constructor
	@param {NoteDialogEventListeners} eventListeners A reference to the eventListeners object of the NoteDialog
	*/

	constructor ( eventListeners ) {

		super ( );

		// HTMLElements creation
		const addressHeaderDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-FlexRow'
			},
			this.HTMLElement );
		this.#addressButton = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-Button',
				title : theTranslator.getText ( 'NoteDialogAddressControl - Reset address' ),
				textContent : '🔄'
			},
			addressHeaderDiv
		);
		theHTMLElementsFactory.create (
			'text',
			{
				value : theTranslator.getText ( 'NoteDialogAddressControl - Address' )
			},
			addressHeaderDiv
		);
		this.#addressInput = theHTMLElementsFactory.create (
			'input',
			{
				type : 'text',
				className : 'TravelNotes-NoteDialog-InputText',
				dataset : { Name : 'address' }
			},
			theHTMLElementsFactory.create (
				'div',
				{
					className : 'TravelNotes-BaseDialog-FlexRow'
				},
				this.HTMLElement )
		);

		// event listeners
		this.#addressInput.addEventListener ( 'focus', eventListeners.controlFocus );
		this.#addressInput.addEventListener ( 'input', eventListeners.controlInput );
		this.#addressButton.addEventListener ( 'click', eventListeners.addressButtonClick );
	}

	/**
	Remove event listeners
	@param {NoteDialogEventListeners} eventListeners A reference to the eventListeners object of the NoteDialog
	*/

	destructor ( eventListeners ) {
		this.#addressInput.removeEventListener ( 'focus', eventListeners.controlFocus );
		this.#addressInput.removeEventListener ( 'input', eventListeners.controlInput );
		this.#addressButton.removeEventListener ( 'click', eventListeners.addressButtonClick );
	}

	/**
	The address value in the control
	@type {String}
	*/

	get address ( ) { return this.#addressInput.value; }

	set address ( Value ) { this.#addressInput.value = Value; }

}

export default NoteDialogAddressControl;

/* --- End of file --------------------------------------------------------------------------------------------------------- */