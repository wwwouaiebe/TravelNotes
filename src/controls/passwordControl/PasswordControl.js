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

import BaseControl from '../baseControl/BaseControl.js';
import theHTMLElementsFactory from '../../core/uiLib/HTMLElementsFactory.js';
import EyePointerDownEL from './EyePointerDownEL.js';
import EyePointerUpEL from './EyePointerUpEL.js';

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
	pointerdown event listener
	@type {EyePointerDownEL}
	*/

	#eyePointerDownEL;

	/**
	pointerup event listener
	@type {EyePointerUpEL}
	*/

	#eyePointerUpEL;

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
				id : 'travelnotes-password-control-eye',
				textContent : '👁️'
			},
			this.controlHTMLElement
		);

		// Event listeners
		this.#eyePointerDownEL = new EyePointerDownEL ( this.#passwordInput );
		this.#eyePointerUpEL = new EyePointerUpEL ( this.#passwordInput );
		this.#eyeSpan.addEventListener ( 'pointerdown', this.#eyePointerDownEL, false );
		this.#eyeSpan.addEventListener ( 'pointerup', this.#eyePointerUpEL,	false );
		this.#eyeSpan.addEventListener ( 'pointerleave', this.#eyePointerUpEL,	false );
		this.#passwordInput.focus ( );
	}

	/**
	Remove event listeners
	*/

	destructor ( ) {
		this.#eyeSpan.removeEventListener ( 'pointerdown', this.#eyePointerDownEL, false );
		this.#eyeSpan.removeEventListener ( 'pointerup', this.#eyePointerUpEL,	false );
		this.#eyeSpan.removeEventListener ( 'pointerleave', this.#eyePointerUpEL,	false );
		this.#eyePointerDownEL = null;
		this.#eyePointerUpEL = null;
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