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

import { ZERO } from '../../../main/Constants.js';
import MouseAndTouchBaseEL from '../../../mouseAndTouchEL/MouseAndTouchBaseEL.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
click event listener for the edition buttons
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class EditionButtonsEL extends MouseAndTouchBaseEL {

	/**
	A reference to the NoteDialog object
	@type {NoteDialog}
	*/

	#noteDialog;

	/**
	The constructor
	@param {NoteDialog} noteDialog A reference to the Notedialog object
	*/

	constructor ( noteDialog ) {
		super ( );
		this.#noteDialog = noteDialog;
		this.eventTypes = [ 'click' ];
	}

	/**
	Event listener method
	@param {Event} clickEvent The event to handle
	*/

	handleClickEvent ( clickEvent ) {
		if ( ! this.#noteDialog.focusControl ) {
			return;
		}
		const button = clickEvent.currentTarget;
		let selectionStart = this.#noteDialog.focusControl.selectionStart;
		let selectionEnd = this.#noteDialog.focusControl.selectionEnd;

		this.#noteDialog.focusControl.value =
			this.#noteDialog.focusControl.value.slice ( ZERO, selectionStart ) +
			button.dataset.tanHtmlBefore +
			(
				ZERO === button.dataset.tanHtmlAfter.length
					?
					''
					:
					this.#noteDialog.focusControl.value.slice ( selectionStart, selectionEnd )
			) +
			button.dataset.tanHtmlAfter +
			this.#noteDialog.focusControl.value.slice ( selectionEnd );

		if ( selectionStart === selectionEnd || ZERO === button.dataset.tanHtmlAfter.length ) {
			selectionStart += button.dataset.tanHtmlBefore.length;
			selectionEnd = selectionStart;
		}
		else {
			selectionEnd += button.dataset.tanHtmlBefore.length + button.dataset.tanHtmlAfter.length;
		}
		this.#noteDialog.focusControl.setSelectionRange ( selectionStart, selectionEnd );
		this.#noteDialog.focusControl.focus ( );
		const noteData = {};
		noteData [ this.#noteDialog.focusControl.dataset.tanName ] = this.#noteDialog.focusControl.value;
		this.#noteDialog.updatePreview ( noteData );
	}
}

export default EditionButtonsEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */