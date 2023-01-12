/*
Copyright - 2017 2023 - wwwouaiebe - Contact: https://www.ouaie.be/

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

import theHTMLElementsFactory from '../../core/uiLib/HTMLElementsFactory.js';
import theTranslator from '../../core/uiLib/Translator.js';
import BaseControl from '../baseControl/BaseControl.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the address control of the NoteDialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class AddressControl extends BaseControl {

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
		const headerControlElement = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-FlexRow'
			},
			this.controlHTMLElement );
		this.#addressButton = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-Button',
				title : theTranslator.getText ( 'AddressControl - Reset address' ),
				textContent : '🔄'
			},
			headerControlElement
		);
		theHTMLElementsFactory.create (
			'text',
			{
				value : theTranslator.getText ( 'AddressControl - Address' )
			},
			headerControlElement
		);
		this.#addressInput = theHTMLElementsFactory.create (
			'input',
			{
				type : 'text',
				className : 'TravelNotes-AdressControl-InputText',
				dataset : { Name : 'address' }
			},
			theHTMLElementsFactory.create (
				'div',
				{
					className : 'TravelNotes-BaseDialog-FlexRow'
				},
				this.controlHTMLElement )
		);

		// event listeners
		if ( eventListeners.controlFocus ) {
			this.#addressInput.addEventListener ( 'focus', eventListeners.controlFocus );
		}
		if ( eventListeners.controlInput ) {
			this.#addressInput.addEventListener ( 'input', eventListeners.controlInput );
		}
		if ( eventListeners.addressButtonClick ) {
			this.#addressButton.addEventListener ( 'click', eventListeners.addressButtonClick );
		}
	}

	/**
	Remove event listeners
	@param {NoteDialogEventListeners} eventListeners A reference to the eventListeners object of the NoteDialog
	*/

	destructor ( eventListeners ) {
		if ( eventListeners.controlFocus ) {
			this.#addressInput.removeEventListener ( 'focus', eventListeners.controlFocus );
		}
		if ( eventListeners.controlInput ) {
			this.#addressInput.removeEventListener ( 'input', eventListeners.controlInput );
		}
		if ( eventListeners.addressButtonClick ) {
			this.#addressButton.removeEventListener ( 'click', eventListeners.addressButtonClick );
		}
	}

	/**
	The address value in the control
	@type {String}
	*/

	get address ( ) { return this.#addressInput.value; }

	set address ( Value ) { this.#addressInput.value = Value; }

}

export default AddressControl;

/* --- End of file --------------------------------------------------------------------------------------------------------- */