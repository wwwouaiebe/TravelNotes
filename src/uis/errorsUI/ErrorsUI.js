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

import theConfig from '../../data/Config.js';
import theHTMLElementsFactory from '../../core/uiLib/HTMLElementsFactory.js';
import theHTMLSanitizer from '../../core/htmlSanitizer/HTMLSanitizer.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class show a message on the screen

See theErrorsUI for the one and only one instance of this class
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ErrorsUI {

	/**
	The container
	@type {HTMLElement}
	*/

	#mainHTMLElement;

	/**
	The message area
	@type {HTMLElement}
	*/

	#messageHTMLElement;

	/**
	A timerId for the close UI timer
	@type {Number}
	*/

	#timerId;

	/**
	The hide help input
	@type {HTMLElement}
	*/

	#hideHelpInput;

	/**
	The hide help container
	@type {HTMLElement}
	*/

	#hideHelpHTMLElement;

	/**
	The error level. Must be 'Info', 'Help', 'Warning' or 'Error'
	@type {String}
	*/

	#currentErrorLevel;

	/**
	Hide the help window
	*/

	#hide ( ) {
		if ( this.#timerId ) {
			clearTimeout ( this.#timerId );
			this.#timerId = null;
		}
		this.#mainHTMLElement.classList.remove ( 'TravelNotes-ErrorsUI-' + this.#currentErrorLevel );
		this.#mainHTMLElement.classList.add ( 'TravelNotes-Hidden' );
		this.#hideHelpHTMLElement.classList.add ( 'TravelNotes-Hidden' );
		this.#messageHTMLElement.textContent = '';
	}

	/**
	This method show the windows
	@param {String} message The message to be displayed
	@param {String} errorLevel The tpe of window to display
	*/

	#show ( message, errorLevel ) {
		this.#currentErrorLevel = errorLevel;
		if (
			( ! theConfig.errorsUI [ 'show' + this.#currentErrorLevel ] )
			||
			( 'Help' === errorLevel && this.#hideHelpInput.checked )
		) {
			return;
		}
		if ( this.#timerId ) {
			clearTimeout ( this.#timerId );
			this.#timerId = null;
		}
		this.#messageHTMLElement.textContent = '';
		theHTMLSanitizer.sanitizeToHtmlElement ( message, this.#messageHTMLElement );
		this.#mainHTMLElement.classList.add ( 'TravelNotes-ErrorsUI-' + this.#currentErrorLevel );
		this.#mainHTMLElement.classList.remove ( 'TravelNotes-Hidden' );

		let timeOutDuration = theConfig.errorsUI.timeOut;
		if ( 'Help' === this.#currentErrorLevel ) {
			this.#hideHelpHTMLElement.classList.remove ( 'TravelNotes-Hidden' );
			timeOutDuration = theConfig.errorsUI.helpTimeOut;
		}
		this.#timerId = setTimeout ( ( ) => this.#hide ( ), timeOutDuration );
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	creates the user interface
	*/

	createUI ( ) {
		if ( this.#mainHTMLElement ) {
			return;
		}
		this.#mainHTMLElement = theHTMLElementsFactory.create (
			'div',
			{
				id : 'TravelNotes-ErrorsUI',
				className : 'TravelNotes-Hidden'
			},
			document.body
		);
		const headerDiv = theHTMLElementsFactory.create ( 'div', null, this.#mainHTMLElement );
		theHTMLElementsFactory.create (
			'span',
			{
				id : 'TravelNotes-ErrorsUI-CancelButton',
				textContent : '❌'
			},
			headerDiv
		)
			.addEventListener ( 'click', ( ) => this.#hide ( ), false );
		this.#messageHTMLElement = theHTMLElementsFactory.create (
			'div',
			{
				id : 'TravelNotes-ErrorsUI-Message'
			},
			this.#mainHTMLElement
		);
		this.#hideHelpHTMLElement = theHTMLElementsFactory.create (
			'div',
			{
				id : 'TravelNotes-ErrorsUI-HelpInputDiv',
				className : 'TravelNotes-Hidden'
			},
			this.#mainHTMLElement
		);
		this.#hideHelpInput = theHTMLElementsFactory.create (
			'input',
			{
				id : 'TravelNotes-ErrorsUI-HelpInput',
				type : 'checkbox',
				checked : ! theConfig.errorsUI.showHelp
			},
			this.#hideHelpHTMLElement
		);
		theHTMLElementsFactory.create (
			'label',
			{
				id : 'TravelNotes-ErrorsUI-HelpInputLabel',
				htmlFor : 'TravelNotes-ErrorsUI-HelpInput',
				textContent : 'Don\'t show help again'

				// not possible to translate. We need the ErrorsUI for loading translations!
				// textContent : theTranslator.getText ( 'ErrorUI - Dont show again' )
			},
			this.#hideHelpHTMLElement
		);
	}

	/**
	Show an error message ( a white text on a red background )

	See theConfig.errorsUI.showError to disable or enable the error messages
	@param {String} error The error message to display
	*/

	showError ( error ) { this.#show ( error, 'Error' ); }

	/**
	Show an warning message ( a black text on an orange background )

	See theConfig.errorsUI.showWarning to disable or enable the warning messages
	@param {String} warning The warning message to display
	*/

	showWarning ( warning ) { this.#show ( warning, 'Warning' ); }

	/**
	Show an info message ( a black text on a white background )
	@see theConfig.errorsUI.showInfo to disable or enable the info messages
	@param {String} info The info message to display
	*/

	showInfo ( info ) { this.#show ( info, 'Info' ); }

	/**
	Show a help message ( a black text on a white background )

	See theConfig.errorsUI.showHelp to disable or enable the help messages and the
	checkbox in the UI to disable the help
	@param {String} help The help message to display
	*/

	showHelp ( help ) { this.#show ( help, 'Help' ); }

}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of ErrorsUI class
@type {ErrorsUI}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theErrorsUI = new ErrorsUI ( );

export default theErrorsUI;

/* --- End of file --------------------------------------------------------------------------------------------------------- */