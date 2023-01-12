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

export default EyeMouseDownEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */