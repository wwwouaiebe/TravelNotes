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

import theHTMLElementsFactory from '../../../UILib/HTMLElementsFactory.js';
import theTranslator from '../../../UILib/Translator.js';
import theConfig from '../../../data/Config.js';
import BaseControl from '../../../controls/baseControl/BaseControl.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the iconContent control of the NoteDialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class NoteDialogIconControl extends BaseControl {

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

		super ( );

		// HTMLElements creation
		theHTMLElementsFactory.create (
			'div',
			{
				textContent : theTranslator.getText ( 'NoteDialogIconControl - Icon content' ),
				className : 'TravelNotes-BaseDialog-FlexRow'
			},
			this.controlHTMLElement
		);
		this.#iconTextArea = theHTMLElementsFactory.create (
			'textarea',
			{
				className : 'TravelNotes-NoteDialog-TextArea',
				placeholder : '?????',
				rows : theConfig.noteDialog.areaHeight.icon,
				dataset : { Name : 'iconContent' }
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
	The icon value in the control
	@type {String}
	*/

	get iconContent ( ) { return this.#iconTextArea.value; }

	set iconContent ( Value ) { this.#iconTextArea.value = Value; }

}

export default NoteDialogIconControl;

/* --- End of file --------------------------------------------------------------------------------------------------------- */