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

import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import ColorButtonsControlElement from '../colorControl/ColorButtonsControlElement.js';
import RedSliderControlElement from '../colorControl/RedSliderControlElement.js';
import RgbInputsControlElement from '../colorControl/RgbInputsControlElement.js';
import SampleControlElement from '../colorControl/SampleControlElement.js';
import { ZERO } from '../main/Constants.js';
import Color from './Color.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
html control for color selection
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ColorControl {

	/**
	the main HTMLElement
	@type {HTMLElement}
	*/

	#colorHTMLElement;

	#colorButtonsControlElement;

	#redSliderControlElement;

	#rgbInputsControlElement;

	#sampleControlElement;

	/**
	constructor
	@param {String} cssColor The initial color for the control (must be #RRGGBB or rgb(RR, GG, BB) .
	*/

	constructor ( cssColor ) {
		Object.freeze ( this );
		this.#colorHTMLElement = theHTMLElementsFactory.create (
			'div',
			{
				id : 'TravelNotes-ColorControl-ColorHTMLElement'
			}
		);

		this.#colorButtonsControlElement = new ColorButtonsControlElement ( this );
		this.#colorButtonsControlElement.red = ZERO;
		this.#redSliderControlElement = new RedSliderControlElement ( this );
		this.#rgbInputsControlElement = new RgbInputsControlElement ( this );
		this.#rgbInputsControlElement.cssColor = cssColor;
		this.#sampleControlElement = new SampleControlElement ( this );
		this.#sampleControlElement.cssColor = cssColor;
	}

	/**
	Remove event listeners
	*/

	destructor ( ) {
		this.#colorButtonsControlElement.destructor ( );
		this.#redSliderControlElement.destructor ( );
		this.#rgbInputsControlElement.destructor ( );
	}

	/**
	An array with the HTML element of the control
	@type {Array.<HTMLElement>}
	*/

	get HTMLElements ( ) { return [ this.#colorHTMLElement ]; }

	/**
	The color selected in the control in the css hex format ( #rrggbb )
	@type {String}
	*/

	get cssColor ( ) {
		return Color.fromCss ( this.#sampleControlElement.cssColor ).cssColor;
	}

	get color ( ) {
		return Color.fromCss ( this.#sampleControlElement.cssColor );
	}

	onRedSliderInput ( red ) {
		this.#colorButtonsControlElement.red = red;
	}

	onColorButtonClick ( cssColor ) {
		this.#rgbInputsControlElement.cssColor = cssColor;
		this.#sampleControlElement.cssColor = cssColor;
	}

	onRgbInput ( color ) {
		this.#sampleControlElement.cssColor = color.cssColor;
	}
}

export default ColorControl;

/* --- End of file --------------------------------------------------------------------------------------------------------- */