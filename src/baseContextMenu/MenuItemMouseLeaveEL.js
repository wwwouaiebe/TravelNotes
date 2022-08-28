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
	The destructor
	*/

	destructor ( ) {
		this.#menuOperator = null;
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

export default MenuItemMouseLeaveEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */