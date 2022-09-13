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
import EyeEL from './EyeEL.js';
import TouchInputEL from '../../mouseAndTouchEL/TouchInputEL.js';

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
	The eye event listeners
	@type {EyeEL}
	*/

	#eyeEL;

	/**
	The password input event listeners
	@type {MouseAndTouchBaseEL}
	*/

	#passwordInputEL;

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
		this.#passwordInputEL = new TouchInputEL ( );
		this.#passwordInputEL.addEventListeners ( this.#passwordInput );

		this.#eyeSpan = theHTMLElementsFactory.create (
			'span',
			{
				id : 'TravelNotes-PasswordControl-EyeSpan',
				textContent : '👁️'
			},
			this.controlHTMLElement
		);
		this.#eyeEL = new EyeEL ( this.#passwordInput );
		this.#eyeEL.addEventListeners ( this.#eyeSpan );
		this.#passwordInput.focus ( );
	}

	/**
	Remove event listeners
	*/

	destructor ( ) {
		this.#eyeEL.removeEventListeners ( this.#eyeSpan );
		this.#eyeEL = null;
		this.#passwordInputEL.removeEventListeners ( this.#passwordInput );
		this.#passwordInputEL = null;
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