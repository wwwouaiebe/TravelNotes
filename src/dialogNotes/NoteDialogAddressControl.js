/*
Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/

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

/**
@------------------------------------------------------------------------------------------------------------------------------

@file NoteDialogAddressControl.js
@copyright Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/
@license GNU General Public License
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@module dialogNotes
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import theTranslator from '../UILib/Translator.js';

/**
@------------------------------------------------------------------------------------------------------------------------------

@class NoteDialogAddressControl
@classdesc This class is the address control of the NoteDialog
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class NoteDialogAddressControl {

	/**
	HTMLElements
	@type {htmlElement}
	@private
	*/

	#addressHeaderDiv = null;
	#addressInputDiv = null;
	#addressInput = null;
	#addressButton = null;

	/*
	constructor
	@param {NoteDialog} noteDialog A reference to the dialog in witch the control is integrated
	@param {Array.<!number} latLng The lat and lng to use for geocoding
	*/

	constructor ( eventListeners ) {

		Object.freeze ( this );

		// HTMLElements creation
		this.#addressHeaderDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-NoteDialog-DataDiv'
			}
		);

		this.#addressButton = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-Button',
				title : theTranslator.getText ( 'NoteDialog - Reset address' ),
				textContent : '🔄'
			},
			this.#addressHeaderDiv
		);

		theHTMLElementsFactory.create (
			'text',
			{
				value : theTranslator.getText ( 'NoteDialog - Address' )
			},
			this.#addressHeaderDiv
		);

		this.#addressInputDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-NoteDialog-DataDiv'
			}
		);

		this.#addressInput = theHTMLElementsFactory.create (
			'input',
			{
				type : 'text',
				className : 'TravelNotes-NoteDialog-InputText',
				dataset : { Name : 'address' }
			},
			this.#addressInputDiv
		);

		// event listeners
		this.#addressInput.addEventListener ( 'focus', eventListeners.controlFocus );
		this.#addressInput.addEventListener ( 'input', eventListeners.controlInput );
		this.#addressButton.addEventListener ( 'click', eventListeners.addressButtonClick );
	}

	/**
	Remove event listeners
	*/

	destructor ( eventListeners ) {
		this.#addressInput.removeEventListener ( 'focus', eventListeners.controlFocus );
		this.#addressInput.removeEventListener ( 'input', eventListeners.controlInput );
		this.#addressButton.removeEventListener ( 'click', eventListeners.addressButtonClick );
	}

	/**
	An array with the HTML elements of the control
	@type {Array.<HTMLElement>}
	@readonly
	*/

	get HTMLElements ( ) {
		return [ this.#addressHeaderDiv, this.#addressInputDiv ];
	}

	/**
	The address value in the control
	@type {string}
	*/

	get address ( ) { return this.#addressInput.value; }

	set address ( Value ) { this.#addressInput.value = Value; }

}

export default NoteDialogAddressControl;

/*
@------------------------------------------------------------------------------------------------------------------------------

end of NoteDialogAddressControl.js file

@------------------------------------------------------------------------------------------------------------------------------
*/