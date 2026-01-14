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

import { NOT_FOUND, ZERO } from '../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Pointer Events listener for the toolbar buttons
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ButtonHTMLElementPointerEL {

	/**
	 * A reference to the toolbar
	 * @type {BaseToolbar}
	 */

	#baseToolbar;

	/**
	 * The Y screen coord of the pointer
	 * @type {Number}
	 */

	#pointerScreenY = ZERO;

	/**
	A reference to the toolbarItemsContainer of the BaseToolbar class
	@type {toolbarItemsCollection}
	*/

	#toolbarItemsCollection;

	/**
	 * the itemId of the button on witch the last pointerdown event occurs
	 * @type {Number}
	 */

	#pointerDownToolbarItemId;

	/**
	The constructor
	@param {BaseToolbar} baseToolbar A reference to the BaseToolbar
	@param {ToolbarItemsCollection} toolbarItemsCollection A reference to the toolbarItemsContainer object
	 of the BaseToolbar class
	*/

	constructor ( baseToolbar, toolbarItemsCollection ) {
		Object.freeze ( this );
		this.#toolbarItemsCollection = toolbarItemsCollection;
		this.#baseToolbar = baseToolbar;
	}

	/**
	Event listener method
	@param {Event} pointerEvent The event to handle
	*/

	handleEvent ( pointerEvent ) {
		switch ( pointerEvent.type ) {
		case 'pointerdown' :
			this.#pointerDownToolbarItemId = pointerEvent.target.dataset.tanItemId;
			this.#pointerScreenY = pointerEvent.screenY;

			break;
		case 'pointerup' :
			if (
				this.#pointerDownToolbarItemId === pointerEvent.target.dataset.tanItemId
				&&
				this.#pointerScreenY === pointerEvent.screenY
			) {
				this.#toolbarItemsCollection
					.toolbarItemsArray [ Number.parseInt ( pointerEvent.target.dataset.tanItemId ) ]
					.doAction ( );
				this.#baseToolbar.hide ( );
			}
			break;
		case 'pointerenter' :
			this.#pointerDownToolbarItemId = NOT_FOUND;
			break;
		case 'pointerleave' :
			this.#pointerDownToolbarItemId = NOT_FOUND;
			break;
		default :
			break;
		}
	}
}

export default ButtonHTMLElementPointerEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */