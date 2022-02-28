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
Doc reviewed 20210914
Tests ...
*/

import { ZERO, ONE, TWO, NOT_FOUND } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
mouse event listener for the target. Redispath the mouse events as leftpan or rightpan or middlepan events
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class MouseEL {

	/**
	A flag set to true when a pan is ongoing
	@type {Boolean}
	*/

	#panOngoing = false;

	/**
	The X screen coordinate of the beginning of the pan
	@type {Number}
	*/

	#startPanX = ZERO;

	/**
	The Y screen coordinate of the beginning of the pan
	@type {Number}
	*/

	#startPanY = ZERO;

	/**
	The target of the event
	@type {HTMLElement}
	*/

	#target = null;

	/**
	The mouse button to use
	@type {Number}
	*/

	#button = ZERO;

	/**
	The type of the event that have to be dispatched
	@type {String}
	*/

	#eventType = '';

	/**
	Redispatch the events as pan events
	@param {Event} mouseEvent The initial event
	@param {String} action The action of the pan ( = 'start', 'move' or 'end')

	*/

	#dispatchEvent ( mouseEvent, action ) {
		const panEvent = new Event ( this.#eventType );
		panEvent.startX = this.#startPanX;
		panEvent.startY = this.#startPanY;
		panEvent.endX = mouseEvent.screenX;
		panEvent.endY = mouseEvent.screenY;
		panEvent.clientX = mouseEvent.clientX;
		panEvent.clientY = mouseEvent.clientY;
		panEvent.action = action;
		this.#target.dispatchEvent ( panEvent );
	}

	/**
	The constructor
	@param {HTMLElement} target The target for the event listener
	@param {Number} button The button used. must be PanEventDispatcher.LEFT_BUTTON or PanEventDispatcher.MIDDLE_BUTTON
	or PanEventDispatcher.RIGHT_BUTTON. Default value: PanEventDispatcher.LEFT_BUTTON
	*/

	constructor ( target, button ) {
		Object.freeze ( this );
		this.#target = target;
		this.#button = button;
		switch ( button ) {
		case ZERO :
			this.#eventType = 'leftpan';
			break;
		case ONE :
			this.#eventType = 'middlepan';
			break;
		case TWO :
			this.#eventType = 'rightpan';
			break;
		default :
			this.#button = NOT_FOUND;
			break;
		}
	}

	/**
	Event listener method
	@param {Event} mouseEvent The event to handle
	*/

	handleEvent ( mouseEvent ) {
		switch ( mouseEvent.type ) {
		case 'mousedown' :
			if (
				mouseEvent.button === this.#button
				&&
				mouseEvent.target === this.#target
			) {
				this.#startPanX = mouseEvent.screenX;
				this.#startPanY = mouseEvent.screenY;
				this.#panOngoing = true;
				this.#dispatchEvent ( mouseEvent, 'start' );
			}
			break;
		case 'mouseup' :
			if (
				mouseEvent.button === this.#button
				&&
				this.#panOngoing
				&&
				( this.#startPanX !== mouseEvent.screenX || this.#startPanY !== mouseEvent.screenY )
			) {
				this.#dispatchEvent ( mouseEvent, 'end' );
			}
			this.#panOngoing = false;
			break;
		case 'mousemove' :
			if ( this.#panOngoing ) {
				if ( document.selection ) {
					document.selection.empty ();
				}
				else {
					window.getSelection ().removeAllRanges ();
				}
				this.#dispatchEvent ( mouseEvent, 'move' );
			}
			break;
		default :
			break;
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Listen mouse event from an object and redispath the mouse events as leftpan or rightpan or middlepan events
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class PanEventDispatcher {

	/**
	The target of the event dispatcher
	@type {HTMLElement}
	*/

	#target;

	/**
	The mouse event listener that is added to the target and that redispatch the event
	@type {MouseEL}
	*/

	#eventListener;

	/**
	constant for the left button
	@type {Number}
	*/

	static get LEFT_BUTTON ( ) { return ZERO; }

	/**
	constant for the middle button
	@type {Number}
	*/

	static get MIDDLE_BUTTON ( ) { return ONE; }

	/**
	constant for the right button
	@type {Number}
	*/

	static get RIGHT_BUTTON ( ) { return TWO; }

	/**
	The constructor
	@param {HTMLElement} target The target for the event dispatcher
	@param {Number} button The button to use. must be PanEventDispatcher.LEFT_BUTTON or PanEventDispatcher.MIDDLE_BUTTON
	or PanEventDispatcher.RIGHT_BUTTON. Default value: PanEventDispatcher.LEFT_BUTTON
	*/

	constructor ( target, button ) {
		this.#target = target;
		this.#eventListener = new MouseEL ( target, button ?? ZERO );
		this.#target.addEventListener ( 'mousedown', this.#eventListener );
		this.#target.addEventListener ( 'mouseup', this.#eventListener );
		this.#target.addEventListener ( 'mousemove', this.#eventListener );
	}

	/**
	Detach the event dispatcher when not needed anymore, so the memory can be released
	*/

	detach ( ) {
		this.#target.removeEventListener ( 'mousedown', this.#eventListener );
		this.#target.removeEventListener ( 'mouseup', this.#eventListener );
		this.#target.removeEventListener ( 'mousemove', this.#eventListener );
		this.#eventListener = null;
		this.#target = null;
	}
}

export default PanEventDispatcher;

/* --- End of file --------------------------------------------------------------------------------------------------------- */