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

import ModalBaseDialog from '../baseDialog/ModalBaseDialog.js';
import ApiKeysDialogToolbar from './ApiKeysDialogToolbar.js';
import theTranslator from '../../core/uiLib/Translator.js';
import ApiKeysControl from './ApiKeysControl.js';
import theErrorsUI from '../../uis/errorsUI/ErrorsUI.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the ApiKeys dialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ApiKeysDialog extends ModalBaseDialog {

	/**
	The dialog toolbar
	@type {ApiKeysDialogToolbar}
	*/

	#toolbar;

	/**
	A div that contains the ApiKeysControl
	@type {HTMLElement}
	*/

	#apiKeysControl;

	/**
	An array with the existing ApiKeys
	@type {Array.<ApiKey>}
	*/

	#apiKeys;

	/**
	A boolean indicating when a ApiKey file was found on the server
	@type {Boolean}
	*/

	#haveApiKeysFile;

	/**
	The constructor
	@param {Array.<ApiKey>} apiKeys An array with the existing ApiKeys
	@param {Boolean} haveApiKeysFile A boolean indicating when a ApiKey file was found on the server
	*/

	constructor ( apiKeys, haveApiKeysFile ) {
		super ( );
		this.#apiKeys = apiKeys;
		this.#haveApiKeysFile = haveApiKeysFile;
	}

	/**
	Create all the controls needed for the dialog.
	Overload of the vase class createContentHTML
	*/

	createContentHTML ( ) {
		this.#apiKeysControl = new ApiKeysControl ( );
		this.#toolbar = new ApiKeysDialogToolbar ( this, this.#apiKeysControl, this.#haveApiKeysFile );
		this.#apiKeysControl.addApiKeys ( this.#apiKeys );

	}

	/**
	Remove all events listeners on the toolbar and controls, so all references to the dialog are released.
	*/

	#destructor ( ) {
		this.#apiKeysControl.destructor ( );
		this.#toolbar.destructor ( );
		this.#toolbar = null;
	}

	/**
	Validate the ApiKeys. Each ApiKey must have a not empty name and a not empty key.
	Duplicate ApiKey names are not allowed
	@return {Boolean} true when all the keys are valid and not duplicated
	*/

	validateApiKeys ( ) {
		this.hideError ( );
		const HaveEmptyOrDuplicate = this.#apiKeysControl.haveEmptyOrDuplicateValues ( );
		if ( HaveEmptyOrDuplicate.haveEmpty ) {
			this.showError (
				theTranslator.getText ( 'ApiKeysDialog - empty api key name or value' )
			);
			return false;
		}
		else if ( HaveEmptyOrDuplicate.haveDuplicate ) {
			this.showError (
				theTranslator.getText ( 'ApiKeysDialog - duplicate api key name found' )
			);
			return false;
		}
		return true;
	}

	/**
	Overload of the BaseDialog.show ( ) method.
	*/

	show ( ) {
		theErrorsUI.showHelp (
			'<p>' + theTranslator.getText ( 'Help - Complete the ApiKeys1' ) + '</p>' +
			'<p>' + theTranslator.getText ( 'Help - Complete the ApiKeys2' ) + '</p>' +
			'<p>' + theTranslator.getText ( 'Help - Complete the ApiKeys3' ) + '</p>'
		);
		return super.show ( );
	}

	/**
	Overload of the BaseDialog.canClose ( ) method.
	@return {Boolean} true when all the ApiKeys have a name and a value and there are no duplicate keys name
	*/

	canClose ( ) {
		return this.validateApiKeys ( );
	}

	/**
	Overload of the BaseDialog.onCancel ( ) method. Called when the cancel button is clicked
	*/

	onCancel ( ) {
		this.#destructor ( );
		super.onCancel ( );
	}

	/**
	Overload of the BaseDialog.onOk ( ) method. Called when the Ok button is clicked
	*/

	onOk ( ) {
		if ( super.onOk ( this.#apiKeysControl.apiKeys ) ) {
			this.#destructor ( );
		}
	}

	/**
	The dialog title. Overload of the BaseDialog.title property
	@type {String}
	*/

	get title ( ) { return theTranslator.getText ( 'ApiKeysDialog - api keys' ); }

	/**
	An HTMLElement that have to be added as toolbar for the dialog.
	Overload of the BaseDialog.toolbarHTMLElement property
	@type {HTMLElement}
	*/

	get toolbarHTMLElement ( ) {
		return this.#toolbar.toolbarHTMLElement;
	}

	/**
	An array with the HTMLElements that have to be added in the content of the dialog.
	@type {Array.<HTMLElement>}
	*/

	get contentHTMLElements ( ) {
		return [ this.#apiKeysControl.controlHTMLElement ];
	}

	/**
	Get a JSON string with the ApiKeys in the control
	@type {String}
	*/

	get apiKeysJSON ( ) { return this.#apiKeysControl.apiKeysJSON; }

	/**
	Add an array of ApiKeys to the dialog.
	@param {Array.<ApiKey>} apiKeys An array with the ApiKeys to add
	*/

	addApiKeys ( apiKeys ) {
		this.#apiKeysControl.addApiKeys ( apiKeys );
	}
}

export default ApiKeysDialog;

/* --- End of file --------------------------------------------------------------------------------------------------------- */