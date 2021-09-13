/*
Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/

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
Doc reviewed 20210913
Tests ...
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@file BaseContextMenuOperator.js
@copyright Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/
@license GNU General Public License
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@module contextMenus
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

import theConfig from '../data/Config.js';
import {
	KeyboardKeydownEL,
	CancelButtonClickEL,
	MenuItemMouseLeaveEL,
	MenuItemMouseEnterEL,
	MenuItemClickEL,
	ContainerMouseLeaveEL,
	ContainerMouseEnterEL
} from '../contextMenus/BaseContextMenuEventListeners.js';

import { NOT_FOUND, ZERO, ONE } from '../main/Constants.js';

/* eslint-disable no-magic-numbers */

/**
Enum for Item changes from the keyboard
@readonly
@enum {number}
@private
 */

const KEYBOARD_ITEM_CHANGE = {
	previousItem : -1,
	firstItem : 0,
	nextItem : 1,
	lastItem : 2
};

/* eslint-enable no-magic-numbers */

/**
@------------------------------------------------------------------------------------------------------------------------------

@class BaseContextMenuOperator
@classdesc This class perform all the needed operations for context menus
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class BaseContextMenuOperator {

	/**
	A reference to the context menu
	@private
	*/

	#contextMenu = null;

	/**
	events listeners
	@private
	*/

	#eventListeners = {
		onKeydownKeyboard : null,
		onMouseLeaveContainer : null,
		onMouseEnterContainer : null,
		onMouseClickCancelButton : null,
		onClickMenuItem : null,
		onMouseLeaveMenuItem : null,
		onMouseEnterMenuItem : null
	};

	/**
	The index of the selected by the keyboard menuItem
	@private
	*/

	#keybordSelectedItemObjId = NOT_FOUND;

	/**
	TimerId for the mouseleave container action
	@private
	*/

	#timerId = null;

	/**
	Remove the css class on all items
	@private
	*/

	#unselectItems ( ) {
		this.#contextMenu.htmlElements.menuItemHTMLElements.forEach (
			menuitemHTMLElement => { menuitemHTMLElement.classList.remove ( 'TravelNotes-ContextMenu-ItemSelected' ); }
		);
	}

	/**
	Selected item change by the keyboard
	@param {!number} changeValue
	@private
	*/

	#changeKeyboardSelectedItemObjId ( changeValue ) {

		this.#unselectItems ( );

		// change the selected item
		switch ( changeValue ) {
		case KEYBOARD_ITEM_CHANGE.previousItem :
		case KEYBOARD_ITEM_CHANGE.nextItem :
			this.#keybordSelectedItemObjId += changeValue;
			if ( NOT_FOUND === this.#keybordSelectedItemObjId ) {
				this.#keybordSelectedItemObjId = this.#contextMenu.htmlElements.menuItemHTMLElements.length - ONE;
			}
			if ( this.#contextMenu.htmlElements.menuItemHTMLElements.length === this.#keybordSelectedItemObjId ) {
				this.#keybordSelectedItemObjId = ZERO;
			}
			break;
		case ZERO :
			this.#keybordSelectedItemObjId = ZERO;
			break;
		case KEYBOARD_ITEM_CHANGE.lastItem :
			this.#keybordSelectedItemObjId = this.#contextMenu.htmlElements.menuItemHTMLElements.length - ONE;
			break;
		default :
			break;
		}

		// add css class
		this.#contextMenu.htmlElements.menuItemHTMLElements [ this.#keybordSelectedItemObjId ]
			.classList.add ( 'TravelNotes-ContextMenu-ItemSelected' );
	}

	/*
	constructor
	@param {Object} contextMenu. The ContextMenu for witch the operator is made
	*/

	constructor ( contextMenu ) {

		Object.freeze ( this );

		// saving the reference to the menu
		this.#contextMenu = contextMenu;

		// Event listeners creation
		this.#eventListeners.onKeydownKeyboard = new KeyboardKeydownEL ( this );
		this.#eventListeners.onMouseLeaveContainer = new ContainerMouseLeaveEL ( this );
		this.#eventListeners.onMouseEnterContainer = new ContainerMouseEnterEL ( this );
		this.#eventListeners.onMouseClickCancelButton = new CancelButtonClickEL ( this );
		this.#eventListeners.onClickMenuItem = new MenuItemClickEL ( this );
		this.#eventListeners.onMouseLeaveMenuItem = new MenuItemMouseLeaveEL ( this );
		this.#eventListeners.onMouseEnterMenuItem = new MenuItemMouseEnterEL ( this );

		// Adding event listeners to the html elements of the menu
		document.addEventListener ( 'keydown', this.#eventListeners.onKeydownKeyboard, true );
		this.#contextMenu.htmlElements.container.addEventListener ( 'mouseleave', this.#eventListeners.onMouseLeaveContainer );
		this.#contextMenu.htmlElements.container.addEventListener ( 'mouseenter', this.#eventListeners.onMouseEnterContainer );
		this.#contextMenu.htmlElements.cancelButton.addEventListener ( 'click', this.#eventListeners.onMouseClickCancelButton );
		this.#contextMenu.htmlElements.menuItemHTMLElements.forEach (
			menuItemHTMLElement => {
				menuItemHTMLElement.addEventListener ( 'click', this.#eventListeners.onClickMenuItem );
				menuItemHTMLElement.addEventListener ( 'mouseleave', this.#eventListeners.onMouseLeaveMenuItem );
				menuItemHTMLElement.addEventListener ( 'mouseenter', this.#eventListeners.onMouseEnterMenuItem );
			}
		);
	}

	destructor ( ) {

		// Cleaning the timer
		if ( this.#timerId ) {
			clearTimeout ( this.#timerId );
			this.#timerId = null;
		}

		// Removing event listeners
		document.removeEventListener ( 'keydown', this.#eventListeners.onKeydownKeyboard, true );
		this.#contextMenu.htmlElements.container.removeEventListener (
			'mouseleave',
			this.#eventListeners.onMouseLeaveContainer
		);
		this.#contextMenu.htmlElements.container.removeEventListener (
			'mouseenter',
			this.#eventListeners.onMouseEnterContainer
		);
		this.#contextMenu.htmlElements.cancelButton.removeEventListener (
			'click',
			this.#eventListeners.onMouseClickCancelButton
		);
		this.#contextMenu.htmlElements.menuItemHTMLElements.forEach (
			menuItemHTMLElement => {
				menuItemHTMLElement.removeEventListener ( 'click', this.#eventListeners.onClickMenuItem );
				menuItemHTMLElement.removeEventListener ( 'mouseleave', this.#eventListeners.onMouseLeaveMenuItem );
				menuItemHTMLElement.removeEventListener ( 'mouseenter', this.#eventListeners.onMouseEnterMenuItem );
			}
		);

		// removing reference to the menu operator in the event listeners
		for ( const eventListenerName in this.#eventListeners ) {
			this.#eventListeners [ eventListenerName ].destructor ( );
		}

		// removing the html elements
		this.#contextMenu.htmlElements.parentNode.removeChild ( this.#contextMenu.htmlElements.container );

		// cleaning the reference to the menu
		this.#contextMenu = null;
	}

	/**
	Mouse leave container action
	*/

	onMouseLeaveContainer ( ) {
		this.#timerId = setTimeout ( ( ) => this.onCancelMenu ( ), theConfig.contextMenu.timeout );
	}

	/**
	Mouse enter container action
	*/

	onMouseEnterContainer ( ) {
		if ( this.#timerId ) {
			clearTimeout ( this.#timerId );
			this.#timerId = null;
		}
	}

	/**
	Keydown on the keyboard action
	@param {string} key The pressed keyboard key
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
			this.#changeKeyboardSelectedItemObjId ( KEYBOARD_ITEM_CHANGE.nextItem );
			break;
		case 'ArrowUp' :
		case 'ArrowLeft' :
			this.#changeKeyboardSelectedItemObjId ( KEYBOARD_ITEM_CHANGE.previousItem );
			break;
		case 'Home' :
			this.#changeKeyboardSelectedItemObjId ( KEYBOARD_ITEM_CHANGE.firstItem );
			break;
		case 'End' :
			this.#changeKeyboardSelectedItemObjId ( KEYBOARD_ITEM_CHANGE.lastItem );
			break;
		case 'Enter' :
			if (
				( NOT_FOUND === this.#keybordSelectedItemObjId )
				||
				( this.#contextMenu.htmlElements.menuItemHTMLElements [ this.#keybordSelectedItemObjId ]
					.classList.contains ( 'TravelNotes-ContextMenu-ItemDisabled' )
				)
			) {
				return;
			}
			this.#contextMenu.onOk ( this.#keybordSelectedItemObjId );
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
	@param {!number} itemObjId The id of the selected item
	*/

	selectItem ( itemObjId ) {
		if (
			this.#contextMenu.htmlElements.menuItemHTMLElements [ itemObjId ]
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
		menuItem.classList.remove ( 'TravelNotes-ContextMenu-ItemSelected' );
	}

	/**
	Mouse enter item action
	@param {HTMLElement} menuItem The targeted item
	*/

	onMouseEnterMenuItem ( menuItem ) {
		this.#unselectItems ( );
		this.#keybordSelectedItemObjId = Number.parseInt ( menuItem.dataset.tanObjId );
		menuItem.classList.add ( 'TravelNotes-ContextMenu-ItemSelected' );
	}
}

export default BaseContextMenuOperator;

/*
@------------------------------------------------------------------------------------------------------------------------------

end of BaseContextMenuOperator.js file

@------------------------------------------------------------------------------------------------------------------------------
*/