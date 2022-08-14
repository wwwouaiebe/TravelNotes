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
	@param {DialogOptions} options An object with the options to change
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