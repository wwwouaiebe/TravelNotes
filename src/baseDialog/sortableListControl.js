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
import {
	TouchItemEL,
	DragStartItemEL,
	DropItemEL,
	ContextMenuItemEL
} from '../baseDialog/SortableListControlEL.js';

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

	/**
	The touch item event listener
	@type {TouchItemEL}
	*/

	#touchItemEL;

	/**
	The container for the list
	@type {HTMLElement}
	*/

	#sortableListContainer;

	/**
	The constructor
	@param {function} dropFunction The function to call when an item is droped
	@param {class} contextMenuClass The context menu class to use
	@param {String} headingText The text to add in the header
	*/

	constructor ( dropFunction, contextMenuClass, headingText ) {
		super ( );
		this.#dragStartItemEL = new DragStartItemEL ( );
		this.#dropItemEL = new DropItemEL ( dropFunction );
		this.#contextMenuItemEL = new ContextMenuItemEL ( contextMenuClass );
		this.#touchItemEL = new TouchItemEL ( dropFunction );
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
			this.#sortableListContainer.firstChild.removeEventListener ( 'touchstart', this.#touchItemEL, false );
			this.#sortableListContainer.firstChild.removeEventListener ( 'touchmove', this.#touchItemEL, false );
			this.#sortableListContainer.firstChild.removeEventListener ( 'touchend', this.#touchItemEL, false );
			this.#sortableListContainer.removeChild ( this.#sortableListContainer.firstChild );
		}
		htmlElements.forEach (
			htmlElement => {
				htmlElement.draggable = true;
				htmlElement.addEventListener ( 'dragstart', this.#dragStartItemEL, false );
				htmlElement.addEventListener ( 'drop', this.#dropItemEL, false );
				htmlElement.addEventListener ( 'contextmenu', this.#contextMenuItemEL, false );
				htmlElement.addEventListener ( 'touchstart', this.#touchItemEL, false );
				htmlElement.addEventListener ( 'touchmove', this.#touchItemEL, false );
				htmlElement.addEventListener ( 'touchend', this.#touchItemEL, false );
				this.#sortableListContainer.appendChild ( htmlElement );
				htmlElement.classList.add ( 'TravelNotes-SortableList-Item' );
			}
		);
	}
}

export default SortableListControl;

/* --- End of file --------------------------------------------------------------------------------------------------------- */