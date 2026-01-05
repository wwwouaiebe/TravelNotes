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
import { ZERO } from '../../main/Constants.js';
import Color from './Color.js';
import ColorButtonClickEL from './ColorButtonClickEL.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The element with the 36 color buttons
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ColorButtonsControlElement {

	/**
	The main Element
	@type {HTMLElement}
	*/

	#colorButtonsHTMLElement;

	/**
	An array with the buttons
	@type {Array.<HTMLElement>}
	*/

	#colorButtons;

	/**
	The button click event listener
	@type {ColorButtonClickEL}
	*/

	#colorButtonClickEL;

	/**
	The number of rows buttons in the control
	@type {Number}
	*/
	// eslint-disable-next-line no-magic-numbers
	static get #ROW_NUMBERS ( ) { return 6; }

	/**
	The number of buttons in a row
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #CELL_NUMBERS ( ) { return 6; }

	/**
	The number to use for incrementation of the color between two buttons
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #DELTA_COLOR ( ) { return 51; }

	/**
	The constructor
	@param {ColorControl} colorControl A reference to the color control
	*/

	constructor ( colorControl ) {
		Object.freeze ( this );
		this.#colorButtons = [];
		this.#colorButtonClickEL = new ColorButtonClickEL ( colorControl );
		this.#colorButtonsHTMLElement = theHTMLElementsFactory.create ( 'div', null, colorControl.controlHTMLElement );
		for ( let rowCounter = ZERO; rowCounter < ColorButtonsControlElement.#ROW_NUMBERS; ++ rowCounter ) {
			const colorButtonsRowHTMLElement = theHTMLElementsFactory.create ( 'div', null, this.#colorButtonsHTMLElement );
			for ( let cellCounter = ZERO; cellCounter < ColorButtonsControlElement.#CELL_NUMBERS; ++ cellCounter ) {
				let colorButton = theHTMLElementsFactory.create (
					'div',
					{
						className : 'travelnotes-color-control-cell-color'
					},
					colorButtonsRowHTMLElement
				);
				colorButton.addEventListener ( 'click', this.#colorButtonClickEL, false );
				this.#colorButtons.push ( colorButton );
			}
		}
	}

	/**
	Destructor
	*/

	destructor ( ) {
		this.#colorButtons.forEach (
			colorButton => { colorButton.removeEventListener ( 'click', this.#colorButtonClickEL, false ); }
		);
		this.#colorButtonClickEL = null;
	}

	/**
	Set the red component of the color buttons
	*/

	set red ( red ) {
		let backgroundColor = new Color ( red, Color.MIN_COLOR, Color.MIN_COLOR );
		this.#colorButtons.forEach (
			colorButton => {
				colorButton.style [ 'background-color' ] = backgroundColor.cssColor;
				if ( Color.MAX_COLOR <= backgroundColor.green ) {
					backgroundColor.green = Color.MIN_COLOR;
					backgroundColor.blue += ColorButtonsControlElement.#DELTA_COLOR;
				}
				else {
					backgroundColor.green += ColorButtonsControlElement.#DELTA_COLOR;
				}
			}
		);
	}
}

export default ColorButtonsControlElement;

/* --- End of file --------------------------------------------------------------------------------------------------------- */