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
A simple container with data shred between the BaseToolbarUI class and the wheel event listener and touch event listener
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class WheelEventData {

	/**
	The min buttons that have to be always visible
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #MIN_BUTTONS_VISIBLE ( ) { return 3; }

	/**
	The current margin-top in pixels css value for the buttons container
	@type {Number}
	*/

	#marginTop = ZERO;

	/**
	The constructor
	*/

	constructor ( ) {
		Object.seal ( this );
	}

	/**
	The height of 1 button in pixel;
	@type {Number}
	*/

	buttonHeight = ZERO;

	/**
	The total height of all butons in pixels
	@type {Number}
	*/

	buttonsHeight = ZERO;

	/**
	The top css value of the first button
	@type {Number}
	*/

	buttonTop = ZERO;

	/**
	The top margin to be used for the toolbar
	@type {Number}
	*/

	get marginTop ( ) { return this.#marginTop; }

	set marginTop ( marginTop ) {
		this.#marginTop = marginTop;
		this.#marginTop =
			this.#marginTop > this.buttonTop
				?
				this.buttonTop
				:
				this.#marginTop;
		this.#marginTop =
			this.#marginTop < this.buttonTop - this.buttonsHeight +
			( WheelEventData.#MIN_BUTTONS_VISIBLE * this.buttonHeight )
				?
				(
					this.buttonTop -
					this.buttonsHeight +
					( WheelEventData.#MIN_BUTTONS_VISIBLE * this.buttonHeight )
				)
				:
				this.#marginTop;
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
click event listener for the toolbar buttons
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ButtonHTMLElementClickEL {

	/**
	A reference to the toolbarItemsArray of the BaseToolbar class
	@type {Array.<ToolbarItem>}
	*/

	#toolbarItemsArray;

	/**
	The constructor
	@param {Array.<ToolbarItem>} toolbarItemsArray A reference to the toolbarItemsArray of the BaseToolbar class
	object  of the BaseToolbarUI class
	of the BaseToolbarUI class
	*/

	constructor ( toolbarItemsArray ) {
		this.#toolbarItemsArray = toolbarItemsArray;
	}

	/**
	Event listener method
	@param {Event} clickEvent The event to handle
	*/

	handleEvent ( clickEvent ) {
		console.log ( 'ButtonHTMLElementClickEL' );
		this.#toolbarItemsArray [ Number.parseInt ( clickEvent.target.dataset.tanItemId ) ].action ( );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
touch event listener for the toolbar buttons
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ButtonHTMLElementTouchEL {

	/**
	 A function used to hide the toolbar buttons
	@type {function}
	*/

	#hideToolbarFct;

	/**
	A reference to the toolbarItemsArray of the BaseToolbar class
	@type {Array.<ToolbarItem>}
	*/

	#toolbarItemsArray;

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
	@param {function} hideToolbarFct A function used to hide the toolbar buttons
	@param {Array.<ToolbarItem>} toolbarItemsArray A reference to the toolbarItemsArray of the BaseToolbar class
	object  of the BaseToolbarUI class
	of the BaseToolbarUI class
	*/

	constructor ( hideToolbarFct, toolbarItemsArray ) {
		this.#hideToolbarFct = hideToolbarFct;
		this.#toolbarItemsArray = toolbarItemsArray;
	}

	/**
	Event listener method
	@param {Event} touchEvent The event to handle
	*/

	handleEvent ( touchEvent ) {
		console.log ( 'ButtonHTMLElementTouchEL' );
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
					this.#toolbarItemsArray [ Number.parseInt ( touchEvent.target.dataset.tanItemId ) ].action ( );
					this.#hideToolbarFct ( );
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
	A reference to the WheelEventData Object
	@type {WheelEventData}
	*/

	#wheelEventData;

	/**
	The Y position of the previous touch event
	@type {Number}
	*/

	#touchContainerStartY = Number.MAX_VALUE;

	/**
	The constructor
	@param {WheelEventData} wheelEventData A reference to the WheelEventData Object
	*/

	constructor ( wheelEventData ) {
		Object.freeze ( this );
		this.#wheelEventData = wheelEventData;
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
					this.#wheelEventData.marginTop -= deltaY;
					this.#touchContainerStartY = touch.screenY;
					touchEvent.currentTarget.style.marginTop = String ( this.#wheelEventData.marginTop ) + 'px';
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
	A reference to the WheelEventData Object
	@type {WheelEventData}
	*/

	#wheelEventData;

	/**
	The constructor
	@param {WheelEventData} wheelEventData A reference to the WheelEventData Object
	*/

	constructor ( wheelEventData ) {
		Object.freeze ( this );
		this.#wheelEventData = wheelEventData;
	}

	/**
	Event listener method
	@param {Event} wheelEvent The event to handle
	*/

	handleEvent ( wheelEvent ) {
		wheelEvent.stopPropagation ( );
		if ( wheelEvent.deltaY ) {
			this.#wheelEventData.marginTop -= wheelEvent.deltaY * MOUSE_WHEEL_FACTORS [ wheelEvent.deltaMode ];
			wheelEvent.currentTarget.style.marginTop = String ( this.#wheelEventData.marginTop ) + 'px';
		}
	}
}

export {
	WheelEventData,
	ButtonHTMLElementClickEL,
	ButtonHTMLElementTouchEL,
	ButtonsHTMLElementTouchEL,
	ButtonsHTMLElementWheelEL
};

/* --- End of file --------------------------------------------------------------------------------------------------------- */