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

import DockableBaseDialog from '../baseDialog/DockableBaseDialog.js';
import theTranslator from '../UILib/Translator.js';
import theNoteHTMLViewsFactory from '../viewsFactories/NoteHTMLViewsFactory.js';
import SortableListControl from '../sortableListControl/SortableListControl.js';
import NoteContextMenu from '../contextMenus/NoteContextMenu.js';
import theConfig from '../data/Config.js';
import theNoteEditor from '../core/NoteEditor.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the TravelNotesDialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TravelNotesDialog extends DockableBaseDialog {

	/**
	The notes control
	@type {SortableListControl}
	*/

	#travelNotesControl;

	/**
	The constructor
	*/

	constructor ( ) {
		super ( theConfig.travelNotesDialog.dialogX, theConfig.travelNotesDialog.dialogY );
		this.#travelNotesControl = new SortableListControl (
			theNoteEditor.travelNoteDropped,
			NoteContextMenu
		);
	}

	/**
	An array with the HTMLElements that have to be added in the content of the dialog.
	Overload of the BaseDialog contentHTMLElements property.
	@type {Array.<HTMLElement>}
	*/

	get contentHTMLElements ( ) {
		return [ ].concat (
			this.#travelNotesControl.controlHTMLElement
		);
	}

	/**
	The dialog title. Overload of the BaseDialog.title property
	@type {String}
	*/

	get title ( ) { return theTranslator.getText ( 'TravelNotesDialog - Travel notes dialog' ); }

	/**
	Update the content of the dialog
	*/

	updateContent ( ) {
		let travelNotesDiv = theNoteHTMLViewsFactory.getTravelNotesHTML ( 'TravelNotes-TravelNotesDialog-' );

		// !!! Using travelNotesDiv.childNodes without Array.from gives strange results.
		this.#travelNotesControl.updateContent ( Array.from ( travelNotesDiv.childNodes ) );
	}

}

export default TravelNotesDialog;

/* --- End of file --------------------------------------------------------------------------------------------------------- */