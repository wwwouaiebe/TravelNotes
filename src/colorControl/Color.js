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
Doc reviewed 20210914
Tests ...
*/

import { ZERO, TWO, THREE, HEXADECIMAL, COLOR_CONTROL } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A simple helper class for the ColorControl
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
			'number' === typeof red && COLOR_CONTROL.maxColorValue >= red && COLOR_CONTROL.minColorValue <= red
				?
				red
				:
				COLOR_CONTROL.maxColorValue;

		this.#green =
			'number' === typeof green && COLOR_CONTROL.maxColorValue >= green && COLOR_CONTROL.minColorValue <= green
				?
				green
				:
				COLOR_CONTROL.maxColorValue;

		this.#blue =
			'number' === typeof blue && COLOR_CONTROL.maxColorValue >= blue && COLOR_CONTROL.minColorValue <= blue
				?
				blue
				:
				COLOR_CONTROL.maxColorValue;
	}

	/**
	The red value of the color
	@type {Number}
	*/

	get red ( ) { return this.#red; }

	set red ( red ) {
		if ( 'number' === typeof red && COLOR_CONTROL.maxColorValue >= red && COLOR_CONTROL.minColorValue <= red ) {
			this.#red = red;
		}
	}

	/**
	The green value of the color
	@type {Number}
	*/

	get green ( ) { return this.#green; }

	set green ( green ) {
		if ( 'number' === typeof green && COLOR_CONTROL.maxColorValue >= green && COLOR_CONTROL.minColorValue <= green ) {
			this.#green = green;
		}
	}

	/**
	The blue value of the color
	@type {Number}
	*/

	get blue ( ) { return this.#blue; }

	set blue ( blue ) {
		if ( 'number' === typeof blue && COLOR_CONTROL.maxColorValue >= blue && COLOR_CONTROL.minColorValue <= blue ) {
			this.#blue = blue;
		}
	}

	/**
	The color in the css HEX format '#RRGGBB'
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

	/**
	Clone the Color
	@return {color} a new color Oject similar to this Color
	*/

	clone ( ) { return new Color ( this.#red, this.#green, this.#blue ); }

	/**
	copy the RGB values of th this Color to the color given as parameter
	@param {Color} color the destination color
	*/

	copyTo ( color ) {
		color.red = this.#red;
		color.green = this.#green;
		color.blue = this.#blue;
	}
}

export default Color;

/* --- End of file --------------------------------------------------------------------------------------------------------- */