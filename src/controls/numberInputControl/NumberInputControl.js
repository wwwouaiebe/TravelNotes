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
import MouseAndTouchBaseEL from '../../mouseAndTouchEL/MouseAndTouchBaseEL.js';
import { ZERO } from '../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is a generic control with a input element for text
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class NumberInputControl extends BaseControl {

	/**
	The input HTMLElement
	@type {HTMLElement}
	*/

	#valueInput;

	/**
	The value input event listeners
	@type {MouseAndTouchBaseEL}
	*/

	#valueInputEL;

	/**
	The constructor
	@param {Object} options An object with the  options ( beforeText, value, min, max, datasetName, afterText )
	*/

	constructor ( options ) {
		super ( );
		theHTMLElementsFactory.create (
			'text',
			{
				value : options?.beforeText || ''
			},
			this.controlHTMLElement
		);
		this.#valueInput = theHTMLElementsFactory.create (
			'input',
			{
				type : 'number',
				className : 'TravelNotes-NumberInputControl-NumberInput',
				value : options?.value || ZERO,
				min : options?.min || ZERO,
				max : options?.max || Number.MAX_VALUE,
				dataset : { Name : options?.datasetName || 'NumberInputControl' }
			},
			this.controlHTMLElement
		);
		this.#valueInputEL = new MouseAndTouchBaseEL ( { preventDefaultTouchEvents : false } );
		this.#valueInputEL.addEventListeners ( this.#valueInput );
		theHTMLElementsFactory.create (
			'text',
			{
				value : options?.afterText || ''
			},
			this.controlHTMLElement
		);
	}

	/**
	The destructor
	*/

	destructor ( ) {
		this.#valueInputEL.removeEventListeners ( this.#valueInput );
		this.#valueInputEL = null;
	}

	/**
	The value in the control
	@type {String}
	*/

	get value ( ) { return Number.parseInt ( this.#valueInput.value ); }

	set value ( value ) { this.#valueInput.value = value; }

}

export default NumberInputControl;

/* --- End of file --------------------------------------------------------------------------------------------------------- */