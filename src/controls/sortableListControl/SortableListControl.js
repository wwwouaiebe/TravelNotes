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

import BaseControl from '../baseControl/BaseControl.js';
import theHTMLElementsFactory from '../../core/uiLib/HTMLElementsFactory.js';
import TouchListItemEL from './TouchListItemEL.js';
import DragStartListItemEL from './DragStartListItemEL.js';
import DropListItemEL from './DropListItemEL.js';
import ContextMenuListItemEL from './ContextMenuListItemEL.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A control for dialogs with a list that can be sorted with drag and drop
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class SortableListControl extends BaseControl {

	/**
	The item drag start event listener
	@type {DragStartListItemEL}
	*/

	#dragStartListItemEL;

	/**
	The item drop event listener
	@type {DropListItemEL}
	*/

	#dropListItemEL;

	/**
	The context menu on item event listener
	@type {ContextMenuListItemEL}
	*/

	#contextMenuListItemEL;

	/**
	The touch item event listener
	@type {TouchListItemEL}
	*/

	#touchListItemEL;

	/**
	The HTMLElement container for the list
	@type {HTMLElement}
	*/

	#sortableListHTMLElement;

	/**
	The constructor
	@param {function} dropFunction The function to call when an item is droped
	@param {class} contextMenuClass The context menu class to use
	@param {String} headingText The text to add in the header
	*/

	constructor ( dropFunction, contextMenuClass, headingText ) {
		super ( );
		this.#dragStartListItemEL = new DragStartListItemEL ( );
		this.#dropListItemEL = new DropListItemEL ( dropFunction );
		this.#contextMenuListItemEL = new ContextMenuListItemEL ( contextMenuClass );
		this.#touchListItemEL = new TouchListItemEL ( dropFunction );
		if ( headingText ) {
			theHTMLElementsFactory.create (
				'div',
				{
					className : 'TravelNotes-BaseDialog-FlexRow',
					textContent : headingText
				},
				this.controlHTMLElement
			);
		}
		this.#sortableListHTMLElement = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-SortableList-ListHTMLElement'
			},
			this.controlHTMLElement
		);
	}

	/**
	Update the items in the control
	@param {array.<HTMLElement>} listItemsHTMLElements An array with HTMLElements to use as items
	*/

	updateContent ( listItemsHTMLElements ) {
		while ( this.#sortableListHTMLElement.firstChild ) {
			this.#sortableListHTMLElement.firstChild.removeEventListener ( 'dragstart', this.#dragStartListItemEL, false );
			this.#sortableListHTMLElement.firstChild.removeEventListener ( 'drop', this.#dropListItemEL, false );
			this.#sortableListHTMLElement.firstChild.removeEventListener ( 'contextmenu', this.#contextMenuListItemEL, false );
			this.#sortableListHTMLElement.firstChild.removeEventListener ( 'touchstart', this.#touchListItemEL, false );
			this.#sortableListHTMLElement.firstChild.removeEventListener ( 'touchmove', this.#touchListItemEL, false );
			this.#sortableListHTMLElement.firstChild.removeEventListener ( 'touchend', this.#touchListItemEL, false );
			this.#sortableListHTMLElement.removeChild ( this.#sortableListHTMLElement.firstChild );
		}
		listItemsHTMLElements.forEach (
			listItemHTMLElement => {
				listItemHTMLElement.draggable = true;
				listItemHTMLElement.addEventListener ( 'dragstart', this.#dragStartListItemEL, false );
				listItemHTMLElement.addEventListener ( 'drop', this.#dropListItemEL, false );
				listItemHTMLElement.addEventListener ( 'contextmenu', this.#contextMenuListItemEL, false );
				listItemHTMLElement.addEventListener ( 'touchstart', this.#touchListItemEL, false );
				listItemHTMLElement.addEventListener ( 'touchmove', this.#touchListItemEL, false );
				listItemHTMLElement.addEventListener ( 'touchend', this.#touchListItemEL, false );
				this.#sortableListHTMLElement.appendChild ( listItemHTMLElement );
				listItemHTMLElement.classList.add ( 'TravelNotes-SortableList-ListItemHTMLElement' );
			}
		);
	}
}

export default SortableListControl;

/* --- End of file --------------------------------------------------------------------------------------------------------- */