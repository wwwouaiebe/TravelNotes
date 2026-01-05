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

import theHTMLElementsFactory from '../../../core/uiLib/HTMLElementsFactory.js';
import theNoteHTMLViewsFactory from '../../../viewsFactories/NoteHTMLViewsFactory.js';
import NoteAndRoute from '../../../data/NoteAndRoute.js';

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

	#previewHTMLElement;

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
		this.#previewHTMLElement = theHTMLElementsFactory.create (
			'div',
			{
				className : 'travelnotes-note-dialog-preview-container'
			}
		);
		this.#previewHTMLElement.appendChild (
			theNoteHTMLViewsFactory.getNoteTextAndIconHTML (
				'travelnotes-note-dialog-',
				new NoteAndRoute ( this.#previewNote, null )
			)
		);
	}

	/**
	Update the control
	*/

	update ( ) {
		this.#previewHTMLElement.textContent = '';
		this.#previewHTMLElement.appendChild (
			theNoteHTMLViewsFactory.getNoteTextAndIconHTML (
				'travelnotes-note-dialog-',
				{ note : this.#previewNote, route : null }
			)
		);
	}

	/**
	An array with the HTML elements of the control
	@type {Array.<HTMLElement>}
	*/

	get HTMLElements ( ) { return [ this.#previewHTMLElement ]; }

}

export default NoteDialogPreviewControl;

/* --- End of file --------------------------------------------------------------------------------------------------------- */