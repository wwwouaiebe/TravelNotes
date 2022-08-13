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

import Color from '../dialogColorControl/Color.js';
import { ZERO, COLOR_CONTROL } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Input event listener for the red slider
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class RedSliderInputEL {

	/**
	A reference to the array with the color buttons of the ColorControl
	@type {Array.<HTMLElement>}
	*/

	#colorButtons;

	/**
	The constructor
	@param {Array.<HTMLElement>} colorButtons A reference to the array with the color buttons of the ColorControl
	*/

	constructor ( colorButtons ) {
		Object.freeze ( this );
		this.#colorButtons = colorButtons;
	}

	/**
	Event listener
	@param {Event} inputEvent The event to handle
	*/

	handleEvent ( inputEvent ) {
		inputEvent.stopPropagation ( );
		const newColor = new Color ( );

		// Math.ceil because with JS 100 * 2.55 = 254.99999....
		newColor.red =
			Math.ceil ( inputEvent.target.valueAsNumber * ( COLOR_CONTROL.maxColorValue / COLOR_CONTROL.sliderMaxValue ) );
		for ( let rowCounter = ZERO; rowCounter < COLOR_CONTROL.rowsNumber; ++ rowCounter ) {
			newColor.blue = rowCounter * COLOR_CONTROL.deltaColor;
			for ( let cellCounter = ZERO; cellCounter < COLOR_CONTROL.rowsNumber; ++ cellCounter ) {
				newColor.green = cellCounter * COLOR_CONTROL.deltaColor;
				this.#colorButtons [ ( COLOR_CONTROL.rowsNumber * rowCounter ) + cellCounter ]
					.style [ 'background-color' ] = newColor.cssColor;
			}
		}

	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Input event for the color inputs
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ColorInputEL {

	/**
	A reference to the ColorControl object
	@type {ColorControl}
	*/

	#colorControl;

	/**
	A reference to the red, green and blue input htmlElement of the ColorControl
	@type {ColorInputs}
	*/

	#inputs;

	/**
	The constructor
	@param {ColorControl} colorControl A reference to the ColorControl object
	@param {ColorInputs} inputs A reference to the red, green and blue input htmlElement of the ColorControl
	*/

	constructor ( colorControl, inputs ) {
		Object.freeze ( this );
		this.#colorControl = colorControl;
		this.#inputs = inputs;
	}

	/**
	Event listener method
	@param {Event} inputEvent The event to handle
	*/

	handleEvent ( inputEvent ) {
		inputEvent.stopPropagation ( );
		const newColor = new Color (
			Number.parseInt ( this.#inputs.red.value ),
			Number.parseInt ( this.#inputs.green.value ),
			Number.parseInt ( this.#inputs.blue.value )
		);
		this.#colorControl.color = newColor;
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
click event listener for the color buttons
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ColorButtonClickEL {

	/**
	A reference to the ColorControl object
	@type {ColorControl}
	*/

	#colorControl = null;

	/**
	The constructor
	@param {ColorControl} colorControl A reference to the ColorControl object
	*/

	constructor ( colorControl ) {
		Object.freeze ( this );
		this.#colorControl = colorControl;
	}

	/**
	Event listener method
	@param {Event} clickEvent The event to handle
	*/

	handleEvent ( clickEvent ) {
		clickEvent.stopPropagation ( );
		const newColor = new Color ( );
		newColor.cssColor = clickEvent.target.style [ 'background-color' ];
		this.#colorControl.color = newColor;
	}

}

export {
	RedSliderInputEL,
	ColorInputEL,
	ColorButtonClickEL
};

/* --- End of file --------------------------------------------------------------------------------------------------------- */