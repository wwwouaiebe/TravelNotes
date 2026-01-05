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

import theHTMLElementsFactory from '../../core/uiLib/HTMLElementsFactory.js';
import ColorButtonsControlElement from './ColorButtonsControlElement.js';
import RedSliderControlElement from './RedSliderControlElement.js';
import RgbInputsControlElement from './RgbInputsControlElement.js';
import SampleControlElement from './SampleControlElement.js';
import { ZERO } from '../../main/Constants.js';
import Color from './Color.js';
import BaseControl from '../baseControl/BaseControl.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
html control for color selection
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ColorControl extends BaseControl {

	/**
	The element with the color buttons
	@type {HTMLElement}
	*/

	#colorButtonsControlElement;

	/**
	The element with the red slider
	@type {HTMLElement}
	*/

	#redSliderControlElement;

	/**
	The element with the r, g, and b inputs
	@type {HTMLElement}
	*/

	#rgbInputsControlElement;

	/**
	The element with the sample color
	@type {HTMLElement}
	*/

	#sampleControlElement;

	/**
	constructor
	@param {Object} options An object with the  options ( headerText, cssColor )
	*/

	constructor ( options ) {
		super ( );
		if ( options?.headerText && '' !== options.headerText ) {
			theHTMLElementsFactory.create (
				'div',
				{
					textContent : options.headerText
				},
				this.controlHTMLElement
			);
		}
		this.controlHTMLElement.classList.add ( 'travelnotes-color-control-container' );
		this.#colorButtonsControlElement = new ColorButtonsControlElement ( this );
		this.#colorButtonsControlElement.red = ZERO;
		this.#redSliderControlElement = new RedSliderControlElement ( this );
		this.#rgbInputsControlElement = new RgbInputsControlElement ( this );
		this.#rgbInputsControlElement.cssColor = options?.cssColor || '#ff0000';
		this.#sampleControlElement = new SampleControlElement ( this );
		this.#sampleControlElement.cssColor = options?.cssColor || '#ff0000';
	}

	/**
	The destructor.
	*/

	destructor ( ) {
		this.#colorButtonsControlElement.destructor ( );
		this.#redSliderControlElement.destructor ( );
		this.#rgbInputsControlElement.destructor ( );
	}

	/**
	The color selected in the control in the css hex format ( #rrggbb )
	@type {String}
	*/

	get cssColor ( ) {

		// It's needed to convert from cssColor to Color and then to cssColor because we need a css hex format #rrggbb
		return Color.fromCss ( this.#sampleControlElement.cssColor ).cssColor;
	}

	/**
	Change the red component of the color buttons, according to the red slider value.
	Called by the RedSliderInputEL.handleEvent ( ) method
	@param {Number} red The value of the red component
	*/

	onRedSliderInput ( red ) {
		this.#colorButtonsControlElement.red = red;
	}

	/**
	Change the value of the r, g and b inputs according to the given cssColor
	Change the sample color according to the given css color
	Called by the ColorButtonClickEL.handleEvent method
	@param {String} cssColor The color to use in the css format
	*/

	onColorButtonClick ( cssColor ) {
		this.#rgbInputsControlElement.cssColor = cssColor;
		this.#sampleControlElement.cssColor = cssColor;
	}

	/**
	Change the sample color according to the given Color
	@param {String} cssColor The css color to use
	*/

	onRgbInput ( cssColor ) {
		this.#sampleControlElement.cssColor = cssColor;
	}
}

export default ColorControl;

/* --- End of file --------------------------------------------------------------------------------------------------------- */