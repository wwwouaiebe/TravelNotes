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
		- Created
Doc reviewed 20220829
Tests ...
*/

import theTranslator from '../UILib/Translator.js';
import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import Color from '../colorControl/Color.js';
import { ZERO } from '../main/Constants.js';
import RgbInputEL from '../colorControl/RgbInputEL.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The element with the 3 color inputs HTMLElements
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class RgbInputsControlElement {

	/**
	The main HTMLElement
	@type {HTMLElement}
	*/

	#rgbHTMLElement;

	/**
	The red input HTMLElement
	@type {HTMLElement}
	*/

	#redInput;

	/**
	The green input HTMLElement
	@type {HTMLElement}
	*/

	#greenInput;

	/**
	The blue input HTMLElement
	@type {HTMLElement}
	*/

	#blueInput;

	/**
	The input event listener
	@type {RgbInputEL}
	*/

	#rgbInputEL;

	/**
	Create an input HTMLElement
	@param {String} inputText The text to use for header of the input
	@return {HTMLElement} The crated input HTMLElement
	*/

	#createColorInput ( inputText ) {
		theHTMLElementsFactory.create ( 'text', { value : inputText }, this.#rgbHTMLElement	);
		const inputHtmlElement = theHTMLElementsFactory.create ( 'input',
			{
				type : 'number',
				className : 'TravelNotes-ColorControl-NumberInput',
				min : Color.MIN_COLOR,
				max : Color.MAX_COLOR
			},
			this.#rgbHTMLElement
		);
		inputHtmlElement.addEventListener ( 'input', this.#rgbInputEL, false );

		return inputHtmlElement;
	}

	/**
	The constructor
	@param {ColorControl} colorControl A reference to the color control
	*/

	constructor ( colorControl ) {
		Object.freeze ( this );
		this.#rgbInputEL = new RgbInputEL ( colorControl, this );
		this.#rgbHTMLElement = theHTMLElementsFactory.create ( 'div', null, colorControl.HTMLElements [ ZERO ] );
		this.#redInput = this.#createColorInput ( theTranslator.getText ( 'ColorControl - Red' ) );
		this.#greenInput = this.#createColorInput ( theTranslator.getText ( 'ColorControl - Green' ) );
		this.#blueInput = this.#createColorInput ( theTranslator.getText ( 'ColorControl - Blue' ) );
	}

	/**
	The destructor
	*/

	destructor ( ) {
		this.#redInput.removeEventListener ( 'input', this.#rgbInputEL, false );
		this.#greenInput.removeEventListener ( 'input', this.#rgbInputEL, false );
		this.#blueInput.removeEventListener ( 'input', this.#rgbInputEL, false );
		this.#rgbInputEL = null;
	}

	/**
	The css color value used for the inputs
	@type {String}
	*/

	get cssColor ( ) {
		return new Color (
			Number.parseInt ( this.#redInput.value ),
			Number.parseInt ( this.#greenInput.value ),
			Number.parseInt ( this.#blueInput.value )
		).cssColor;
	}

	set cssColor ( cssColor ) {
		let color = Color.fromCss ( cssColor );
		this.#redInput.value = color.red;
		this.#greenInput.value = color.green;
		this.#blueInput.value = color.blue;
	}

}

export default RgbInputsControlElement;

/* --- End of file --------------------------------------------------------------------------------------------------------- */