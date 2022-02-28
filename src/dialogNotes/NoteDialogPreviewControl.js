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
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210914
Tests ...
*/

import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import theNoteHTMLViewsFactory from '../viewsFactories/NoteHTMLViewsFactory.js';
import NoteAndRoute from '../data/NoteAndRoute.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the notePreview control of the NotDialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class NoteDialogPreviewControl {

	/**
	The container for the preview note
	@type {HTMLElement}
	*/

	#previewDiv;

	/**
	A reference to the note displayed in the control
	@type {Note}
	*/

	#previewNote;

	/**
	The constructor
	@param {Note} previewNote A reference to the note displayed in the control
	*/

	constructor ( previewNote ) {

		Object.freeze ( this );

		this.#previewNote = previewNote;

		// HTMLElements creation
		this.#previewDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-NoteDialog-PreviewDiv'
			}
		);
		this.#previewDiv.appendChild (
			theNoteHTMLViewsFactory.getNoteTextAndIconHTML (
				'TravelNotes-NoteDialog-',
				new NoteAndRoute ( this.#previewNote, null )
			)
		);
	}

	/**
	Update the control
	*/

	update ( ) {
		this.#previewDiv.textContent = '';
		this.#previewDiv.appendChild (
			theNoteHTMLViewsFactory.getNoteTextAndIconHTML (
				'TravelNotes-NoteDialog-',
				{ note : this.#previewNote, route : null }
			)
		);
	}

	/**
	An array with the HTML elements of the control
	@type {Array.<HTMLElement>}
	*/

	get HTMLElements ( ) { return [ this.#previewDiv ]; }

}

export default NoteDialogPreviewControl;

/* --- End of file --------------------------------------------------------------------------------------------------------- */