/*
Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/

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
	- v1.6.0:
		- created
	- v1.10.0:
		- Issue ♯107 : Add a button to reload the APIKeys file in the API keys dialog
	- v1.11.0:
		- Issue ♯108 : Add a warning when an error occurs when reading the APIKeys file at startup reopened
	- v1.11.0:
		- Issue ♯113 : When more than one dialog is opened, using thr Esc or Return key close all the dialogs
	- v2.0.0:
		- Issue ♯135 : Remove innerHTML from code
		- Issue ♯137 : Remove html tags from json files
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210914
Tests ...
*/

import BaseDialog from '../dialogBase/BaseDialog.js';
import APIKeysDialogToolbar from '../dialogAPIKeys/APIKeysDialogToolbar.js';
import { APIKeyDeletedEL } from '../dialogAPIKeys/APIKeysDialogEventListeners.js';
import theTranslator from '../UILib/Translator.js';
import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import APIKeysDialogKeyControl from '../dialogAPIKeys/APIKeysDialogKeyControl.js';
import theErrorsUI from '../errorsUI/ErrorsUI.js';

import { ZERO } from '../main/Constants.js';

/**
@------------------------------------------------------------------------------------------------------------------------------

@classdesc This class is the APIKeys dialog

@------------------------------------------------------------------------------------------------------------------------------
*/

class APIKeysDialog extends BaseDialog {

	/**
	A map to store the APIKeyControl object
	@type {Map}
	*/

	#APIKeysControls;

	/**
	The dialog toolbar
	@type {APIKeysDialogToolbar}
	*/

	#toolbar;

	/**
	A div that contains the APIKeyControls
	@type {HTMLElement}
	*/

	#APIKeysControlsContainer;

	/**
	Api key deleted event listener
	@type {APIKeyDeletedEL}
	*/

	#onAPIKeyDeletedEventListener;

	/**
	Create the #APIKeysControlsContainer
	*/

	#createAPIKeysControlsContainer ( ) {
		this.#APIKeysControlsContainer = theHTMLElementsFactory.create ( 'div' );
		this.#onAPIKeyDeletedEventListener = new APIKeyDeletedEL ( this, this.#APIKeysControls );
		this.#APIKeysControlsContainer.addEventListener (
			'apikeydeleted',
			this.#onAPIKeyDeletedEventListener,
			false
		);
	}

	/**
	The constructor
	@param {Array.<APIKey>} APIKeys An array with the existing APIKeys
	@param {Boolean} haveAPIKeysFile A boolean indicating when a APIKey file was found on the server
	*/

	constructor ( APIKeys, haveAPIKeysFile ) {

		super ( );

		this.#APIKeysControls = new Map ( );
		this.#toolbar = new APIKeysDialogToolbar ( this, this.#APIKeysControls, haveAPIKeysFile );
		this.#createAPIKeysControlsContainer ( );
		this.addAPIKeys ( APIKeys );
	}

	/**
	Remove all events listeners on the toolbar and controls, so all references to the dialog are released.
	*/

	#destructor ( ) {
		this.#toolbar.destructor ( );
		this.#toolbar = null;
		this.#APIKeysControlsContainer.removeEventListener (
			'apikeydeleted',
			this.#onAPIKeyDeletedEventListener,
			false
		);
		this.#onAPIKeyDeletedEventListener = null;
	}

	/**
	Validate the APIKeys. Each APIKey must have a not empty name and a not empty key.
	Duplicate APIKey names are not allowed
	@return {Boolean} true when all the keys are valid and not duplicated
	*/

	validateAPIKeys ( ) {
		this.hideError ( );
		let haveEmptyValues = false;
		const providersNames = [];
		this.#APIKeysControls.forEach (
			APIKeyControl => {
				haveEmptyValues =
					haveEmptyValues ||
					'' === APIKeyControl.providerName
					||
					'' === APIKeyControl.providerKey;
				providersNames.push ( APIKeyControl.providerName );
			}
		);
		let haveDuplicate = false;
		providersNames.forEach (
			providerName => {
				haveDuplicate =
					haveDuplicate ||
					providersNames.indexOf ( providerName ) !== providersNames.lastIndexOf ( providerName );
			}
		);
		if ( haveEmptyValues ) {
			this.showError (
				theTranslator.getText ( 'APIKeysDialog - empty API key name or value' )
			);
			return false;
		}
		else if ( haveDuplicate ) {
			this.showError (
				theTranslator.getText ( 'APIKeysDialog - duplicate API key name found' )
			);
			return false;
		}
		return true;
	}

	/**
	Add an array of APIKeys to the dialog.
	@param {Array.<APIKey>} APIKeys An array with the APIKeys to add
	*/

	addAPIKeys ( APIKeys ) {
		this.#APIKeysControls.clear ( );
		APIKeys.forEach (
			APIKey => {
				const APIKeyControl = new APIKeysDialogKeyControl ( APIKey );
				this.#APIKeysControls.set ( APIKeyControl.objId, APIKeyControl );
			}
		);
		this.refreshAPIKeys ( );
	}

	/**
	Remove all elements from the #APIKeysControlsContainer and add the existing APIKeys
	*/

	refreshAPIKeys ( ) {
		while ( this.#APIKeysControlsContainer.firstChild ) {
			this.#APIKeysControlsContainer.removeChild ( this.#APIKeysControlsContainer.firstChild );
		}
		this.#APIKeysControls.forEach (
			APIKeyControl => { this.#APIKeysControlsContainer.appendChild ( APIKeyControl.HTMLElements [ ZERO ] ); }
		);
	}

	/**
	Overload of the BaseDialog.onShow ( ) method.
	*/

	onShow ( ) {
		theErrorsUI.showHelp (
			'<p>' + theTranslator.getText ( 'Help - Complete the APIKeys1' ) + '</p>' +
			'<p>' + theTranslator.getText ( 'Help - Complete the APIKeys2' ) + '</p>' +
			'<p>' + theTranslator.getText ( 'Help - Complete the APIKeys3' ) + '</p>'
		);
	}

	/**
	Overload of the BaseDialog.canClose ( ) method.
	@return {Boolean} true when all the APIKeys have a name and a value and there are no duplicate keys name
	*/

	canClose ( ) {
		return this.validateAPIKeys ( );
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
		const APIKeys = [];
		this.#APIKeysControls.forEach (
			APIKeyControl => APIKeys.push ( APIKeyControl.APIKey )
		);
		if ( super.onOk ( APIKeys ) ) {
			this.#destructor ( );
		}
	}

	/**
	The dialog title. Overload of the BaseDialog.title property
	@type {String}
	*/

	get title ( ) { return theTranslator.getText ( 'APIKeysDialog - API keys' ); }

	/**
	An array with the HTMLElements that have to be added in the content of the dialog.
	@type {Array.<HTMLElement>}
	*/

	get contentHTMLElements ( ) {
		return [ this.#toolbar.rootHTMLElement, this.#APIKeysControlsContainer ];
	}
}

export default APIKeysDialog;

/*
--- End of APIKeysDialog.js file --------------------------------------------------------------------------------------
*/