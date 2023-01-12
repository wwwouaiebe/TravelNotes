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

import { ZERO, ONE } from '../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
touch event listener for the toolbar buttons
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ButtonHTMLElementTouchEL {

	/**
	A reference to the BaseToolbar
	@type {BaseToolbar}
	*/

	#baseToolbar;

	/**
	A reference to the toolbarItemsContainer of the BaseToolbar class
	@type {toolbarItemsContainer}
	*/

	#toolbarItemsContainer;

	/**
	The y position of the touchstart event
	@type {Number}
	*/

	#touchButtonStartY;

	/**
	A constant with the maximum delta y between the touchstart and touchend events for
	the event will be considered as a click event
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #MAX_DELTA_Y ( ) { return 5; }

	/**
	The constructor
	@param {BaseToolbar} baseToolbar A reference to the BaseToolbar
	@param {toolbarItemsContainer} toolbarItemsContainer A reference to the toolbarItemsContainer object
	 of the BaseToolbar class
	*/

	constructor ( baseToolbar, toolbarItemsContainer ) {
		Object.freeze ( this );
		this.#baseToolbar = baseToolbar;
		this.#toolbarItemsContainer = toolbarItemsContainer;
	}

	/**
	Event listener method
	@param {Event} touchEvent The event to handle
	*/

	handleEvent ( touchEvent ) {
		switch ( touchEvent.type ) {
		case 'touchstart' :
			if ( ONE === touchEvent.changedTouches.length ) {
				const touch = touchEvent.changedTouches.item ( ZERO );
				this.#touchButtonStartY = touch.screenY;
			}
			break;
		case 'touchend' :
			if ( ONE === touchEvent.changedTouches.length ) {
				const touch = touchEvent.changedTouches.item ( ZERO );
				if ( ButtonHTMLElementTouchEL.#MAX_DELTA_Y > Math.abs ( touch.screenY - this.#touchButtonStartY ) ) {
					touchEvent.stopPropagation ( );
					touchEvent.preventDefault ( );
					this.#toolbarItemsContainer
						.toolbarItemsArray [ Number.parseInt ( touchEvent.target.dataset.tanItemId ) ]
						.doAction ( );
					this.#baseToolbar.hide ( );
				}
			}
			break;
		default :
			break;
		}
	}
}

export default ButtonHTMLElementTouchEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */