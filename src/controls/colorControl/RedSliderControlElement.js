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

import theHTMLElementsFactory from '../../core/uiLib/HTMLElementsFactory.js';
import RedSliderInputEL from './RedSliderInputEL.js';
import Color from './Color.js';
import { ZERO } from '../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The element with the 36 color buttons
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class RedSliderControlElement {

	/**
	The red slider
	@type {HTMLElement}
	*/

	#redSliderInput;

	/**
	The input red slider event listener
	@type {RedSliderInputEL}
	*/

	#redSliderInputEL;

	/**
	The max value of the slider
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #SLIDER_MAX_VALUE ( ) { return 100; }

	/**
	The step value of the slider
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #SLIDER_STEP ( ) { return 20; }

	/**
	The constructor
	@param {ColorControl} colorControl A reference to the color control
	*/

	constructor ( colorControl ) {
		this.#redSliderInputEL = new RedSliderInputEL (
			colorControl,
			Color.MAX_COLOR / RedSliderControlElement.#SLIDER_MAX_VALUE
		);
		this.#redSliderInput = theHTMLElementsFactory.create ( 'input',
			{
				type : 'range',
				value : ZERO,
				min : ZERO,
				max : RedSliderControlElement.#SLIDER_MAX_VALUE,
				step : RedSliderControlElement.#SLIDER_STEP

			},
			theHTMLElementsFactory.create ( 'div', null, colorControl.HTMLElements [ ZERO ] )
		);
		this.#redSliderInput.addEventListener ( 'input', this.#redSliderInputEL, false );
		this.#redSliderInput.focus ( );
	}

	/**
	The destructor
	*/

	destructor ( ) {
		this.#redSliderInput.removeEventListener ( 'input', this.#redSliderInputEL, false );
		this.#redSliderInputEL = null;
	}
}

export default RedSliderControlElement;

/* --- End of file --------------------------------------------------------------------------------------------------------- */