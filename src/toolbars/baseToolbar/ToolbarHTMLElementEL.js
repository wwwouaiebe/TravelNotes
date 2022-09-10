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

import BaseEL from '../../eventListeners/BaseEL.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
click, mouseenter and mouseleave event listeners on the toolbar
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ToolbarHTMLElementEL extends BaseEL {

	/**
	A reference to the BaseToolbar object
	@type {BaseToolbar}
	*/

	#baseToolbar;

	/**
	the constructor
	@param {BaseToolbar} baseToolbar A reference to the BaseToolbar object
	*/

	constructor ( baseToolbar ) {
		super ( );
		this.#baseToolbar = baseToolbar;
		this.eventTypes = [ 'click', 'mouseenter', 'mouseleave' ];
	}

	/**
	Click event listener method
	@param {Event} clickEvent The event to handle
	*/

	handleClickEvent ( clickEvent ) {
		this.#baseToolbar.toolbarHTMLElementMouseEnterOrClick ( clickEvent );
	}

	/**
	mouseenter event listener method
	@param {Event} mouseEnterEvent The event to handle
	*/

	handleMouseEnterEvent ( mouseEnterEvent ) {
		this.#baseToolbar.toolbarHTMLElementMouseEnterOrClick ( mouseEnterEvent );
	}

	/**
	mouseleave event listener method
	@param {Event} mouseLeaveEvent The event to handle
	*/

	handleMouseLeaveEvent ( mouseLeaveEvent ) {
		this.#baseToolbar.toolbarHTMLElementMouseLeave ( mouseLeaveEvent );
	}
}

export default ToolbarHTMLElementEL;