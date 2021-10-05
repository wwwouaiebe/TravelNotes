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
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210914
Tests ...
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@file NoteDialogPopupControl.js
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
import theConfig from '../data/Config.js';

/**
@------------------------------------------------------------------------------------------------------------------------------

@class NoteDialogPopupControl
@classdesc This class is the popupContent control of the NoteDialog
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class NoteDialogPopupControl {

	/**
	HTMLElements
	@type {htmlElement}
	@private
	*/

	#popupDiv = null;
	#popupTextArea = null;

	/*
	constructor
	@param {NoteDialog} noteDialog A reference to the dialog in witch the control is integrated
	*/

	constructor ( eventListeners ) {

		Object.freeze ( this );

		// HTMLElements creation
		this.#popupDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-NoteDialog-DataDiv',
				textContent : theTranslator.getText ( 'NoteDialog - Text' )
			}
		);
		this.#popupTextArea = theHTMLElementsFactory.create (
			'textarea',
			{
				className : 'TravelNotes-NoteDialog-TextArea',
				rows : theConfig.noteDialog.areaHeight.popupContent,
				dataset : { Name : 'popupContent' }
			},
			this.#popupDiv
		);

		// event listeners
		this.#popupTextArea.addEventListener ( 'focus', eventListeners.controlFocus );
		this.#popupTextArea.addEventListener ( 'input', eventListeners.controlInput );
	}

	/**
	Remove event listeners
	*/

	destructor ( eventListeners ) {
		this.#popupTextArea.removeEventListener ( 'focus', eventListeners.controlFocus );
		this.#popupTextArea.removeEventListener ( 'input', eventListeners.controlInput );
	}

	/**
	An array with the HTML elements of the control
	@type {Array.<HTMLElement>}
	@readonly
	*/

	get HTMLElements ( ) { return [ this.#popupDiv ]; }

	/**
	The popupcontent value in the control
	@type {string}
	*/

	get popupContent ( ) { return this.#popupTextArea.value; }

	set popupContent ( Value ) { this.#popupTextArea.value = Value; }

}

export default NoteDialogPopupControl;

/*
@------------------------------------------------------------------------------------------------------------------------------

end of NoteDialogPopupControl.js file

@------------------------------------------------------------------------------------------------------------------------------
*/