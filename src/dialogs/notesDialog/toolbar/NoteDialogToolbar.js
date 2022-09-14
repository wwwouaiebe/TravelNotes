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

import theNoteDialogToolbarData from './NoteDialogToolbarData.js';
import theHTMLElementsFactory from '../../../core/uiLib/HTMLElementsFactory.js';
import theTranslator from '../../../core/uiLib/Translator.js';
import theHTMLSanitizer from '../../../core/htmlSanitizer/HTMLSanitizer.js';

import { NOT_FOUND } from '../../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the toolbar of the NoteDialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class NoteDialogToolbar {

	/**
	The toolbar container
	@type {HTMLElement}
	*/

	#rootHTMLElement;

	/**
	The icon selector
	@type {HTMLElement}
	*/

	#iconSelect;

	/**
	The open file button
	@type {HTMLElement}
	*/

	#openFileButton;

	/**
	The editions buttons
	@type {Array.<HTMLElement>}
	*/

	#editionButtons;

	/**
	Add the icon selector to the toolbar
	*/

	#addIconsSelector ( ) {
		this.#iconSelect = theHTMLElementsFactory.create (
			'select',
			{
				className : 'TravelNotes-NoteDialog-Select',
				id : 'TravelNotes-NoteDialog-IconSelect'
			},
			this.#rootHTMLElement
		);

		theNoteDialogToolbarData.preDefinedIconsData.forEach (
			selectOption => {
				this.#iconSelect.add ( theHTMLElementsFactory.create ( 'option', { text : selectOption.name } ) );
			}
		);
		this.#iconSelect.selectedIndex = NOT_FOUND;
	}

	/**
	Add the toolbar buttons to the toolbar
	*/

	#addToolbarButtons ( ) {
		this.#openFileButton = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-Button',
				title : theTranslator.getText ( 'NoteDialogToolbar - Open a configuration file' ),
				textContent : '📂'
			},
			this.#rootHTMLElement
		);
	}

	/**
	Add the edition buttons to the toolbar
	*/

	#addEditionButtons ( ) {
		theNoteDialogToolbarData.editionButtonsData.forEach (
			editionButtonData => {
				const newButton = theHTMLElementsFactory.create (
					'div',
					{
						dataset : {
							HtmlBefore : editionButtonData.htmlBefore,
							HtmlAfter : editionButtonData.htmlAfter
						},
						className : 'TravelNotes-NoteDialog-EditorButton'
					},
					this.#rootHTMLElement
				);
				theHTMLSanitizer.sanitizeToHtmlElement ( editionButtonData.title, newButton );
				this.#editionButtons.push ( newButton );
			}
		);
	}

	/**
	Add elements to the toolbar
	*/

	#addToolbarElements ( ) {

		this.#addIconsSelector ( );
		this.#addToolbarButtons ( );
		this.#addEditionButtons ( );
	}

	/**
	Add the events listeners to the toolbar objects
	@param {NoteDialogEventListeners} eventListeners A reference to the eventListeners object of the NoteDialog
	*/

	#addEventListeners ( eventListeners ) {
		eventListeners.iconSelectorEL.addEventListeners ( this.#iconSelect );
		this.#editionButtons.forEach (
			button => { eventListeners.editionButtonsEL.addEventListeners ( button ); }
		);
		eventListeners.openCfgFileButtonEL.addEventListeners ( this.#openFileButton );
	}

	/**
	Remove event listeners on all htmlElements
	@param {NoteDialogEventListeners} eventListeners A reference to the eventListeners object of the NoteDialog
	*/

	#removeEventListeners ( eventListeners ) {
		eventListeners.iconSelectorEL.addEventListeners ( this.#iconSelect );
		this.#editionButtons.forEach (
			button => { eventListeners.editionButtonsEL.addEventListeners ( button ); }
		);
		eventListeners.openCfgFileButtonEL.removeEventListeners ( this.#openFileButton );
	}

	/**
	The constructor
	@param {NoteDialogEventListeners} eventListeners A reference to the eventListeners object of the NoteDialog
	*/

	constructor ( eventListeners ) {

		Object.freeze ( this );

		this.#editionButtons = [];

		this.#rootHTMLElement = theHTMLElementsFactory.create (
			'div',
			{
				id : 'TravelNotes-NoteDialog-ToolbarDiv'
			}
		);

		this.#addToolbarElements ( );
		this.#addEventListeners ( eventListeners );
	}

	/**
	Destructor. Remove event listeners.
	@param {NoteDialogEventListeners} eventListeners A reference to the eventListeners object of the NoteDialog
	*/

	destructor ( eventListeners ) {
		this.#removeEventListeners ( eventListeners );
	}

	/**
	Refresh the toolbar - needed after a file upload.
	@param {NoteDialogEventListeners} eventListeners A reference to the eventListeners object of the NoteDialog
	*/

	update ( eventListeners ) {
		this.#removeEventListeners ( eventListeners );
		this.#rootHTMLElement.textContent = '';
		this.#editionButtons = [];
		this.#addToolbarElements ( );
		this.#addEventListeners ( eventListeners );
	}

	/**
	The rootHTMLElement of the toolbar
	@type {HTMLElement}
	*/

	get rootHTMLElement ( ) { return this.#rootHTMLElement;	}

}

export default NoteDialogToolbar;

/* --- End of file --------------------------------------------------------------------------------------------------------- */