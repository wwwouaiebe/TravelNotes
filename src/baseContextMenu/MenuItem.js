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
Doc reviewed 20210913
Tests ...
 */

/* ---------------------------------------------------------------------------------------------------------------------------*/
/**
Simple container to store a menu item
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class MenuItem {

	/**
	The text to be displayed in the menu
	@type {String}
	*/

	#itemText;

	/**
	A flag indicating if the menu item can be selected in the menu. Non selectable menu items are
	displayed in gray in the menu
	@type {Boolean}
	*/

	#isActive;

	/**
	The action to execute when the item is selected
	@type {function}
	*/

	#action;

	/**
	The constructor
	@param {String} itemText The text to be displayed in the menu
	@param {Boolean} isActive A flag indicating if the menu item can be selected in the menu
	@param {function} action The action to execute when the item is selected
	*/

	constructor ( itemText, isActive, action ) {
		Object.freeze ( this );
		this.#itemText = itemText;
		this.#isActive = isActive;
		this.#action = action;
	}

	/**
	The text to be displayed in the menu
	@type {String}
	*/

	get itemText ( ) { return this.#itemText; }

	/**
	A flag indicating if the menu item can be selected in the menu. Non selectable menu items are
	displayed in gray in the menu
	@type {Boolean}
	*/

	get isActive ( ) { return this.#isActive; }

	/**
	The action to execute when the item is selected
	@type {function}
	*/

	get action ( ) { return this.#action; }
}

export default MenuItem;

/* --- End of file --------------------------------------------------------------------------------------------------------- */