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
		- created
Doc reviewed ...
Tests ...
*/

import { MOUSE_WHEEL_FACTORS, ZERO, ONE } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A simple container to share data between the BaseToolbarUI class and the ButtonHTMLElementClickEL class
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ToolbarItemsContainer {

	/**
	 An array with the toolbar items
	 @type {Array.<ToolbarItem>}
	*/

	toolbarItemsArray;

	/**
	The constructor
	*/

	constructor ( ) {
		this.toolbarItemsArray = [];
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
click event listener for the toolbar buttons
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ButtonHTMLElementClickEL {

	/**
	A reference to the toolbarItemsContainer of the BaseToolbar class
	@type {ToolbarItemsContainer}
	*/

	#toolbarItemsContainer;

	/**
	The constructor
	@param {ToolbarItemsContainer} toolbarItemsContainer A reference to the toolbarItemsContainer of the BaseToolbar class
	object  of the BaseToolbar class
	*/

	constructor ( toolbarItemsContainer ) {
		this.#toolbarItemsContainer = toolbarItemsContainer;
	}

	/**
	Event listener method
	@param {Event} clickEvent The event to handle
	*/

	handleEvent ( clickEvent ) {
		this.#toolbarItemsContainer.toolbarItemsArray [ Number.parseInt ( clickEvent.target.dataset.tanItemId ) ]
			.action ( );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
touch event listener for the toolbar buttons
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ButtonHTMLElementTouchEL {

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
	A constant with the maximum delta y between the touchstart and touchend events
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #MAX_DELTA_Y ( ) { return 5; }

	/**
	The constructor
	@param {Array.<ToolbarItem>} toolbarItemsArray A reference to the toolbarItemsArray of the BaseToolbar class
	object  of the BaseToolbarUI class
	of the BaseToolbarUI class
	*/

	constructor ( baseToolbar, toolbarItemsContainer ) {
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
					this.#toolbarItemsContainer.toolbarItemsArray [ Number.parseInt ( touchEvent.target.dataset.tanItemId ) ]
						.action ( );
					this.#baseToolbar.hide ( );
				}
			}
			break;
		default :
			break;
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Touch event listener for the buttons container
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ButtonsHTMLElementTouchEL {

	/**
	The Y position of the previous touch event
	@type {Number}
	*/

	#touchContainerStartY = Number.MAX_VALUE;

	/**
	The constructor
	@param {WheelEventData} wheelEventData A reference to the WheelEventData Object
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} touchEvent The event to handle
	*/

	handleEvent ( touchEvent ) {
		touchEvent.preventDefault ( );
		switch ( touchEvent.type ) {
		case 'touchstart' :
			if ( ONE === touchEvent.changedTouches.length ) {
				const touch = touchEvent.changedTouches.item ( ZERO );
				this.#touchContainerStartY = touch.screenY;
			}
			break;
		case 'touchmove' :
		case 'touchend' :
			if ( ONE === touchEvent.changedTouches.length ) {
				const touch = touchEvent.changedTouches.item ( ZERO );
				const deltaY = this.#touchContainerStartY - touch.screenY;
				if ( ZERO !== deltaY ) {
					touchEvent.currentTarget.scrollTop += deltaY;
					this.#touchContainerStartY = touch.screenY;
				}
			}
			break;
		default :
			break;
		}
		if ( 'touchend' === touchEvent.type ) {
			this.#touchContainerStartY = Number.MAX_VALUE;
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Wheel event listener on the map layer buttons container. Scroll the buttons
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ButtonsHTMLElementWheelEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} wheelEvent The event to handle
	*/

	handleEvent ( wheelEvent ) {
		wheelEvent.stopPropagation ( );
		if ( wheelEvent.deltaY ) {
			wheelEvent.currentTarget.scrollTop +=
				wheelEvent.deltaY * MOUSE_WHEEL_FACTORS [ wheelEvent.deltaMode ];
		}
	}
}

export {
	ToolbarItemsContainer,
	ButtonHTMLElementClickEL,
	ButtonHTMLElementTouchEL,
	ButtonsHTMLElementTouchEL,
	ButtonsHTMLElementWheelEL
};

/* --- End of file --------------------------------------------------------------------------------------------------------- */