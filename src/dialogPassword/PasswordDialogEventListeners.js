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
	- v4.0.0:
		- Issue ♯40 : The eye button of the password dialog don't work on touch devices
Doc reviewed 20210914
Tests ...
*/

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
mousedown and touchstart event listener for the eye button of the password dialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class EyeMouseDownEL {

	/**
	A reference to the password input of the dialogPassword
	@type {HTMLElement}
	*/

	#passwordInput = null;

	/**
	The constructor
	@param {HTMLElement} passwordInput A reference to the password input of the dialogPassword
	*/

	constructor ( passwordInput ) {
		Object.freeze ( this );
		this.#passwordInput = passwordInput;
	}

	/**
	Event listener method
	@param {Event} mouseDownOrTouchStartEvent The event to handle
	*/

	handleEvent ( mouseDownOrTouchStartEvent ) {
		mouseDownOrTouchStartEvent.currentTarget.textContent = '👀';
		mouseDownOrTouchStartEvent.preventDefault ( );
		mouseDownOrTouchStartEvent.stopPropagation ( );
		this.#passwordInput.type = 'text';
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
mouseup and touchend event listener for the eye button of the password dialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class EyeMouseUpEL {

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
		Object.freeze ( this );
		this.#passwordInput = passwordInput;
	}

	/**
	Event listener method
	@param {Event} mouseUpOrTouchEndEvent The event to handle
	*/

	handleEvent ( mouseUpOrTouchEndEvent ) {
		mouseUpOrTouchEndEvent.currentTarget.textContent = '👁️';
		mouseUpOrTouchEndEvent.preventDefault ( );
		mouseUpOrTouchEndEvent.stopPropagation ( );
		this.#passwordInput.type = 'password';
		this.#passwordInput.focus ( );
	}
}

export { EyeMouseDownEL, EyeMouseUpEL };

/* --- End of file --------------------------------------------------------------------------------------------------------- */