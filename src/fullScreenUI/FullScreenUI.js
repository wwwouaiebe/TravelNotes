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
		- Created
Doc reviewed 20210914
Tests ...
*/

import theConfig from '../data/Config.js';
import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import theTranslator from '../UILib/Translator.js';
import { ZERO } from '../main/Constants.js';

/**
Click event listener for the UI
*/

class FullScreenClickEL {

	/**
    The constructor
    */

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	*/

	handleEvent ( /* clickEvent */ ) {
		/* eslint-disable-next-line no-use-before-define */
		theFullScreenUI.hide ( );
		/* eslint-disable-next-line no-use-before-define */
		theFullScreenUI.toogle ( );
	}
}

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
    The click event listener
    @type {FullScreenClickEL}
    */

	#fullScreenClickEL;

	/**
    Hide the UI
    */

	hide ( ) {
		if ( this.#timerId ) {
			clearTimeout ( this.#timerId );
			this.#timerId = null;
		}
		this.#mainHTMLElement.removeEventListener ( 'click', this.#fullScreenClickEL, false );
		this.#fullScreenClickEL = null;
		document.body.removeChild ( this.#mainHTMLElement );
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
    Toogle the full screen mode
    */

	async toogle ( ) {
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
		this.#fullScreenClickEL = new FullScreenClickEL ( );
		this.#mainHTMLElement.addEventListener ( 'click', this.#fullScreenClickEL, false );
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