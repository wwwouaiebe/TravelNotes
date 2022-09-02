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

export default MenuItemMouseLeaveEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */