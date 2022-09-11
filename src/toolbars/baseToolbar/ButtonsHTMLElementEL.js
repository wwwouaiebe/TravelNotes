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

import { ZERO, ONE, MOUSE_WHEEL_FACTORS } from '../../main/Constants.js';
import MouseAndTouchBaseEL from '../../mouseAndTouchEL/MouseAndTouchBaseEL.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
click event listener on the toolbar buttons
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ButtonsHTMLElementEL extends MouseAndTouchBaseEL {

	/**
	A reference to the BaseToolbar object
	@type {BaseToolbar}
	*/

	#baseToolbar;

	/**
	The Y position of the previous touch event
	@type {Number}
	*/

	#touchContainerStartY;

	/**
	the constructor
	@param {BaseToolbar} baseToolbar A reference to the BaseToolbar object
	*/

	constructor ( baseToolbar ) {
		super ( );
		this.#baseToolbar = baseToolbar;
		this.eventTypes = [ 'wheel', 'mouseenter', 'mouseleave' ];
	}

	/**
	touchstart event listener method
	@param {Event} touchStartEvent The event to handle
	*/

	handleTouchStartEvent ( touchStartEvent ) {
		if ( ONE === touchStartEvent.changedTouches.length ) {
			const touch = touchStartEvent.changedTouches.item ( ZERO );
			this.#touchContainerStartY = touch.screenY;
		}

	}

	/**
	touchmove event listener method
	@param {Event} touchMoveEvent The event to handle
	*/

	handleTouchMoveEvent ( touchMoveEvent ) {
		if ( ONE === touchMoveEvent.changedTouches.length ) {
			const touch = touchMoveEvent.changedTouches.item ( ZERO );
			const deltaY = this.#touchContainerStartY - touch.screenY;
			touchMoveEvent.currentTarget.scrollTop += deltaY;
			this.#touchContainerStartY = touch.screenY;
		}
	}

	/**
	touchend event listener method
	@param {Event} touchEndEvent The event to handle
	*/

	handleTouchEndEvent ( touchEndEvent ) {
		this.handleTouchMoveEvent ( touchEndEvent );
		this.#touchContainerStartY = Number.MAX_VALUE;
	}

	/**
	touchcancel event listener
	*/

	handleTouchCancelEvent ( ) {
		this.#touchContainerStartY = Number.MAX_VALUE;
	}

	/**
	Click event listener
	@param {Event} wheelEvent The event to handle
	*/

	handleWheelEvent ( wheelEvent ) {
		if ( wheelEvent.deltaY ) {
			wheelEvent.currentTarget.scrollTop +=
				wheelEvent.deltaY * MOUSE_WHEEL_FACTORS [ wheelEvent.deltaMode ];
		}
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

export default ButtonsHTMLElementEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */