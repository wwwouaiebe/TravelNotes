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
	- v1.4.0:
		- created
	- v1.6.0:
		- Issue ♯65 : Time to go to ES6 modules?
	- v1.12.0:
		- Issue ♯120 : Review the UserInterface
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210915
Tests ...
*/

import PaneUI from '../UI/PaneUI.js';
import theTranslator from '../UILib/Translator.js';
import theNoteHTMLViewsFactory from '../viewsFactories/NoteHTMLViewsFactory.js';
import theNoteEditor from '../core/NoteEditor.js';
import NoteContextMenu from '../contextMenus/NoteContextMenu.js';
import { PANE_ID } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
dragstart event listener for the travel notes
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TravelNoteDragStartEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} dragEvent The event to handle
	*/

	handleEvent ( dragEvent ) {
		dragEvent.stopPropagation ( );
		try {
			dragEvent.dataTransfer.setData ( 'ObjId', dragEvent.target.dataset.tanObjId );
			dragEvent.dataTransfer.dropEffect = 'move';
		}
		catch ( err ) {
			if ( err instanceof Error ) {
				console.error ( err );
			}
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
dragover event listener for the travel notes
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TravelNoteDragOverEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} dragEvent The event to handle
	*/

	handleEvent ( dragEvent ) {
		dragEvent.preventDefault ( );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
drop event listener for the travel notes
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TravelNoteDropEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} dropEvent The event to handle
	*/

	handleEvent ( dropEvent ) {
		dropEvent.preventDefault ( );
		const element = dropEvent.currentTarget;
		const clientRect = element.getBoundingClientRect ( );

		theNoteEditor.travelNoteDropped (
			Number.parseInt ( dropEvent.dataTransfer.getData ( 'ObjId' ) ),
			Number.parseInt ( element.dataset.tanObjId ),
			dropEvent.clientY - clientRect.top < clientRect.bottom - dropEvent.clientY
		);
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
contextmenu event listener for the travel notes
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TravelNoteContextMenuEL {

	/**
	A reference to the HTMLElement in witch the data have to be added
	@type {HTMLElement}
	*/

	#paneData = null;

	/**
	The constructor
	@param {HTMLElement} paneData A reference to the HTMLElement in witch the data have to be added
	*/

	constructor ( paneData ) {
		Object.freeze ( this );
		this.#paneData = paneData;
	}

	/**
	Event listener method
	@param {Event} contextMenuEvent The event to handle
	*/

	handleEvent ( contextMenuEvent ) {
		contextMenuEvent.stopPropagation ( );
		contextMenuEvent.preventDefault ( );
		new NoteContextMenu ( contextMenuEvent, this.#paneData ).show ( );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class manages the travel notes pane UI

See PanesManagerUI for pane UI management
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TravelNotesPaneUI extends PaneUI {

	/**
	An HTMLElement in witch the notes will be added
	@type {HTMLElement}
	*/

	#travelNotesDiv;

	/**
	dragstart event listener
	@type {TravelNoteDragStartEL}
	*/

	#travelNoteDragStartEL;

	/**
	dragover event listener
	@type {TravelNoteDragOverEL}
	*/

	#travelNoteDragOverEL;

	/**
	drop event listener
	@type {TravelNoteDropEL}
	*/

	#travelNoteDropEL;

	/**
	contextmenu event listener
	@type {TravelNoteContextMenuEL}
	*/

	#travelNoteContextMenuEL;

	/**
	The constructor
	@param {HTMLElement} paneData The HTMLElement in witch the data have to be added
	@param {HTMLElement} paneControl The HTMLElement in witch the control have to be added
	*/

	constructor ( paneData, paneControl ) {

		super ( paneData, paneControl );

		this.#travelNoteDragStartEL = new TravelNoteDragStartEL ( );
		this.#travelNoteDragOverEL = new TravelNoteDragOverEL ( );
		this.#travelNoteDropEL = new TravelNoteDropEL ( );
		this.#travelNoteContextMenuEL = new TravelNoteContextMenuEL ( paneData );
	}

	/**
	This method removes all the elements from the paneData HTMLElement
	Overload of the PaneUI.remove ( ) method
	*/

	remove ( ) {
		if ( this.#travelNotesDiv ) {
			this.#travelNotesDiv.childNodes.forEach (
				childNode => {
					childNode.removeEventListener ( 'contextmenu', this.#travelNoteContextMenuEL, false );
					childNode.removeEventListener ( 'dragstart', this.#travelNoteDragStartEL, false );
					childNode.removeEventListener ( 'drop', this.#travelNoteDropEL, false );
				}
			);
			this.#travelNotesDiv.removeEventListener ( 'dragover', this.#travelNoteDragOverEL, false );
			this.paneData.removeChild ( this.#travelNotesDiv );
		}
		this.#travelNotesDiv = null;
	}

	/**
	This method add the notes to the paneData HTMLElement
	Overload of the PaneUI.add ( ) method
	*/

	add ( ) {
		this.#travelNotesDiv = theNoteHTMLViewsFactory.getTravelNotesHTML ( 'TravelNotes-TravelNotesPaneUI-' );
		this.#travelNotesDiv.addEventListener ( 'dragover', this.#travelNoteDragOverEL, false );
		this.paneData.appendChild ( this.#travelNotesDiv );
		this.#travelNotesDiv.childNodes.forEach (
			childNode => {
				childNode.draggable = true;
				childNode.addEventListener ( 'contextmenu', this.#travelNoteContextMenuEL, false );
				childNode.addEventListener ( 'dragstart', this.#travelNoteDragStartEL, false );
				childNode.addEventListener ( 'drop', this.#travelNoteDropEL, false );
				childNode.classList.add ( 'TravelNotes-UI-MoveCursor' );
			}
		);
	}

	/**
	A unique identifier for the pane
	Overload of the PaneUI.paneId property
	@type {String}
	*/

	get paneId ( ) { return PANE_ID.travelNotesPane; }

	/**
	The text to be displayer in the pane button
	Overload of the PaneUI.buttonText property
	@type {String}
	*/

	get buttonText ( ) { return theTranslator.getText ( 'TravelNotesPaneUI - Travel notes' ); }

}

export default TravelNotesPaneUI;

/* --- End of file --------------------------------------------------------------------------------------------------------- */