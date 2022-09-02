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

import theHTMLElementsFactory from '../../../core/uiLib/HTMLElementsFactory.js';
import theTranslator from '../../../core/uiLib/Translator.js';
import BaseControl from '../../../controls/baseControl/BaseControl.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the tooltipContent control of the NoteDialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class NoteDialogTooltipControl extends BaseControl {

	/**
	The tooltip input
	@type {HTMLElement}
	*/

	#tooltipInput;

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
				textContent : theTranslator.getText ( 'NoteDialogTooltipControl - Tooltip content' )
			},
			this.controlHTMLElement
		);
		this.#tooltipInput = theHTMLElementsFactory.create (
			'input',
			{
				type : 'text',
				className : 'TravelNotes-NoteDialog-InputText',
				dataset : { Name : 'tooltipContent' }
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
		this.#tooltipInput.addEventListener ( 'focus', eventListeners.controlFocus );
		this.#tooltipInput.addEventListener ( 'input', eventListeners.controlInput );
	}

	/**
	Remove event listeners
	@param {NoteDialogEventListeners} eventListeners A reference to the eventListeners object of the NoteDialog
	*/

	destructor ( eventListeners ) {
		this.#tooltipInput.removeEventListener ( 'focus', eventListeners.controlFocus );
		this.#tooltipInput.removeEventListener ( 'input', eventListeners.controlInput );
	}

	/**
	the tooltip value in the control
	@type {String}
	*/

	get tooltipContent ( ) { return this.#tooltipInput.value; }

	set tooltipContent ( value ) { this.#tooltipInput.value = value; }

}

export default NoteDialogTooltipControl;

/* --- End of file --------------------------------------------------------------------------------------------------------- */