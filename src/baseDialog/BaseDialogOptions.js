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
		- created
Doc reviewed 20220828
Tests ...
*/

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
An object to gives some options to a dialog, mainly for generic dialogs (SelectDialog, TwoButtonsDialog)
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class BaseDialogOptions {

	/**
	The text to be displayed on the first button on the bottom of the dialog. Default to 🆗
	@type {?String}
	*/

	#firstButtonText = null;

	/**
	The text to be displayed on the first button on the bottom of the dialog
	@type {?String}
	*/

	#secondButtonText = null;

	/**
	Options for the SelectDialog
	@type {Array.<SelectOptionData>}
	*/

	#selectOptionsData = null;

	/**
	title of the dialog
	@type {?String}
	*/

	#title = null;

	/**
	A text to be displayed in the dialog
	@type {?String}
	*/

	#text = null;

	/**
	The constructor
	@param {Object} options An object litteral with the options to change
	*/

	constructor ( options ) {
		for ( const property in options ) {
			switch ( property ) {
			case 'firstButtonText' :
				this.#firstButtonText = options.firstButtonText;
				break;
			case 'secondButtonText' :
				this.#secondButtonText = options.secondButtonText;
				break;
			case 'selectOptionsData' :
				this.#selectOptionsData = options.selectOptionsData;
				break;
			case 'title' :
				this.#title = options.title;
				break;
			case 'text' :
				this.#text = options.text;
				break;
			default :
				break;
			}
		}
	}

	/**
	The text to be displayed on the first button on the bottom of the dialog. Default to 🆗
	@type {?String}
	*/

	get firstButtonText ( ) { return this.#firstButtonText; }

	/**
	The text to be displayed on the first button on the bottom of the dialog
	@type {?String}
	*/

	get secondButtonText ( ) { return this.#secondButtonText; }

	/**
	Options for the SelectDialog
	@type {Array.<SelectOptionData>}
	*/

	get selectOptionsData ( ) { return this.#selectOptionsData; }

	/**
	title of the dialog
	@type {?String}
	*/

	get title ( ) { return this.#title; }

	/**
	A text to be displayed in the dialog
	@type {?String}
	*/

	get text ( ) { return this.#text; }
}

export default BaseDialogOptions;

/* --- End of file --------------------------------------------------------------------------------------------------------- */