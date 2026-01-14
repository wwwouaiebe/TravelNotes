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
Doc reviewed 20260103
 */

import theConfig from '../../data/Config.js';
import ContextMenuKeyboardKeydownEL from './ContextMenuKeyboardKeydownEL.js';
import ContextMenuCancelButtonClickEL from './ContextMenuCancelButtonClickEL.js';
import MenuItemPointerLeaveEL from './MenuItemPointerLeaveEL.js';
import MenuItemPointerEnterEL from './MenuItemPointerEnterEL.js';
import MenuItemPointerDownEL from './MenuItemPointerDownEL.js';
import MenuItemPointerUpEL from './MenuItemPointerUpEL.js';
import MenuContainerPointerLeaveEL from './MenuContainerPointerLeaveEL.js';
import MenuContainerPointerEnterEL from './MenuContainerPointerEnterEL.js';

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

			get previousItem ( ) { return -1; },

			get firstItem ( ) { return 0; },

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
	pointerleave context menu event listener
	@type {MenuContainerPointerLeaveEL}
	*/

	#menuContainerPointerLeaveEL;

	/**
	pointerenter context menu event listener
	@type {MenuContainerPointerEnterEL}
	*/

	#menuContainerPointerEnterEL;

	/**
	Click cancel button event listener
	@type {ContextMenuCancelButtonClickEL}
	*/

	#contextMenuCancelButtonClickEL;

	/**
	pointerleave menu item event listener
	@type {MenuItemPointerLeaveEL}
	*/

	#menuItemPointerLeaveEL;

	/**
	pointerenter menu item event listener
	@type {MenuItemPointerEnterEL}
	*/

	#menuItemPointerEnterEL;

	/**
	pointerdown menu item event listener
	@type {MenuItemPointerDownEL}
	*/

	#menuItemPointerDownEL;

	/**
	pointerup menu item event listener
	@type {MenuItemPointerUpEL}
	*/

	#menuItemPointerUpEL;

	/**
	The index of the selected by the keyboard menuItem
	@type {Number}
	*/

	#keyboardSelectedItemObjId = NOT_FOUND;

	/**
	The index of the last menuItem on witch the pointerdown event was triggered
	@type {Number}
	*/

	#pointerDownMenuItemObjId = NOT_FOUND;

	/**
	TimerId for the pointerleave context menu action
	@type {Number}
	*/

	#timerId = null;

	/**
	Remove the css class on all items
	*/

	#unselectItems ( ) {
		this.#contextMenu.menuItemHTMLElements.forEach (
			menuitemHTMLElement => { menuitemHTMLElement.classList.remove ( 'travelnotes-context-menu-menu-item-selected' ); }
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
			.classList.add ( 'travelnotes-context-menu-menu-item-selected' );
	}

	/**
	constructor
	@param {BaseContextMenu} contextMenu The ContextMenu for witch the operator is made
	*/

	constructor ( contextMenu ) {

		Object.freeze ( this );

		// saving the reference to the menu
		this.#contextMenu = contextMenu;

		// Event listeners creation
		this.#contextMenuKeyboardKeydownEL = new ContextMenuKeyboardKeydownEL ( this );
		this.#menuContainerPointerLeaveEL = new MenuContainerPointerLeaveEL ( this );
		this.#menuContainerPointerEnterEL = new MenuContainerPointerEnterEL ( this );
		this.#contextMenuCancelButtonClickEL = new ContextMenuCancelButtonClickEL ( this );
		this.#menuItemPointerLeaveEL = new MenuItemPointerLeaveEL ( this );
		this.#menuItemPointerEnterEL = new MenuItemPointerEnterEL ( this );
		this.#menuItemPointerDownEL = new MenuItemPointerDownEL ( this );
		this.#menuItemPointerUpEL = new MenuItemPointerUpEL ( this );

		// Adding event listeners to the html elements of the menu and to the document
		document.addEventListener ( 'keydown', this.#contextMenuKeyboardKeydownEL, true );
		this.#contextMenu.contextMenuContainer.addEventListener ( 'pointerleave', this.#menuContainerPointerLeaveEL );
		this.#contextMenu.contextMenuContainer.addEventListener ( 'pointerenter', this.#menuContainerPointerEnterEL );
		this.#contextMenu.cancelButton.addEventListener ( 'click', this.#contextMenuCancelButtonClickEL );
		this.#contextMenu.menuItemHTMLElements.forEach (
			menuItemHTMLElement => {
				menuItemHTMLElement.addEventListener ( 'pointerleave', this.#menuItemPointerLeaveEL );
				menuItemHTMLElement.addEventListener ( 'pointerenter', this.#menuItemPointerEnterEL );
				menuItemHTMLElement.addEventListener ( 'pointerdown', this.#menuItemPointerDownEL );
				menuItemHTMLElement.addEventListener ( 'pointerup', this.#menuItemPointerUpEL );
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
		this.#contextMenu.contextMenuContainer.removeEventListener (
			'pointerleave',
			this.#menuContainerPointerLeaveEL
		);
		this.#contextMenu.contextMenuContainer.removeEventListener (
			'pointerenter',
			this.#menuContainerPointerEnterEL
		);
		this.#contextMenu.cancelButton.removeEventListener (
			'click',
			this.#contextMenuCancelButtonClickEL
		);
		this.#contextMenu.menuItemHTMLElements.forEach (
			menuItemHTMLElement => {
				menuItemHTMLElement.removeEventListener ( 'pointerleave', this.#menuItemPointerLeaveEL );
				menuItemHTMLElement.removeEventListener ( 'pointerenter', this.#menuItemPointerEnterEL );
				menuItemHTMLElement.removeEventListener ( 'pointerdown', this.#menuItemPointerDownEL );
				menuItemHTMLElement.removeEventListener ( 'pointerup', this.#menuItemPointerUpEL );
			}
		);

		this.#contextMenuKeyboardKeydownEL = null;
		this.#menuContainerPointerLeaveEL = null;
		this.#menuContainerPointerEnterEL = null;
		this.#contextMenuCancelButtonClickEL = null;
		this.#menuItemPointerLeaveEL = null;
		this.#menuItemPointerEnterEL = null;
		this.#menuItemPointerDownEL = null;
		this.#menuItemPointerUpEL = null;

		// removing the html elements
		document.body.removeChild ( this.#contextMenu.contextMenuContainer );

		// cleaning the reference to the menu
		this.#contextMenu = null;
	}

	/**
	pointerleave context menu action
	*/

	onPointerLeaveContainer ( ) {
		this.#timerId = setTimeout ( ( ) => this.onCancelMenu ( ), theConfig.contextMenu.timeout );
	}

	/**
	pointerenter context menu action
	*/

	onPointerEnterContainer ( ) {
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
					.classList.contains ( 'travelnotes-context-menu-menu-item-disabled' )
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
				.classList.contains ( 'travelnotes-context-menu-menu-item-disabled' )
		) {
			return;
		}
		this.#contextMenu.onOk ( itemObjId );
	}

	/**
	Pointer leave item action
	@param {HTMLElement} menuItem The targeted item
	*/

	onPointerLeaveMenuItem ( menuItem ) {
		menuItem.classList.remove ( 'travelnotes-context-menu-menu-item-selected' );
		this.#pointerDownMenuItemObjId = NOT_FOUND;
	}

	/**
	pointerenter item action
	@param {HTMLElement} menuItem The targeted item
	*/

	onPointerEnterMenuItem ( menuItem ) {
		this.#unselectItems ( );
		this.#pointerDownMenuItemObjId = NOT_FOUND;
		this.#keyboardSelectedItemObjId = Number.parseInt ( menuItem.dataset.tanObjId );
		menuItem.classList.add ( 'travelnotes-context-menu-menu-item-selected' );
	}

	/**
	pointerdown item action
	@param {HTMLElement} menuItem The targeted item
	*/

	onPointerDownMenuItem ( menuItem ) {
		this.#pointerDownMenuItemObjId = Number.parseInt ( menuItem.dataset.tanObjId );
	}

	/**
	pointerup item action
	@param {HTMLElement} menuItem The targeted item
	*/

	onPointerUpMenuItem ( menuItem ) {
		const keyUpMenuItemObjId = Number.parseInt ( menuItem.dataset.tanObjId );
		if ( keyUpMenuItemObjId === this.#pointerDownMenuItemObjId ) {
			this.selectItem ( keyUpMenuItemObjId );
		}
	}
}

export default BaseContextMenuOperator;

/* --- End of file --------------------------------------------------------------------------------------------------------- */