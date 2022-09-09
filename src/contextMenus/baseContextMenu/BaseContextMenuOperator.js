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

import theConfig from '../../data/Config.js';
import ContextMenuKeyboardKeydownEL from './ContextMenuKeyboardKeydownEL.js';
import ContextMenuCancelButtonEL from './ContextMenuCancelButtonEL.js';
import MenuItemEL from './MenuItemEL.js';
import ContextMenuEL from './ContextMenuEL.js';

import { NOT_FOUND, ZERO, ONE } from '../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class perform all the needed operations for context menus
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class BaseContextMenuOperator {

	/**
	Enum for Item changes from the keyboard
	@type {Object}
	*/

	static #keyboardItemChange = Object.freeze (
		{
			// eslint-disable-next-line no-magic-numbers
			get previousItem ( ) { return -1; },

			// eslint-disable-next-line no-magic-numbers
			get firstItem ( ) { return 0; },

			// eslint-disable-next-line no-magic-numbers
			get nextItem ( ) { return 1; },

			// eslint-disable-next-line no-magic-numbers
			get lastItem ( ) { return 2; }
		}
	);

	/**
	A reference to the context menu
	@type {BaseContextMenu}
	*/

	#contextMenu = null;

	/**
	Keyboard keydown event listener
	@type {ContextMenuKeyboardKeydownEL}
	*/

	#contextMenuKeyboardKeydownEL;

	/**
	context menu event listeners
	@type {ContextMenuEL}
	*/

	#contextMenuEL;

	/**
	Cancel button event listener
	@type {ContextMenuCancelButtonEL}
	*/

	#contextMenuCancelButtonEL;

	/**
	Menu item event listener
	@type {MenuItemEL}
	*/

	#menuItemEL;

	/**
	The index of the selected by the keyboard menuItem
	@type {Number}
	*/

	#keyboardSelectedItemObjId = NOT_FOUND;

	/**
	TimerId for the mouseleave context menu action
	@type {Number}
	*/

	#timerId = null;

	/**
	Remove the css class on all items
	*/

	#unselectItems ( ) {
		this.#contextMenu.menuItemHTMLElements.forEach (
			menuitemHTMLElement => { menuitemHTMLElement.classList.remove ( 'TravelNotes-ContextMenu-MenuItemSelected' ); }
		);
	}

	/**
	Selected item change by the keyboard
	@param {Number} changeValue A value indicating witch menuItem have to be selected
	See BaseContextMenuOperator.#keyboardItemChange
	*/

	#changeKeyboardSelectedItemObjId ( changeValue ) {

		this.#unselectItems ( );

		// change the selected item
		switch ( changeValue ) {
		case BaseContextMenuOperator.#keyboardItemChange.previousItem :
		case BaseContextMenuOperator.#keyboardItemChange.nextItem :
			this.#keyboardSelectedItemObjId += changeValue;
			if ( NOT_FOUND === this.#keyboardSelectedItemObjId ) {
				this.#keyboardSelectedItemObjId = this.#contextMenu.menuItemHTMLElements.length - ONE;
			}
			if ( this.#contextMenu.menuItemHTMLElements.length === this.#keyboardSelectedItemObjId ) {
				this.#keyboardSelectedItemObjId = ZERO;
			}
			break;
		case BaseContextMenuOperator.#keyboardItemChange.firstItem :
			this.#keyboardSelectedItemObjId = ZERO;
			break;
		case BaseContextMenuOperator.#keyboardItemChange.lastItem :
			this.#keyboardSelectedItemObjId = this.#contextMenu.menuItemHTMLElements.length - ONE;
			break;
		default :
			break;
		}

		// add css class
		this.#contextMenu.menuItemHTMLElements [ this.#keyboardSelectedItemObjId ]
			.classList.add ( 'TravelNotes-ContextMenu-MenuItemSelected' );
	}

	/**
	constructor
	@param {BaseContextMenu} contextMenu The ContextMenu for witch the operator is made
	*/

	constructor ( contextMenu ) {

		Object.freeze ( this );

		// saving the reference to the menu
		this.#contextMenu = contextMenu;

		this.#contextMenuKeyboardKeydownEL = new ContextMenuKeyboardKeydownEL ( this );
		document.addEventListener ( 'keydown', this.#contextMenuKeyboardKeydownEL, true );

		this.#contextMenuEL = new ContextMenuEL ( this );
		this.#contextMenuEL.addEventListeners ( this.#contextMenu.contextMenuHTMLElement );

		this.#contextMenuCancelButtonEL = new ContextMenuCancelButtonEL ( this );
		this.#contextMenuCancelButtonEL.addEventListeners ( this.#contextMenu.cancelButton );

		this.#menuItemEL = new MenuItemEL ( this );
		this.#contextMenu.menuItemHTMLElements.forEach (
			menuItemHTMLElement => {
				this.#menuItemEL.addEventListeners ( menuItemHTMLElement );
			}
		);
	}

	/**
	Remove event listeners, set event listeners to null so all references to this are removed
	and remove the menu from the screen
	*/

	destructor ( ) {

		// Cleaning the timer
		if ( this.#timerId ) {
			clearTimeout ( this.#timerId );
			this.#timerId = null;
		}

		// Removing event listeners
		document.removeEventListener ( 'keydown', this.#contextMenuKeyboardKeydownEL, true );

		this.#contextMenuEL.removeEventListeners ( this.#contextMenu.contextMenuHTMLElement );
		this.#contextMenuCancelButtonEL.removeEventListeners ( this.#contextMenu.cancelButton );
		this.#contextMenu.menuItemHTMLElements.forEach (
			menuItemHTMLElement => {
				this.#menuItemEL.removeEventListeners ( menuItemHTMLElement );
			}
		);

		this.#contextMenuKeyboardKeydownEL = null;
		this.#contextMenuEL = null;
		this.#contextMenuCancelButtonEL = null;
		this.#menuItemEL = null;

		// removing the html elements
		document.body.removeChild ( this.#contextMenu.contextMenuHTMLElement );

		// cleaning the reference to the menu
		this.#contextMenu = null;
	}

	/**
	Mouse leave context menu action
	*/

	onMouseLeaveContainer ( ) {
		this.#timerId = setTimeout ( ( ) => this.onCancelMenu ( ), theConfig.contextMenu.timeout );
	}

	/**
	Mouse enter context menu action
	*/

	onMouseEnterContainer ( ) {
		if ( this.#timerId ) {
			clearTimeout ( this.#timerId );
			this.#timerId = null;
		}
	}

	/**
	Keydown on the keyboard action
	@param {String} key The pressed keyboard key
	*/

	onKeydownKeyboard ( key ) {
		switch ( key ) {
		case 'Escape' :
		case 'Esc' :
			this.onCancelMenu ( );
			break;
		case 'ArrowDown' :
		case 'ArrowRight' :
		case 'Tab' :
			this.#changeKeyboardSelectedItemObjId ( BaseContextMenuOperator.#keyboardItemChange.nextItem );
			break;
		case 'ArrowUp' :
		case 'ArrowLeft' :
			this.#changeKeyboardSelectedItemObjId ( BaseContextMenuOperator.#keyboardItemChange.previousItem );
			break;
		case 'Home' :
			this.#changeKeyboardSelectedItemObjId ( BaseContextMenuOperator.#keyboardItemChange.firstItem );
			break;
		case 'End' :
			this.#changeKeyboardSelectedItemObjId ( BaseContextMenuOperator.#keyboardItemChange.lastItem );
			break;
		case 'Enter' :
			if (
				( NOT_FOUND === this.#keyboardSelectedItemObjId )
				||
				( this.#contextMenu.menuItemHTMLElements [ this.#keyboardSelectedItemObjId ]
					.classList.contains ( 'TravelNotes-ContextMenu-ItemDisabled' )
				)
			) {
				return;
			}
			this.#contextMenu.onOk ( this.#keyboardSelectedItemObjId );
			break;
		default :
			break;
		}
	}

	/**
	Menu cancellation action
	*/

	onCancelMenu ( ) {
		this.#contextMenu.onCancel ( 'Canceled by user' );
	}

	/**
	Select item action
	@param {Number} itemObjId The id of the selected item
	*/

	selectItem ( itemObjId ) {
		if (
			this.#contextMenu.menuItemHTMLElements [ itemObjId ]
				.classList.contains ( 'TravelNotes-ContextMenu-ItemDisabled' )
		) {
			return;
		}
		this.#contextMenu.onOk ( itemObjId );
	}

	/**
	Mouse leave item action
	@param {HTMLElement} menuItem The targeted item
	*/

	onMouseLeaveMenuItem ( menuItem ) {
		menuItem.classList.remove ( 'TravelNotes-ContextMenu-MenuItemSelected' );
	}

	/**
	Mouse enter item action
	@param {HTMLElement} menuItem The targeted item
	*/

	onMouseEnterMenuItem ( menuItem ) {
		this.#unselectItems ( );
		this.#keyboardSelectedItemObjId = Number.parseInt ( menuItem.dataset.tanObjId );
		menuItem.classList.add ( 'TravelNotes-ContextMenu-MenuItemSelected' );
	}
}

export default BaseContextMenuOperator;

/* --- End of file --------------------------------------------------------------------------------------------------------- */