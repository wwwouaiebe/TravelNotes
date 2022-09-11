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

import MouseAndTouchBaseEL from '../../mouseAndTouchEL/MouseAndTouchBaseEL.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
touchstart, touchend, mouseup and touchend event listener for the eye button of the password dialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class EyeEL extends MouseAndTouchBaseEL {

	/**
	A reference to the password input of the dialogPassword
	@type {HTMLElement}
	*/

	#passwordInput;

	/**
	The constructor
	@param {HTMLElement} passwordInput A reference to the password input of the dialogPassword
	*/

	constructor ( passwordInput ) {
		super ( );
		this.#passwordInput = passwordInput;
		this.eventTypes = [ 'mouseup', 'mousedown', 'mouseleave' ];
	}

	/**
	Show the password
	@param {Event} mouseOrTouchEvent The event that have triggerd the mathod
	*/

	#showPassword ( mouseOrTouchEvent ) {
		mouseOrTouchEvent.currentTarget.textContent = '👀';
		this.#passwordInput.type = 'text';
	}

	/**
	Hide the password
	@param {Event} mouseOrTouchEvent The event that have triggerd the mathod
	*/

	#hidePassword ( mouseOrTouchEvent ) {
		mouseOrTouchEvent.currentTarget.textContent = '👁️';
		this.#passwordInput.type = 'password';
		this.#passwordInput.focus ( );
	}

	/**
	touch start event listener
	@param {Event} touchStartEvent The event to handle
	*/

	handleTouchStartEvent ( touchStartEvent ) {
		this.#showPassword ( touchStartEvent );
	}

	/**
	touchend event listener
	@param {Event} touchEndEvent The event to handle
	*/

	handleTouchEndEvent ( touchEndEvent ) {
		this.#hidePassword ( touchEndEvent );
	}

	/**
	mouse down event listener
	@param {Event} mouseDownEvent The event to handle
	*/

	handleMouseDownEvent ( mouseDownEvent ) {
		this.#showPassword ( mouseDownEvent );
	}

	/**
	mouse up event listener
	@param {Event} mouseUpEvent The event to handle
	*/

	handleMouseUpEvent ( mouseUpEvent ) {
		this.#hidePassword ( mouseUpEvent );
	}

	/**
	mouse leave event listener
	@param {Event} mouseLeaveEvent The event to handle
	*/

	handleMouseLeaveEvent ( mouseLeaveEvent ) {
		this.#hidePassword ( mouseLeaveEvent );
	}

}

export default EyeEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */