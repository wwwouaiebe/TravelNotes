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

import theHTMLSanitizer from '../../../core/htmlSanitizer/HTMLSanitizer.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Simple container for buttons data of the NoteDialogToolbar
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class EditionButtonData {

	/**
	The text to be displayed on the button. Can be HTML
	@type {String}
	*/

	#title;

	/**
	The text to be inserted before the cursor when clicking on the button
	@type {String}
	*/

	#htmlBefore;

	/**
	The text to be inserted after the cursor when clicking on the button. Optional
	@type {String}
	*/

	#htmlAfter;

	/**
	The constructor
	@param {JsonObject} jsonEditionButton A json object with the data for the EditionButton
	*/

	constructor ( jsonEditionButton ) {
		Object.freeze ( this );
		if (
			'string' !== typeof ( jsonEditionButton?.title )
			||
			'string' !== typeof ( jsonEditionButton?.htmlBefore )
			||
			( jsonEditionButton.htmlAfter && 'string' !== typeof ( jsonEditionButton.htmlAfter ) )
		) {
			throw new Error ( 'Invalid toolbar button' );
		}
		let htmlString = ( jsonEditionButton.htmlBefore || '' ) + ( jsonEditionButton.htmlAfter || '' );
		let errorString = theHTMLSanitizer.sanitizeToHtmlString ( htmlString ).errorsString;
		if ( '' === errorString ) {
			this.#title = theHTMLSanitizer.sanitizeToHtmlString ( jsonEditionButton.title ).htmlString;
			if ( '' === this.title ) {
				this.title = '?';
			}
			this.#htmlBefore = jsonEditionButton.htmlBefore || '';
			this.#htmlAfter = jsonEditionButton.htmlAfter || '';
		}
		else {
			throw new Error ( 'Invalid toolbar button : ' + htmlString + errorString );
		}
	}

	/**
	The text to be displayed on the button. Can be HTML
	@type {String}
	*/

	get title ( ) { return this.#title; }

	/**
	The text to be inserted before the cursor when clicking on the button
	@type {String}
	*/

	get htmlBefore ( ) { return this.#htmlBefore; }

	/**
	The text to be inserted after the cursor when clicking on the button. Optional
	@type {String}
	*/

	get htmlAfter ( ) { return this.#htmlAfter; }
}
export default EditionButtonData;

/* --- End of file --------------------------------------------------------------------------------------------------------- */