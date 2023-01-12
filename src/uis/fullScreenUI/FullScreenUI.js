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

import theConfig from '../../data/Config.js';
import theHTMLElementsFactory from '../../core/uiLib/HTMLElementsFactory.js';
import theTranslator from '../../core/uiLib/Translator.js';
import { ZERO } from '../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class show a message on the screen for the fullscreen activation

See theFullScreenUI for the one and only one instance of this class
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class FullScreenUI {

	/**
	The container
	@type {HTMLElement}
	*/

	#mainHTMLElement;

	/**
	A timerId for the close UI timer
	@type {Number}
	*/

	#timerId = null;

	/**
    Hide the UI
    */

	hide ( ) {
		if ( this.#timerId ) {
			clearTimeout ( this.#timerId );
			this.#timerId = null;
		}
		this.#mainHTMLElement.removeEventListener ( 'click', this.toggle, false );
		document.body.removeChild ( this.#mainHTMLElement );
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
    Toggle the full screen mode
    */

	async toggle ( ) {
		if ( document.fullscreenElement ) {
			await document.exitFullscreen ();
		}
		else {
			await document.body.requestFullscreen ();
		}
	}

	/**
	Show the user interface
	*/

	show ( ) {
		const timeOutDuration = theConfig.FullScreenUI.timeOut;
		if (
			ZERO === timeOutDuration
            ||
            ! document.fullscreenEnabled
            ||
            document.body.clientWidth > theConfig.FullScreenUI.screenMaxWidth
		) {
			return;
		}

		this.#mainHTMLElement = theHTMLElementsFactory.create (
			'div',
			{
				id : 'TravelNotes-FullScreenUI',
				textContent : theTranslator.getText ( 'FullScreenUI - start full screen' )
			},
			document.body
		);
		this.#mainHTMLElement.addEventListener ( 'click', this.toggle, false );
		this.#timerId = setTimeout ( ( ) => this.hide ( ), timeOutDuration );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of ErrorsUI class
@type {FullScreenUI}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theFullScreenUI = new FullScreenUI ( );

export default theFullScreenUI;

/* --- End of file --------------------------------------------------------------------------------------------------------- */