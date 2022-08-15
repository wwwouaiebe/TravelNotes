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
Drag start on an list item event listener
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class DragStartItemEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} dragStartEvent The event to handle
	*/

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

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Drop list item event listener
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class DropItemEL {

	/**
	The function to call when an item is droped
	@type {function}
	*/

	#dropFunction;

	/**
	The constructor
	@param {function} dropFunction The function to call when an item is droped
	*/

	constructor ( dropFunction ) {
		Object.freeze ( this );
		this.#dropFunction = dropFunction;
	}

	/**
	Event listener method
	@param {Event} dropEvent The event to handle
	*/

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

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
context menu on a list item event listener
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ContextMenuItemEL {

	/**
	The context menu class to use
	@type {class}
	*/

	#contextMenuClass;

	/**
	The constructor
	@param {class} contextMenuClass The context menu class to use
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

/* ------------------------------------------------------------------------------------------------------------------------- */
/**

*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class SortableListControl extends DialogControl {

	/**
	The item drag start event listener
	@type {DragStartItemEL}
	*/

	#dragStartItemEL;

	/**
	The item drop event listener
	@type {DropItemEL}
	*/

	#dropItemEL;

	/**
	The context menu on item event listener
	@type {ContextMenuItemEL}
	*/

	#contextMenuItemEL;

	#sortableListContainer;

	/**
	The constructor
	@param {function} dropFunction The function to call when an item is droped
	@param {class} contextMenuClass The context menu class to use
	*/

	constructor ( dropFunction, contextMenuClass, headingText ) {
		super ( );
		this.#dragStartItemEL = new DragStartItemEL ( );
		this.#dropItemEL = new DropItemEL ( dropFunction, contextMenuClass );
		this.#contextMenuItemEL = new ContextMenuItemEL ( contextMenuClass );
		if ( headingText ) {
			theHTMLElementsFactory.create (
				'div',
				{
					className : 'TravelNotes-BaseDialog-FlexRow',
					textContent : headingText
				},
				this.HTMLElement
			);
		}
		this.#sortableListContainer = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-SortableList-Container'
			},
			this.HTMLElement
		);
	}

	/**
	Update the items in the control
	@param {array.<HTMLElement>} htmlElements An array with HTMLElements to use as items
	*/

	updateContent ( htmlElements ) {
		while ( this.#sortableListContainer.firstChild ) {
			this.#sortableListContainer.firstChild.removeEventListener ( 'dragstart', this.#dragStartItemEL, false );
			this.#sortableListContainer.firstChild.removeEventListener ( 'drop', this.#dropItemEL, false );
			this.#sortableListContainer.firstChild.removeEventListener ( 'contextmenu', this.#contextMenuItemEL, false );
			this.#sortableListContainer.removeChild ( this.#sortableListContainer.firstChild );
		}
		htmlElements.forEach (
			htmlElement => {
				htmlElement.draggable = true;
				htmlElement.addEventListener ( 'dragstart', this.#dragStartItemEL, false );
				htmlElement.addEventListener ( 'drop', this.#dropItemEL, false );
				htmlElement.addEventListener ( 'contextmenu', this.#contextMenuItemEL, false );
				this.#sortableListContainer.appendChild ( htmlElement );
				htmlElement.classList.add ( 'TravelNotes-SortableList-Item' );
			}
		);
	}
}

export default SortableListControl;

/* --- End of file --------------------------------------------------------------------------------------------------------- */