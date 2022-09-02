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
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
	- v4.0.0:
		- Issue ♯50 : Add touch events on the menus to close the menus
Doc reviewed 20220828
Tests ...
*/

import theConfig from '../../data/Config.js';
import ContextMenuKeyboardKeydownEL from '../baseContextMenu/ContextMenuKeyboardKeydownEL.js';
import ContextMenuCancelButtonClickEL from '../baseContextMenu/ContextMenuCancelButtonClickEL.js';
import ContextMenuTouchEL from '../baseContextMenu/ContextMenuTouchEL.js';
import MenuItemMouseLeaveEL from '../baseContextMenu/MenuItemMouseLeaveEL.js';
import MenuItemMouseEnterEL from '../baseContextMenu/MenuItemMouseEnterEL.js';
import MenuItemClickEL from '../baseContextMenu/MenuItemClickEL.js';
import ContextMenuMouseLeaveEL from '../baseContextMenu/ContextMenuMouseLeaveEL.js';
import ContextMenuMouseEnterEL from '../baseContextMenu/ContextMenuMouseEnterEL.js';

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

	/* eslint-disable no-magic-numbers */

	static #keyboardItemChange = Object.freeze (
		{
			get previousItem ( ) { return -1; },
			get firstItem ( ) { return 0; },
			get nextItem ( ) { return 1; },
			get lastItem ( ) { return 2; }
		}
	);

	/* eslint-enable no-magic-numbers */

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
	Mouseleave context menu event listener
	@type {ContextMenuMouseLeaveEL}
	*/

	#contextMenuMouseLeaveEL;

	/**
	mouseenter context menu event listener
	@type {ContextMenuMouseEnterEL}
	*/

	#contextMenuMouseEnterEL;

	/**
	Click cancel button event listener
	@type {ContextMenuCancelButtonClickEL}
	*/

	#contextMenuCancelButtonClickEL;

	/**
	Touch event listener for the context menus
	@type {ContextMenuTouchEL}
	*/

	#contextMenuTouchEL;

	/**
	click menu item event listener
	@type {MenuItemClickEL}
	*/

	#menuItemClickEL;

	/**
	Mouseleave menu item event listener
	@type {MenuItemMouseLeaveEL}
	*/

	#menuItemMouseLeaveEL;

	/**
	Mouse enter menu item event listener
	@type {MenuItemMouseEnterEL}
	*/

	#menuItemMouseEnterEL;

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

		// Event listeners creation
		this.#contextMenuKeyboardKeydownEL = new ContextMenuKeyboardKeydownEL ( this );
		this.#contextMenuMouseLeaveEL = new ContextMenuMouseLeaveEL ( this );
		this.#contextMenuMouseEnterEL = new ContextMenuMouseEnterEL ( this );
		this.#contextMenuCancelButtonClickEL = new ContextMenuCancelButtonClickEL ( this );
		this.#contextMenuTouchEL = new ContextMenuTouchEL ( this );
		this.#menuItemClickEL = new MenuItemClickEL ( this );
		this.#menuItemMouseLeaveEL = new MenuItemMouseLeaveEL ( this );
		this.#menuItemMouseEnterEL = new MenuItemMouseEnterEL ( this );

		// Adding event listeners to the html elements of the menu and to the document
		document.addEventListener ( 'keydown', this.#contextMenuKeyboardKeydownEL, true );
		this.#contextMenu.contextMenuHTMLElement.addEventListener ( 'mouseleave', this.#contextMenuMouseLeaveEL );
		this.#contextMenu.contextMenuHTMLElement.addEventListener ( 'mouseenter', this.#contextMenuMouseEnterEL );
		this.#contextMenu.contextMenuHTMLElement.addEventListener ( 'touchstart', this.#contextMenuTouchEL );
		this.#contextMenu.contextMenuHTMLElement.addEventListener ( 'touchend', this.#contextMenuTouchEL );
		this.#contextMenu.contextMenuHTMLElement.addEventListener ( 'touchcancel', this.#contextMenuTouchEL );
		this.#contextMenu.cancelButton.addEventListener ( 'click', this.#contextMenuCancelButtonClickEL );
		this.#contextMenu.menuItemHTMLElements.forEach (
			menuItemHTMLElement => {
				menuItemHTMLElement.addEventListener ( 'click', this.#menuItemClickEL );
				menuItemHTMLElement.addEventListener ( 'mouseleave', this.#menuItemMouseLeaveEL );
				menuItemHTMLElement.addEventListener ( 'mouseenter', this.#menuItemMouseEnterEL );
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
		this.#contextMenu.contextMenuHTMLElement.removeEventListener (
			'mouseleave',
			this.#contextMenuMouseLeaveEL
		);
		this.#contextMenu.contextMenuHTMLElement.removeEventListener (
			'mouseenter',
			this.#contextMenuMouseEnterEL
		);
		this.#contextMenu.contextMenuHTMLElement.removeEventListener ( 'touchstart', this.#contextMenuTouchEL );
		this.#contextMenu.contextMenuHTMLElement.removeEventListener ( 'touchend', this.#contextMenuTouchEL );
		this.#contextMenu.contextMenuHTMLElement.removeEventListener ( 'touchcancel', this.#contextMenuTouchEL );
		this.#contextMenu.cancelButton.removeEventListener (
			'click',
			this.#contextMenuCancelButtonClickEL
		);
		this.#contextMenu.menuItemHTMLElements.forEach (
			menuItemHTMLElement => {
				menuItemHTMLElement.removeEventListener ( 'click', this.#menuItemClickEL );
				menuItemHTMLElement.removeEventListener ( 'mouseleave', this.#menuItemMouseLeaveEL );
				menuItemHTMLElement.removeEventListener ( 'mouseenter', this.#menuItemMouseEnterEL );
			}
		);

		this.#contextMenuKeyboardKeydownEL = null;
		this.#contextMenuMouseLeaveEL = null;
		this.#contextMenuMouseEnterEL = null;
		this.#contextMenuCancelButtonClickEL = null;
		this.#contextMenuTouchEL = null;
		this.#menuItemClickEL = null;
		this.#menuItemMouseLeaveEL = null;
		this.#menuItemMouseEnterEL = null;

		// removing the html elements
		this.#contextMenu.parentNode.removeChild ( this.#contextMenu.contextMenuHTMLElement );

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