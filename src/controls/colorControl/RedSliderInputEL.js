
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

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Input event listener for the red slider
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class RedSliderInputEL {

	/**
	A reference to the ColorControl object
	@type {ColorControl}
	*/

	#colorControl;

	/**
	A coefficient to use to transform the slider value into a color value
	Slider value are from 0 to RedSliderControlElement.SLIDER_MAX_VALUE, Color values are from 0 to Color.MAX_COLOR
	@type {Number}
	*/

	#colorCoef;

	/**
	The constructor
	@param {ColorControl} colorControl A reference to the ColorControl object
	@param {Number} colorCoef A coefficient to use to transform the slider value into a color value
	*/

	constructor ( colorControl, colorCoef ) {
		Object.freeze ( this );
		this.#colorControl = colorControl;
		this.#colorCoef = colorCoef;
	}

	/**
	Event listener
	@param {Event} inputEvent The event to handle
	*/

	handleEvent ( inputEvent ) {
		inputEvent.stopPropagation ( );

		let red = inputEvent.target.valueAsNumber * this.#colorCoef;

		// With js 100 * 2.55 = 254.99999999
		red = red - Math.floor ( red ) < Math.ceil ( red ) - red
			?
			Math.floor ( red )
			:
			Math.ceil ( red );

		this.#colorControl.onRedSliderInput ( red );
	}
}

export default RedSliderInputEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */