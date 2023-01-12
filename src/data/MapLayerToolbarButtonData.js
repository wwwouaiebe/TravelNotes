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

import theHTMLSanitizer from '../core/htmlSanitizer/HTMLSanitizer.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A simple container for the layer toolbar buttons properties
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class LayerToolbarButtonData {

	/**
	The text displayed in the button
	@type {String}
	*/

	#text;

	/**
	The button text color
	@type {String}
	*/

	#color;

	/**
	The button background color
	@type {String}
	*/

	#backgroundColor;

	/**
	The constructor
	@param {JsonObject} jsonToolbarData a json object with the data for the button
	*/

	constructor ( jsonToolbarData ) {
		if (
			'string' !== typeof ( jsonToolbarData?.text )
			||
			'string' !== typeof ( jsonToolbarData?.color )
			||
			'string' !== typeof ( jsonToolbarData?.backgroundColor )
		) {
			throw new Error ( 'invalid toolbar for layer' );
		}
		Object.freeze ( this );
		this.#text = theHTMLSanitizer.sanitizeToJsString ( jsonToolbarData.text );
		this.#color = theHTMLSanitizer.sanitizeToColor ( jsonToolbarData.color );
		this.#backgroundColor =	theHTMLSanitizer.sanitizeToColor ( jsonToolbarData.backgroundColor );
	}

	/**
	The text displayed in the button
	@type {String}
	*/

	get text ( ) { return this.#text; }

	/**
	The button text color
	@type {String}
	*/

	get color ( ) { return this.#color; }

	/**
	The button background color
	@type {String}
	*/

	get backgroundColor ( ) { return this.#backgroundColor; }

}

export default LayerToolbarButtonData;

/* --- End of file --------------------------------------------------------------------------------------------------------- */