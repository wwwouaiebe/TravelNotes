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
Doc reviewed 20210915
Tests ...
*/

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
keydown event listener for the context menus
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ContextMenuKeyboardKeydownEL {

	/**
	A reference to the menuOperator Object
	@type {BaseContextMenuOperator}
	*/

	#menuOperator = null;

	/**
	The constructor
	@param {BaseContextMenuOperator} menuOperator A reference to the menuOperator Object
	*/

	constructor ( menuOperator ) {
		Object.freeze ( this );
		this.#menuOperator = menuOperator;
	}

	/**
	Event listener method
	@param {Event} keydownEvent The event to handle
	*/

	handleEvent ( keydownEvent ) {
		keydownEvent.stopPropagation ( );
		this.#menuOperator.onKeydownKeyboard ( keydownEvent.key );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
click event listener on the cancel button for the context menus
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class CancelContextMenuButtonClickEL {

	/**
	A reference to the menuOperator Object
	@type {BaseContextMenuOperator}
	*/

	#menuOperator = null;

	/**
	The constructor
	@param {BaseContextMenuOperator} menuOperator A reference to the menuOperator Object
	*/

	constructor ( menuOperator ) {
		Object.freeze ( this );
		this.#menuOperator = menuOperator;
	}

	/**
	Event listener method
	@param {Event} clickEvent The event to handle
	*/

	handleEvent ( clickEvent ) {
		clickEvent.stopPropagation ( );
		this.#menuOperator.onCancelMenu ( );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
cancel with pointer event listener for the context menus
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class CancelContextMenuPointerEL {

	/**
	The X position of the pointer of the previous event
	@type {?Number}
	*/

	#clientX = null;

	/**
	The Y position of the pointer of the previous event
	@type {?Number}
	*/

	#clientY = null;

	/**
	The minimal difference on the Y position between two events
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #MIN_DELTA_CLIENT_Y ( ) { return 100; }

	/**
	The maximal difference on the X position between two events
	@type {Number}
	*/
	// eslint-disable-next-line no-magic-numbers
	static get #MAX_DELTA_CLIENT_X ( ) { return 30; }

	/**
	A reference to the menuOperator Object
	@type {BaseContextMenuOperator}
	*/

	#menuOperator = null;

	/**
	The constructor
	@param {BaseContextMenuOperator} menuOperator A reference to the menuOperator Object
	*/

	constructor ( menuOperator ) {
		Object.freeze ( this );
		this.#menuOperator = menuOperator;
	}

	/**
	Event listener method
	@param {Event} pointerEvent The event to handle
	*/

	handleEvent ( pointerEvent ) {
		pointerEvent.preventDefault ( );
		switch ( pointerEvent.type ) {
		case 'pointerdown' :
			this.#clientX = pointerEvent.clientX;
			this.#clientY = pointerEvent.clientY;
			break;
		case 'pointerup' :
			if ( this.#clientX && this.#clientY ) {
				if (
					CancelContextMenuPointerEL.#MIN_DELTA_CLIENT_Y < this.#clientY - pointerEvent.clientY
					&&
					CancelContextMenuPointerEL.#MAX_DELTA_CLIENT_X > Math.abs ( this.#clientX - pointerEvent.clientX )
				) {
					this.#menuOperator.onCancelMenu ( );
				}
			}
			this.#clientX = null;
			this.#clientY = null;
			break;
		default :
			break;
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
mouseleave event listener on the menuItems for the context menus
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class MenuItemMouseLeaveEL {

	/**
	A reference to the menuOperator Object
	@type {BaseContextMenuOperator}
	*/

	#menuOperator = null;

	/**
	The constructor
	@param {BaseContextMenuOperator} menuOperator A reference to the menuOperator Object
	*/

	constructor ( menuOperator ) {
		Object.freeze ( this );
		this.#menuOperator = menuOperator;
	}

	/**
	Event listener method
	@param {Event} mouseLeaveEvent The event to handle
	*/

	handleEvent ( mouseLeaveEvent ) {
		mouseLeaveEvent.stopPropagation ( );
		this.#menuOperator.onMouseLeaveMenuItem ( mouseLeaveEvent.currentTarget );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
mouseenter event listener on the menuItems for the context menus
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class MenuItemMouseEnterEL {

	/**
	A reference to the menuOperator Object
	@type {BaseContextMenuOperator}
	*/

	#menuOperator = null;

	/**
	the constructor
	@param {BaseContextMenuOperator} menuOperator A reference to the menuOperator Object
	*/

	constructor ( menuOperator ) {
		Object.freeze ( this );
		this.#menuOperator = menuOperator;
	}

	/**
	Event listener method
	@param {Event} mouseEnterEvent The event to handle
	*/

	handleEvent ( mouseEnterEvent ) {
		mouseEnterEvent.stopPropagation ( );
		this.#menuOperator.onMouseEnterMenuItem ( mouseEnterEvent.currentTarget );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
click event listener on the menuItems for the context menus
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class MenuItemClickEL {

	/**
	A reference to the menuOperator Object
	@type {BaseContextMenuOperator}
	*/

	#menuOperator = null;

	/**
	The constructor
	@param {BaseContextMenuOperator} menuOperator A reference to the menuOperator Object
	*/

	constructor ( menuOperator ) {
		Object.freeze ( this );
		this.#menuOperator = menuOperator;
	}

	/**
	Event listener method
	@param {Event} clickEvent The event to handle
	*/

	handleEvent ( clickEvent ) {
		clickEvent.stopPropagation ( );
		this.#menuOperator.selectItem ( Number.parseInt ( clickEvent.currentTarget.dataset.tanObjId ) );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
mouseleave event listener on the container for the context menus
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ContainerMouseLeaveEL {

	/**
	A reference to the menuOperator Object
	@type {BaseContextMenuOperator}
	*/

	#menuOperator = null;

	/**
	The constructor
	@param {BaseContextMenuOperator} menuOperator A reference to the menuOperator Object
	*/

	constructor ( menuOperator ) {
		Object.freeze ( this );
		this.#menuOperator = menuOperator;
	}

	/**
	Event listener method
	@param {Event} mouseLeaveEvent The event to handle
	*/

	handleEvent ( mouseLeaveEvent ) {
		mouseLeaveEvent.stopPropagation ( );
		this.#menuOperator.onMouseLeaveContainer ( );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 mouseenter event listener on the container for the context menus
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ContainerMouseEnterEL {

	/**
	A reference to the menuOperator Object
	@type {BaseContextMenuOperator}
	*/

	#menuOperator = null;

	/**
	The constructor
	@param {BaseContextMenuOperator} menuOperator A reference to the menuOperator Object
	*/

	constructor ( menuOperator ) {
		Object.freeze ( this );
		this.#menuOperator = menuOperator;
	}

	/**
	Event listener method
	@param {Event} mouseEnterEvent The event to handle
	*/

	handleEvent ( mouseEnterEvent ) {
		mouseEnterEvent.stopPropagation ( );
		this.#menuOperator.onMouseEnterContainer ( );
	}
}

export {
	ContextMenuKeyboardKeydownEL,
	CancelContextMenuButtonClickEL,
	CancelContextMenuPointerEL,
	MenuItemMouseLeaveEL,
	MenuItemMouseEnterEL,
	MenuItemClickEL,
	ContainerMouseLeaveEL,
	ContainerMouseEnterEL
};

/* --- End of file --------------------------------------------------------------------------------------------------------- */