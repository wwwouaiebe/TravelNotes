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

import BaseControl from '../baseControl/BaseControl.js';
import theHTMLElementsFactory from '../../core/uiLib/HTMLElementsFactory.js';
import EyeMouseDownEL from './EyeMouseDownEL.js';
import EyeMouseUpEL from './EyeMouseUpEL.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is a generic control with a input element for password
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class PasswordControl extends BaseControl {

	/**
	the password html input
	@type {HTMLElement}
	*/

	#passwordInput;

	/** the eye html span
	@type {HTMLElement}
	*/

	#eyeSpan;

	/**
	mouseDown event listener
	@type {EyeMouseDownEL}
	*/

	#eyeMouseDownEL;

	/**
	mouseup event listener
	@type {EyeMouseUpEL}
	*/

	#eyeMouseUpEL;

	/**
	The constructor
	@param {Object} options An object with the  options ( datasetName )
	*/

	constructor ( options ) {
		super ( );
		this.#passwordInput = theHTMLElementsFactory.create (
			'input',
			{
				type : 'password',
				dataset : { Name : options?.datasetName || 'PasswordControl' }
			},
			this.controlHTMLElement
		);
		this.#eyeSpan = theHTMLElementsFactory.create (
			'span',
			{
				id : 'TravelNotes-PasswordControl-EyeSpan',
				textContent : '👁️'
			},
			this.controlHTMLElement
		);

		// Event listeners
		this.#eyeMouseDownEL = new EyeMouseDownEL ( this.#passwordInput );
		this.#eyeMouseUpEL = new EyeMouseUpEL ( this.#passwordInput );
		this.#eyeSpan.addEventListener ( 'mousedown', this.#eyeMouseDownEL, false );
		this.#eyeSpan.addEventListener ( 'touchstart', this.#eyeMouseDownEL, false );
		this.#eyeSpan.addEventListener ( 'mouseup', this.#eyeMouseUpEL,	false );
		this.#eyeSpan.addEventListener ( 'touchend', this.#eyeMouseUpEL, false );
		this.#passwordInput.focus ( );
	}

	/**
	Remove event listeners
	*/

	destructor ( ) {
		this.#eyeSpan.removeEventListener ( 'mousedown', this.#eyeMouseDownEL, false );
		this.#eyeSpan.removeEventListener ( 'touchstart', this.#eyeMouseDownEL, false );
		this.#eyeSpan.removeEventListener ( 'mouseup', this.#eyeMouseUpEL,	false );
		this.#eyeSpan.removeEventListener ( 'touchend', this.#eyeMouseUpEL, false );
		this.#eyeMouseDownEL = null;
		this.#eyeMouseUpEL = null;
	}

	/**
	The value in the control
	@type {String}
	*/

	get value ( ) { return this.#passwordInput.value; }

	/**
	set the focus on the password input
	*/

	focus ( ) {
		this.#passwordInput.focus ( );
	}
}

export default PasswordControl;

/* --- End of file --------------------------------------------------------------------------------------------------------- */