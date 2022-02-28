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
Doc reviewed 20210901
Tests ...
*/

import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import theTranslator from '../UILib/Translator.js';
import theConfig from '../data/Config.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the iconContent control of the NoteDialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class NoteDialogIconControl {

	/**
	The control container
	@type {HTMLElement}
	*/

	#iconDiv;

	/**
	The icon text area
	@type {HTMLElement}
	*/

	#iconTextArea;

	/**
	The constructor
	@param {NoteDialogEventListeners} eventListeners A reference to the eventListeners object of the NoteDialog
	*/

	constructor ( eventListeners ) {

		Object.freeze ( this );

		// HTMLElements creation
		this.#iconDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-NoteDialog-DataDiv',
				textContent : theTranslator.getText ( 'NoteDialogIconControl - Icon content' )
			}
		);
		this.#iconTextArea = theHTMLElementsFactory.create (
			'textarea',
			{
				className : 'TravelNotes-NoteDialog-TextArea',
				placeholder : '?????',
				rows : theConfig.noteDialog.areaHeight.icon,
				dataset : { Name : 'iconContent' }
			},
			this.#iconDiv
		);

		// event listeners
		this.#iconTextArea.addEventListener ( 'focus', eventListeners.controlFocus );
		this.#iconTextArea.addEventListener ( 'input', eventListeners.controlInput );
	}

	/**
	Remove event listeners
	@param {NoteDialogEventListeners} eventListeners A reference to the eventListeners object of the NoteDialog
	*/

	destructor ( eventListeners ) {
		this.#iconTextArea.removeEventListener ( 'focus', eventListeners.controlFocus );
		this.#iconTextArea.removeEventListener ( 'input', eventListeners.controlInput );
	}

	/**
	An array with the HTML elements of the control
	@type {Array.<HTMLElement>}
	*/

	get HTMLElements ( ) { return [ this.#iconDiv ]; }

	/**
	The icon value in the control
	@type {String}
	*/

	get iconContent ( ) { return this.#iconTextArea.value; }

	set iconContent ( Value ) { this.#iconTextArea.value = Value; }

}

export default NoteDialogIconControl;

/* --- End of file --------------------------------------------------------------------------------------------------------- */