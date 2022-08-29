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
	- v3.2.0:
		- Issue ♯9 : String.substr ( ) is deprecated... Replace...
Doc reviewed 20220829
Tests ...
*/

import { ZERO, TWO, THREE, HEXADECIMAL } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A simple container for a color, mainly used to convert from css format to numbers and vice-versa
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class Color {

	/**
	The red value of the color
	@type {Number}
	*/

	#red;

	/**
	The green value of the color
	@type {Number}
	*/

	#green;

	/**
	The blue value of the color
	@type {Number}
	*/

	#blue;

	/**
	The constructor
	@param {?number} red The red value of the color. Must be between 0 and 255. If null set to 255
	@param {?number} green The green value of the color. Must be between 0 and 255. If null set to 255
	@param {?number} blue The blue value of the color. Must be between 0 and 255. If null set to 255
	*/

	constructor ( red, green, blue ) {
		Object.freeze ( this );
		this.#red =
			'number' === typeof red && Color.MAX_COLOR >= red && Color.MIN_COLOR <= red
				?
				red
				:
				Color.MAX_COLOR;
		this.#green =
			'number' === typeof green && Color.MAX_COLOR >= green && Color.MIN_COLOR <= green
				?
				green
				:
				Color.MAX_COLOR;
		this.#blue =
			'number' === typeof blue && Color.MAX_COLOR >= blue && Color.MIN_COLOR <= blue
				?
				blue
				:
				Color.MAX_COLOR;
	}

	/**
	The smallest acceptable value fo a color
	@type {Number}
	*/

	/* eslint-disable-next-line no-magic-numbers */
	static get MIN_COLOR ( ) { return 0; }

	/**
	The bigest acceptable value fo a color
	@type {Number}
	*/

	/* eslint-disable-next-line no-magic-numbers */
	static get MAX_COLOR ( ) { return 255; }

	/**
	A static method that build a Color object from a css color string
	@param {String} cssColor The css color string
	@return {Color} A new color object set to the color in the css string
	*/

	static fromCss ( cssColor ) {
		let color = new Color ( );
		color.cssColor = cssColor;
		return color;
	}

	/**
	The red value of the color
	@type {Number}
	*/

	get red ( ) { return this.#red; }

	set red ( red ) {
		if ( 'number' === typeof red && Color.MAX_COLOR >= red && Color.MIN_COLOR <= red ) {
			this.#red = red;
		}
	}

	/**
	The green value of the color
	@type {Number}
	*/

	get green ( ) { return this.#green; }

	set green ( green ) {
		if ( 'number' === typeof green && Color.MAX_COLOR >= green && Color.MIN_COLOR <= green ) {
			this.#green = green;
		}
	}

	/**
	The blue value of the color
	@type {Number}
	*/

	get blue ( ) { return this.#blue; }

	set blue ( blue ) {
		if ( 'number' === typeof blue && Color.MAX_COLOR >= blue && Color.MIN_COLOR <= blue ) {
			this.#blue = blue;
		}
	}

	/**
	The color in the css HEX format '#RRGGBB' or 'rgb( )'
	@type {String}
	*/

	get cssColor ( ) {
		return '\u0023' +
			this.#red.toString ( HEXADECIMAL ).padStart ( TWO, '0' ) +
			this.#green.toString ( HEXADECIMAL ).padStart ( TWO, '0' ) +
			this.#blue.toString ( HEXADECIMAL ).padStart ( TWO, '0' );
	}

	set cssColor ( cssColor ) {
		if ( '\u0023' === cssColor [ ZERO ] ) {
			// eslint-disable-next-line no-magic-numbers
			this.#red = Number.parseInt ( cssColor.substring ( 1, 3 ), HEXADECIMAL );
			// eslint-disable-next-line no-magic-numbers
			this.#green = Number.parseInt ( cssColor.substring ( 3, 5 ), HEXADECIMAL );
			// eslint-disable-next-line no-magic-numbers
			this.#blue = Number.parseInt ( cssColor.substring ( 5, 7 ), HEXADECIMAL );
		}
		else if ( 'rgb' === cssColor.substring ( ZERO, THREE ) ) {
			[ this.#red, this.#green, this.#blue ] =
				Array.from ( cssColor.match ( /[0-9]{1,3}/g ), value => Number.parseInt ( value ) );
		}
	}
}

export default Color;

/* --- End of file --------------------------------------------------------------------------------------------------------- */