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

import theDevice from '../core/lib/Device.js';
import theConfig from '../data/Config.js';
import { ZERO } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Base class for event listeners management
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class BaseEL {

	/**
	A reference to the target of the events listeners
	@type {HTMLElement}
	*/

	#target;

	/**
	The touchstart time stamp
	@type {Number}
	*/

	#lastTouchStartTimeStamp;

	/**
	The touchend time stamp
	@type {Number}
	*/

	#lastTouchEndTimeStamp;

	/**
	A guard set to true when a click event is detected by touch events
	@type {Boolean}
	*/

	#clickOccured;

	/**
	A guard set to true when a dblclick event is detected by touch events
	@type {Boolean}
	*/

	#dblClickOccured;

	/**
	The last touch end event
	@type {Event}
	*/

	#touchEndEvent;

	/**
	click event handler
	@param {Event} clickEvent The event to handle
	*/

	#handleClickEvent ( clickEvent ) {
		if ( theDevice.isTouch ) {
			return;
		}
		if ( this.handleClickEvent ) {
			clickEvent.preventDefault ( );
			clickEvent.stopPropagation ( );
			this.handleClickEvent ( clickEvent );
		}
	}

	/**
	dblclick event handler
	@param {Event} dblClickEvent The event to handle
	*/

	#handleDblClickEvent ( dblClickEvent ) {
		if ( theDevice.isTouch ) {
			return;
		}
		if ( this.handleDblClickEvent ) {
			dblClickEvent.preventDefault ( );
			dblClickEvent.stopPropagation ( );
			this.handleDblClickEvent ( dblClickEvent );
		}
	}

	/**
	contextmenu event handler
	@param {Event} contextMenuEvent The event to handle
	*/

	#handleContextMenuEvent ( contextMenuEvent ) {
		if ( theDevice.isTouch ) {
			return;
		}
		if ( this.handleContextMenuEvent ) {
			contextMenuEvent.preventDefault ( );
			contextMenuEvent.stopPropagation ( );
			this.handleContextMenuEvent ( contextMenuEvent );
		}
	}

	/**
	Click timer handler. Wait for a second click...
	*/

	#handleClickTimer ( ) {
		if ( this.#dblClickOccured && this.handleDblClickEvent ) {
			this.#touchEndEvent.preventDefault ( );
			this.#touchEndEvent.stopPropagation ( );
			this.handleDblClickEvent ( this.#touchEndEvent );
		}
		else if ( this.handleClickEvent ) {
			this.#touchEndEvent.preventDefault ( );
			this.#touchEndEvent.stopPropagation ( );
			this.handleClickEvent ( this.#touchEndEvent );
		}
		this.#clickOccured = false;
		this.#dblClickOccured = false;
	}

	/**
	touchstart event handler
	@param {Event} touchStartEvent The event to handle
	*/

	#handleTouchStartEvent ( touchStartEvent ) {
		touchStartEvent.preventDefault ( );
		touchStartEvent.stopPropagation ( );
		this.#lastTouchStartTimeStamp = touchStartEvent.timeStamp;
	}

	/**
	touchmove event handler
	@param {Event} touchMoveEvent The event to handle
	*/

	#handleTouchMoveEvent ( touchMoveEvent ) {
		touchMoveEvent.preventDefault ( );
		touchMoveEvent.stopPropagation ( );
	}

	/**
	touchend event handler
	@param {Event} touchEndEvent The event to handle
	*/

	#handleTouchEndEvent ( touchEndEvent ) {
		touchEndEvent.preventDefault ( );
		touchEndEvent.stopPropagation ( );
		this.#lastTouchEndTimeStamp = touchEndEvent.timeStamp;
		if (
			this.#lastTouchEndTimeStamp - this.#lastTouchStartTimeStamp < theConfig.events.clickDelay
			&& ! this.#clickOccured
		) {
			this.#clickOccured = true;
			this.#touchEndEvent = touchEndEvent;
			if ( this.handleDblClickEvent ) {
				setTimeout (
					// eslint-disable-next-line no-shadow
					( ) => { this.#handleClickTimer ( ); },
					theConfig.events.dblclickDelay
				);
			}
			else {
				this.#handleClickTimer ( );
			}
		}
		else if (
			this.#lastTouchEndTimeStamp - this.#lastTouchStartTimeStamp < theConfig.events.clickDelay
			&&
			this.#clickOccured
		) {
			this.#dblClickOccured = true;
			this.#touchEndEvent = touchEndEvent;
		}
		else if (
			this.#lastTouchEndTimeStamp - this.#lastTouchStartTimeStamp > theConfig.events.contextmenuDelay
			&&
			this.handleContextMenuEvent
		) {
			this.handleContextMenuEvent ( touchEndEvent );
		}
	}

	/**
	touchcancel event handler
	@param {Event} touchCancelEvent The event to handle
	*/

	#handleTouchCancelEvent ( touchCancelEvent ) {
		touchCancelEvent.preventDefault ( );
		touchCancelEvent.stopPropagation ( );
	}

	/**
	The constructor
	@param {HTMLElement} target A reference to the target of the events listeners
	*/

	constructor ( target ) {
		Object.freeze ( this );
		this.#target = target;
		this.#lastTouchStartTimeStamp = ZERO;
		this.#lastTouchEndTimeStamp = ZERO;
		this.#clickOccured = false;
		this.#dblClickOccured = false;
		this.#touchEndEvent = null;
	}

	/**
	Add the event listeners to the target
	*/

	addEventListeners ( ) {
		this.#target.addEventListener ( 'touchstart', this );
		this.#target.addEventListener ( 'touchmove', this );
		this.#target.addEventListener ( 'touchend', this );
		this.#target.addEventListener ( 'touchcancel', this );
		if ( this.handleClickEvent ) {
			this.#target.addEventListener ( 'click', this );
		}
		if ( this.handleDblClickEvent ) {
			this.#target.addEventListener ( 'dblclick', this );
		}
		if ( this.handleContextMenuEvent ) {
			this.#target.addEventListener ( 'contextmenu', this );
		}
	}

	/**
	remove the event listeners from the target
	*/

	removeEventListeners ( ) {
		this.#target.removeEventListener ( 'touchstart', this );
		this.#target.removeEventListener ( 'touchmove', this );
		this.#target.removeEventListener ( 'touchend', this );
		this.#target.removeEventListener ( 'touchcancel', this );
		if ( this.handleClickEvent ) {
			this.#target.removeEventListener ( 'click', this );
		}
		if ( this.handleDblClickEvent ) {
			this.#target.removeEventListener ( 'dblclick', this );
		}
		if ( this.handleContextMenuEvent ) {
			this.#target.removeEventListener ( 'contextmenu', this );
		}
	}

	/**
	Event listener method for touch events
	@param {Event} touchEvent The event to handle
	*/

	#handleTouchEvent ( touchEvent ) {
		switch ( touchEvent.type ) {
		case 'touchstart' :
			this.#handleTouchStartEvent ( touchEvent );
			break;
		case 'touchmove' :
			this.#handleTouchMoveEvent ( touchEvent );
			break;
		case 'touchend' :
			this.#handleTouchEndEvent ( touchEvent );
			break;
		case 'touchcancel' :
			this.#handleTouchCancelEvent ( touchEvent );
			break;
		default :
			break;
		}
	}

	/**
	Event listener method
	@param {Event} handledEvent The event to handle
	*/

	handleEvent ( handledEvent ) {
		switch ( handledEvent.type ) {
		case 'click' :
			this.#handleClickEvent ( handledEvent );
			break;
		case 'dblclick' :
			this.#handleDblClickEvent ( handledEvent );
			break;
		case 'contextmenu' :
			this.#handleContextMenuEvent ( handledEvent );
			break;
		default :
			this.#handleTouchEvent ( handledEvent );
			break;
		}
	}
}

export default BaseEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */