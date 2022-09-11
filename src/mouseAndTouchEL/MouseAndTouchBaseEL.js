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

import theConfig from '../data/Config.js';
import { NOT_FOUND, ZERO, TWO } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Base class for event listeners management
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class MouseAndTouchBaseEL {

	/**
	Options for the event listeners
	@type {Object}
	*/

	#options;

	/**
	The X position on the screen of the touchstart event
	@type {Number}
	*/

	#startScreenX;

	/**
	The Y position on the screen of the touchstart event
	@type {Number}
	*/

	#startScreenY;

	/**
	An array with the event types handled
	@type {Array.<String>}
	*/

	#eventTypes = [];

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
	The maximum distance on the screen between the touchstart and touchend event
	for the events will be considered as a click event
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	get #MAX_CLICK_DISTANCE ( ) { return 10; }

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
		this.#lastTouchStartTimeStamp = touchStartEvent.timeStamp;
		if ( this.handleTouchStartEvent ) {
			this.handleTouchStartEvent ( touchStartEvent );
			return;
		}

		const touch = touchStartEvent.changedTouches.item ( ZERO );
		this.#startScreenX = touch.screenX;
		this.#startScreenY = touch.screenY;
	}

	/**
	touchmove event handler
	@param {Event} touchMoveEvent The event to handle
	*/

	#handleTouchMoveEvent ( touchMoveEvent ) {
		if ( this.handleTouchMoveEvent ) {
			this.handleTouchMoveEvent ( touchMoveEvent );
		}
	}

	/**
	touchend event handler
	@param {Event} touchEndEvent The event to handle
	*/

	#handleTouchEndEvent ( touchEndEvent ) {
		if ( this.handleTouchEndEvent ) {
			this.handleTouchEndEvent ( touchEndEvent );
			return;
		}

		const touch = touchEndEvent.changedTouches.item ( ZERO );
		if (
			Math.sqrt (
				( ( touch.screenX - this.#startScreenX ) ** TWO ) +
				( ( touch.screenY - this.#startScreenY ) ** TWO )
			)
			>
			this.#MAX_CLICK_DISTANCE
		) {
			return;
		}

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
		if ( this.handleTouchCancelEvent ) {
			this.handleTouchCancelEvent ( touchCancelEvent );
		}
	}

	/**
	The constructor
	@param {?Object} options an object with options for the event listener
	*/

	constructor ( options ) {
		Object.freeze ( this );
		this.#options = Object.freeze (
			{
				stopPropagationTouchEvents : options?.stopPropagationTouchEvents ?? true,
				stopPropagationMouseEvents : options?.stopPropagationMouseEvents ?? true,
				preventDefaultTouchEvents : options?.preventDefaultTouchEvents ?? true,
				preventDefaultMouseEvents : options?.preventDefaultMouseEvents ?? true
			}
		);
		this.#lastTouchStartTimeStamp = ZERO;
		this.#lastTouchEndTimeStamp = ZERO;
		this.#clickOccured = false;
		this.#dblClickOccured = false;
		this.#touchEndEvent = null;
	}

	/**
	An array with the event types handled
	*/

	set eventTypes ( eventTypes ) { this.#eventTypes = eventTypes; }

	/**
	Add the event listeners to the target
	@param {HTMLElement} target The  event target
	*/

	addEventListeners ( target ) {
		[ 'touchstart', 'touchmove', 'touchend', 'touchcancel' ].forEach (
			eventType => target.addEventListener ( eventType, this )
		);
		this.#eventTypes.forEach (
			eventType => target.addEventListener ( eventType, this )
		);
	}

	/**
	remove the event listeners from the target
	@param {HTMLElement} target The  event target
	*/

	removeEventListeners ( target ) {
		[ 'touchstart', 'touchmove', 'touchend', 'touchcancel' ].forEach (
			eventType => target.removeEventListener ( eventType, this )
		);
		this.#eventTypes.forEach (
			eventType => target.removeEventListener ( eventType, this )
		);
	}

	/**
	Event listener methods for mouse events
	@param {Event} handledEvent The event to handle
	*/

	#handleMouseEvents ( handledEvent ) {
		if ( this.#options.stopPropagationMouseEvents ) {
			handledEvent.stopPropagation ( );
		}
		switch ( handledEvent.type ) {
		case 'click' :
			if ( this.#options.preventDefaultMouseEvents ) {
				handledEvent.preventDefault ( );
			}
			this.handleClickEvent ( handledEvent );
			break;
		case 'contextmenu' :
			if ( this.#options.preventDefaultMouseEvents ) {
				handledEvent.preventDefault ( );
			}
			this.handleContextMenuEvent ( handledEvent );
			break;
		case 'mouseenter' :
			if ( this.#options.preventDefaultMouseEvents ) {
				handledEvent.preventDefault ( );
			}
			this.handleMouseEnterEvent ( handledEvent );
			break;
		case 'mouseleave' :
			if ( this.#options.preventDefaultMouseEvents ) {
				handledEvent.preventDefault ( );
			}
			this.handleMouseLeaveEvent ( handledEvent );
			break;
		case 'mousedown' :
			this.handleMouseDownEvent ( handledEvent );
			break;
		case 'mousemove' :
			this.handleMouseMoveEvent ( handledEvent );
			break;
		case 'mouseup' :
			this.handleMouseUpEvent ( handledEvent );
			break;
		case 'wheel' :
			if ( this.#options.preventDefaultMouseEvents ) {
				handledEvent.preventDefault ( );
			}
			this.handleWheelEvent ( handledEvent );
			break;
		case 'dragstart' :
			this.handleDragStartEvent ( handledEvent );
			break;
		case 'dragover' :
			this.handleDragOverEvent ( handledEvent );
			break;
		case 'dragend' :
			this.handleDragEndEvent ( handledEvent );
			break;
		default :
			break;
		}
	}

	/**
	Event listener methods for touch events
	@param {Event} handledEvent The event to handle
	*/

	#handleTouchEvents ( handledEvent ) {
		if ( this.#options.stopPropagationTouchEvents ) {
			handledEvent.stopPropagation ( );
		}
		if ( this.#options.preventDefaultTouchEvents ) {
			handledEvent.preventDefault ( );
		}
		switch ( handledEvent.type ) {
		case 'touchstart' :
			this.#handleTouchStartEvent ( handledEvent );
			break;
		case 'touchmove' :
			this.#handleTouchMoveEvent ( handledEvent );
			break;
		case 'touchend' :
			this.#handleTouchEndEvent ( handledEvent );
			break;
		case 'touchcancel' :
			this.#handleTouchCancelEvent ( handledEvent );
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

		if ( NOT_FOUND === this.#eventTypes.indexOf ( handledEvent.type ) ) {
			this.#handleTouchEvents ( handledEvent );
		}
		else {
			this.#handleMouseEvents ( handledEvent );
		}
	}
}

export default MouseAndTouchBaseEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */