/*
Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/

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

/**
@------------------------------------------------------------------------------------------------------------------------------

@file ColorControl.js
@copyright Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/
@license GNU General Public License
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@module dialogColorControl

@------------------------------------------------------------------------------------------------------------------------------
*/

import theTranslator from '../UILib/Translator.js';
import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import { RedSliderInputEL, ColorInputEL, ColorButtonClickEL } from '../dialogColorControl/ColorControlEventListeners.js';
import Color from '../dialogColorControl/Color.js';

import { ZERO, COLOR_CONTROL } from '../main/Constants.js';

/**
@------------------------------------------------------------------------------------------------------------------------------

@class ColorControl
@classdesc html control for color selection
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class ColorControl {

	/**
	the main HTMLElement
	@type {HTMLElement}
	*/

	#colorDiv;

	/**
	An array with the color buttons of the ColorControl
	@type {Array.<HTMLElement>}
	*/

	#colorButtons;

	/**
	The red, green and blue input htmlElement of the ColorControl
	@type {Object}
	*/

	#inputs;

	/**
	The red slider
	@type {HTMLElement}
	*/

	#redSliderInput;

	/**
	A div that contains the red green and blue inputs
	@type {HTMLElement}
	*/

	#rgbDiv;

	/**
	The sample color div of the color control
	@type {HTMLElement}
	*/

	#colorSampleDiv;

	/**
	The new color
	@type {Color}
	*/

	#newColor;

	/**
	Click event listener for the color buttons
	@type {ColorButtonClickEL}
	*/

	#colorButtonClickEL;

	/**
	Input event listener for the color inputs
	@type {ColorInputEL}
	*/

	#colorInputEL;

	/**
	Input event listener for the red slider
	@type {RedSliderInputEL}
	*/

	#redSliderInputEL;

	/**
	Create the Color Buttons div
	*/

	#createColorButtonsDiv ( ) {
		const colorButtonsDiv = theHTMLElementsFactory.create ( 'div', null, this.#colorDiv );
		const cellColor = new Color ( COLOR_CONTROL.initialRed, COLOR_CONTROL.minColorValue, COLOR_CONTROL.minColorValue 	);
		this.#colorButtonClickEL = new ColorButtonClickEL ( this );

		for ( let rowCounter = ZERO; rowCounter < COLOR_CONTROL.rowsNumber; ++ rowCounter ) {
			const colorButtonsRowDiv = theHTMLElementsFactory.create ( 'div', null, colorButtonsDiv );

			cellColor.green = COLOR_CONTROL.minColorValue;

			for ( let cellCounter = ZERO; cellCounter < COLOR_CONTROL.cellsNumber; ++ cellCounter ) {
				const colorButtonCellDiv = theHTMLElementsFactory.create (
					'div',
					{
						className : 'TravelNotes-ColorControl-CellColorDiv'
					},
					colorButtonsRowDiv
				);
				colorButtonCellDiv.style [ 'background-color' ] = cellColor.cssColor;
				colorButtonCellDiv.addEventListener ( 'click', this.#colorButtonClickEL, false );
				cellColor.green += COLOR_CONTROL.deltaColor;
				this.#colorButtons.push ( colorButtonCellDiv );
			}
			cellColor.blue += COLOR_CONTROL.deltaColor;
		}
	}

	/**
	Create the Red Slider div
	*/

	#createRedSliderDiv ( ) {
		const redSliderDiv = theHTMLElementsFactory.create ( 'div', null, this.#colorDiv );
		this.#redSliderInput = theHTMLElementsFactory.create ( 'input',
			{
				type : 'range',
				value : Math.ceil (
					COLOR_CONTROL.initialRed * ( COLOR_CONTROL.sliderMaxValue / COLOR_CONTROL.maxColorValue )
				),
				min : ZERO,
				max : COLOR_CONTROL.sliderMaxValue,
				step : COLOR_CONTROL.sliderStep

			},
			redSliderDiv
		);

		this.#redSliderInputEL = new RedSliderInputEL ( this.#colorButtons );
		this.#redSliderInput.addEventListener ( 'input', this.#redSliderInputEL, false );

		this.#redSliderInput.focus ( );
	}

	/**
	create the color inputs and text
	@param {string} inputText The text before the input
	@param {!number} inputValue The input value
	@return {HTMLElement} the input object
	*/

	#createColorInput ( inputText, inputValue ) {
		theHTMLElementsFactory.create ( 'text', { value : inputText }, this.#rgbDiv	);
		const inputHtmlElement = theHTMLElementsFactory.create ( 'input',
			{
				type : 'number',
				className : 'TravelNotes-ColorControl-NumberInput',
				value : inputValue,
				min : COLOR_CONTROL.minColorValue,
				max : COLOR_CONTROL.maxColorValue
			},
			this.#rgbDiv
		);
		inputHtmlElement.addEventListener ( 'input', this.#colorInputEL, false );

		return inputHtmlElement;
	}

	/**
	Create the Color Input div
	*/

	#createColorInputsDiv ( ) {
		this.#rgbDiv = theHTMLElementsFactory.create ( 'div', null, this.#colorDiv );

		this.#colorInputEL = new ColorInputEL ( this, this.#inputs );

		this.#inputs.red = this.#createColorInput (
			theTranslator.getText ( 'ColorControl - Red' ),
			this.#newColor.red,
		);
		this.#inputs.green = this.#createColorInput (
			theTranslator.getText ( 'ColorControl - Green' ),
			this.#newColor.green,
		);
		this.#inputs.blue = this.#createColorInput (
			theTranslator.getText ( 'ColorControl - Blue' ),
			this.#newColor.blue,
		);
	}

	/**
	Create the Color Sample div
	*/

	#createColorSampleDiv ( ) {
		this.#colorSampleDiv = theHTMLElementsFactory.create (
			'div',
			{
				id : 'TravelNotes-ColorControl-ColorSampleDiv'
			},
			this.#colorDiv
		);
		this.#colorSampleDiv.style [ 'background-color' ] = this.#newColor.cssColor;
	}

	/**
	constructor
	@param {string} cssColor The initial color for the control (must be #RRGGBB or rgb(RR, GG, BB) .
	*/

	constructor ( cssColor ) {
		Object.freeze ( this );
		this.#colorButtons = [];
		this.#inputs = Object.seal (
			{
				red : null,
				green : null,
				blue : null
			}
		);
		this.#newColor = new Color ( );
		this.#newColor.cssColor = cssColor;
		this.#colorDiv = theHTMLElementsFactory.create (
			'div',
			{
				id : 'TravelNotes-ColorControl-ColorDiv'
			}
		);
		this.#createColorButtonsDiv ( );
		this.#createRedSliderDiv ( );
		this.#createColorInputsDiv ( );
		this.#createColorSampleDiv ( );
	}

	/**
	Remove event listeners
	*/

	destructor ( ) {
		this.#colorButtons.forEach (
			colorButton => {
				colorButton.removeEventListener ( 'click', this.#colorButtonClickEL, false );
			}
		);
		this.#colorButtonClickEL = null;

		for ( const colorInput in this.#inputs ) {
			this.#inputs [ colorInput ].removeEventListener ( 'input', this.#colorInputEL, false );
		}
		this.#colorInputEL = null;

		this.#redSliderInput.removeEventListener ( 'input', this.#redSliderInputEL, false );
		this.#redSliderInputEL = null;
	}

	/**
	An array with the HTML element of the control
	@type {Array.<HTMLElement>}
	*/

	get HTMLElements ( ) { return [ this.#colorDiv ]; }

	/**
	The color selected in the control in the css hex format ( #rrggbb )
	@type {string}
	*/

	get cssColor ( ) { return this.#newColor.cssColor; }

	/**
	Change the default color of the control and set the inputs, sample div and newColor to the given color
	@param {Volor} newColor The color to set as default color
	*/

	set color ( newColor ) {
		this.#inputs.red.value = newColor.red;
		this.#inputs.green.value = newColor.green;
		this.#inputs.blue.value = newColor.blue;
		this.#colorSampleDiv.style [ 'background-color' ] = newColor.cssColor;
		newColor.copyTo ( this.#newColor );
	}

}

export default ColorControl;

/*
@------------------------------------------------------------------------------------------------------------------------------

end of ColorControlEventListeners.js file

@------------------------------------------------------------------------------------------------------------------------------
*/