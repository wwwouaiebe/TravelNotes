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

import theHTMLElementsFactory from '../../core/uiLib/HTMLElementsFactory.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The element with the color sample
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class SampleControlElement {

	/**
	The main HTMLElement
	@type {HTMLElement}
	*/

	#sampleHTMLElement;

	/**
	The constructor
	@param {ColorControl} colorControl A reference to the color control
	*/

	constructor ( colorControl ) {
		Object.freeze ( this );
		this.#sampleHTMLElement = theHTMLElementsFactory.create (
			'div',
			{
				id : 'TravelNotes-ColorControl-ColorSampleHTMLElement'
			},
			colorControl.controlHTMLElement
		);
	}

	/**
	The css color value used for the sample
	@type {String}
	*/

	get cssColor ( ) {
		return this.#sampleHTMLElement.style [ 'background-color' ];
	}

	set cssColor ( cssColor ) {
		this.#sampleHTMLElement.style [ 'background-color' ] = cssColor;
	}

}

export default SampleControlElement;

/* --- End of file --------------------------------------------------------------------------------------------------------- */