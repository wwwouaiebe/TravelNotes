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
		- created
Doc reviewed ...
Tests ...
*/

import DialogControl from '../baseDialog/DialogControl.js';
import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is a generic control with a input element for text
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TextInputControl extends DialogControl {

	/**
	The input HTMLElement
	@type {HTMLElement}
	*/

	#valueInput;

	/**
	The constructor
	@param {String} headerText The text to display in the header control
	@param {?Object} inputEL An input event listener to add to the input element. Can be null
	*/

	constructor ( headerText, inputEL ) {
		super ( );
		theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-FlexRow',
				textContent : headerText
			},
			this.controlHTMLElement
		);
		this.#valueInput = theHTMLElementsFactory.create (
			'input',
			{
				className : 'TravelNotes-BaseDialog-InputText',
				type : 'text'
			},
			theHTMLElementsFactory.create (
				'div',
				{
					className : 'TravelNotes-BaseDialog-FlexRow'
				},
				this.controlHTMLElement
			)
		);
		if ( inputEL ) {
			this.#valueInput.addEventListener ( 'input', inputEL, false );
		}
	}

	/**
	The value in the control
	@type {String}
	*/

	get value ( ) { return this.#valueInput.value; }

	set value ( value ) { this.#valueInput.value = value; }

}

export default TextInputControl;

/* --- End of file --------------------------------------------------------------------------------------------------------- */