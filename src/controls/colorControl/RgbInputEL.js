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

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Input event for the color inputs
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class RgbInputEL {

	/**
	A reference to the ColorControl object
	@type {ColorControl}
	*/

	#colorControl;

	/**
	A reference to the r, g and b input htmlElement of the ColorControl
	@type {RgbInputsControlElement}
	*/

	#rgbInputsControlElement;

	/**
	The constructor
	@param {ColorControl} colorControl A reference to the ColorControl object
	@param {RgbInputsControlElement} rgbInputsControlElement A reference to the r, g and b input htmlElement of the ColorControl
	*/

	constructor ( colorControl, rgbInputsControlElement ) {
		Object.freeze ( this );
		this.#colorControl = colorControl;
		this.#rgbInputsControlElement = rgbInputsControlElement;
	}

	/**
	Event listener method
	@param {Event} inputEvent The event to handle
	*/

	handleEvent ( inputEvent ) {
		inputEvent.stopPropagation ( );
		this.#colorControl.onRgbInput ( this.#rgbInputsControlElement.cssColor );
	}
}

export default RgbInputEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */