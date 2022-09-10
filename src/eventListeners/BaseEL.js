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
import { NOT_FOUND, ZERO } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Base class for event listeners management
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class BaseEL {

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
	A flag indicating when the event have to be propagated to the parent HTMLElements
	@type {Boolean}
	*/

	#propagate;

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
		}
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
	@param {?Boolean} propagate a flag indicating when the event have to be propagated to the parent HTMLElements
	*/

	constructor ( propagate ) {
		Object.freeze ( this );
		this.#lastTouchStartTimeStamp = ZERO;
		this.#lastTouchEndTimeStamp = ZERO;
		this.#clickOccured = false;
		this.#dblClickOccured = false;
		this.#touchEndEvent = null;
		this.#propagate = Boolean ( propagate );
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
	Event listener method
	@param {Event} handledEvent The event to handle
	*/

	handleEvent ( handledEvent ) {

		handledEvent.preventDefault ( );
		if ( ! this.#propagate ) {
			handledEvent.stopPropagation ( );
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
		if ( NOT_FOUND === this.#eventTypes.indexOf ( handledEvent.type ) ) {
			return;
		}
		switch ( handledEvent.type ) {
		case 'click' :
			this.handleClickEvent ( handledEvent );
			break;
		case 'contextmenu' :
			this.handleContextMenuEvent ( handledEvent );
			break;
		case 'mouseenter' :
			this.handleMouseEnterEvent ( handledEvent );
			break;
		case 'mouseleave' :
			this.handleMouseLeaveEvent ( handledEvent );
			break;
		case 'wheel' :
			this.handleWheelEvent ( handledEvent );
			break;
		default :
			break;
		}
	}
}

export default BaseEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */