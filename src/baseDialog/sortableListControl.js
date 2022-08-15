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

class DragStartEL {

	constructor ( ) {
		Object.freeze ( this );
	}

	handleEvent ( dragStartEvent ) {
		dragStartEvent.stopPropagation ( );
		try {
			dragStartEvent.dataTransfer.setData ( 'ObjId', dragStartEvent.target.dataset.tanObjId );
			dragStartEvent.dataTransfer.dropEffect = 'move';
		}
		catch ( err ) {
			if ( err instanceof Error ) {
				console.error ( err );
			}
		}
	}
}

class DropEL {

	#dropFunction;

	constructor ( dropFunction ) {
		Object.freeze ( this );
		this.#dropFunction = dropFunction;
	}

	handleEvent ( dropEvent ) {
		dropEvent.preventDefault ( );
		const clientRect = dropEvent.target.getBoundingClientRect ( );
		this.#dropFunction (
			Number.parseInt ( dropEvent.dataTransfer.getData ( 'ObjId' ) ),
			Number.parseInt ( dropEvent.target.dataset.tanObjId ),
			( dropEvent.clientY - clientRect.top < clientRect.bottom - dropEvent.clientY )
		);
	}
}

class ContextMenuEL {

	#contextMenuClass;

	/**
	The constructor
	*/

	constructor ( contextMenuClass ) {
		Object.freeze ( this );
		this.#contextMenuClass = contextMenuClass;
	}

	/**
	Event listener method
	@param {Event} contextMenuEvent The event to handle
	*/

	handleEvent ( contextMenuEvent ) {
		contextMenuEvent.stopPropagation ( );
		contextMenuEvent.preventDefault ( );
		new ( this.#contextMenuClass ) ( contextMenuEvent, contextMenuEvent.target.parentNode ).show ( );
	}
}

class SortableListControl extends DialogControl {

	#dragStartEL;

	#dropEL;

	#contextMenuEL;

	constructor ( dropFunction, contextMenuClass ) {
		super ( );
		this.#dragStartEL = new DragStartEL ( );
		this.#dropEL = new DropEL ( dropFunction, contextMenuClass );
		this.#contextMenuEL = new ContextMenuEL ( contextMenuClass );
	}

	updateContent ( htmlElements ) {
		while ( this.HTMLElement.firstChild ) {
			this.HTMLElement.firstChild.removeEventListener ( 'dragstart', this.#dragStartEL, false );
			this.HTMLElement.firstChild.removeEventListener ( 'drop', this.#dropEL, false );
			this.HTMLElement.firstChild.removeEventListener ( 'contextmenu', this.#contextMenuEL, false );
			this.HTMLElement.removeChild ( this.HTMLElement.firstChild );
		}
		htmlElements.forEach (
			htmlElement => {
				htmlElement.draggable = true;
				htmlElement.addEventListener ( 'dragstart', this.#dragStartEL, false );
				htmlElement.addEventListener ( 'drop', this.#dropEL, false );
				htmlElement.addEventListener ( 'contextmenu', this.#contextMenuEL, false );
				this.HTMLElement.appendChild ( htmlElement );
			}
		);
	}
}

export default SortableListControl;

/* --- End of file --------------------------------------------------------------------------------------------------------- */