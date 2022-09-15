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

import theHTMLElementsFactory from '../../core/uiLib/HTMLElementsFactory.js';
import BaseControl from '../baseControl/BaseControl.js';
import { TWO } from '../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is a generic control with a header text and a text area
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TextAreaControl extends BaseControl {

	/**
	The text area
	@type {HTMLElement}
	*/

	#textArea;

	/**
	The constructor
	@param {Object} options An object with the  options ( placeholder, rows, datasetName, headerText )
	@param {Object} eventListeners A reference to the eventListeners object of the dialog
	*/

	constructor ( options, eventListeners ) {

		super ( );

		// HTMLElements creation
		theHTMLElementsFactory.create (
			'div',
			{
				textContent : options?.headerText || '',
				className : 'TravelNotes-BaseDialog-FlexRow'
			},
			this.controlHTMLElement
		);
		this.#textArea = theHTMLElementsFactory.create (
			'textarea',
			{
				className : 'TravelNotes-TextAreaControl-TextArea',
				placeholder : options?.placeholder || '',
				rows : options.rows || TWO,
				dataset : { Name : options?.datasetName || 'TextAreaControl' }
			},
			theHTMLElementsFactory.create (
				'div',
				{
					className : 'TravelNotes-BaseDialog-FlexRow'
				},
				this.controlHTMLElement
			)
		);

		// event listeners
		if ( eventListeners.controlFocus ) {
			this.#textArea.addEventListener ( 'focus', eventListeners.controlFocus );
		}
		if ( eventListeners.controlInput ) {
			this.#textArea.addEventListener ( 'input', eventListeners.controlInput );
		}
	}

	/**
	Remove event listeners
	@param {NoteDialogEventListeners} eventListeners A reference to the eventListeners object of the dialog
	*/

	destructor ( eventListeners ) {
		if ( eventListeners.controlFocus ) {
			this.#textArea.removeEventListener ( 'focus', eventListeners.controlFocus );
		}
		if ( eventListeners.controlInput ) {
			this.#textArea.removeEventListener ( 'input', eventListeners.controlInput );
		}
	}

	/**
	The icon value in the control
	@type {String}
	*/

	get value ( ) { return this.#textArea.value; }

	set value ( value ) { this.#textArea.value = value; }

}

export default TextAreaControl;

/* --- End of file --------------------------------------------------------------------------------------------------------- */