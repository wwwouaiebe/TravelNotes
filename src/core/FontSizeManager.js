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

import theConfig from '../data/Config.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A simple container to store the font size
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class FontSizeManager {

	/**
	The font size
	@type {Number}
	*/

	#fontSize;

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );

		// It's needed to initialize the fontSize in the increment or decrement functions because
		// theFontSizeManager is a global object created before theConfig initialization
		this.#fontSize = null;
	}

	/**
	Increment the font size
	*/

	increment ( ) {
		if ( ! this.#fontSize ) {
			this.#fontSize = theConfig.fontSize.initialValue;
		}
		this.#fontSize += theConfig.fontSize.incrementValue;
		document.body.style [ 'font-size' ] = String ( this.#fontSize ) + 'mm';
	}

	/**
	Decrement the font size
	*/

	decrement ( ) {
		if ( ! this.#fontSize ) {
			this.#fontSize = theConfig.fontSize.initialValue;
		}
		this.#fontSize -= theConfig.fontSize.incrementValue;
		document.body.style [ 'font-size' ] = String ( this.#fontSize ) + 'mm';
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of FontSizeManager class
@type {FontSizeManager}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theFontSizeManager = new FontSizeManager ( );

export default theFontSizeManager;

/* --- End of file --------------------------------------------------------------------------------------------------------- */